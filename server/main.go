package main

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	melody "gopkg.in/olahol/melody.v1"
)

type RGBInput struct {
	Red   int `json:"red"`
	Green int `json:"green"`
	Blue  int `json:"blue"`
}

func main() {
	r := chi.NewRouter()
	m := melody.New()

	r.Use(middleware.Logger)

	r.Get("/ws/channel/*", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		m.BroadcastFilter(msg, func(q *melody.Session) bool {
			return q.Request.URL.Path == s.Request.URL.Path
		})
	})

	workDir, _ := os.Getwd()
	fileServer(r, "/static", http.Dir(filepath.Join(workDir, "./client/dist/static")))

	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./client/dist/index.html")
	})

	http.ListenAndServe(":8080", r)
}

func fileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	}))
}
