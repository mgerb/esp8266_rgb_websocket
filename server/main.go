package main

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	melody "gopkg.in/olahol/melody.v1"
)

type socketData struct {
	Type  string `json:"type"`
	Red   int    `json:"red"`
	Green int    `json:"green"`
	Blue  int    `json:"blue"`
}

var rgbCache = make(map[string]*socketData)

func main() {
	r := chi.NewRouter()
	m := melody.New()

	r.Use(middleware.Logger)

	r.Get("/ws/channel/*", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		newRequestData := &socketData{}
		json.Unmarshal(msg, newRequestData)

		// if it is the initial request from the client
		// send the cached RGB color values
		if newRequestData.Type == "init" {
			response := rgbCache[s.Request.URL.Path]

			// the cache may be nil on first request
			if response == nil {
				response = &socketData{
					Type:  "init",
					Red:   0,
					Green: 0,
					Blue:  0,
				}
			} else {
				response.Type = "init"
			}

			res, _ := json.Marshal(response)
			s.Write(res)
		} else {

			// cache RGB values per channel(url)
			rgbCache[s.Request.URL.Path] = newRequestData

			// send data to clients on the same channel
			m.BroadcastFilter(msg, func(q *melody.Session) bool {
				return q.Request.URL.Path == s.Request.URL.Path
			})
		}

	})

	// start the file server for the web app
	workDir, _ := os.Getwd()
	fileServer(r, "/static", http.Dir(filepath.Join(workDir, "./client/dist/static")))

	// always serve our web app on not found (routing handles on client, if any)
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./client/dist/index.html")
	})

	// start web server
	http.ListenAndServe(":5000", r)
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
