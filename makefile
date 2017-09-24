build-esp-client:
	cd ./esp8266/client && yarn install && yarn run build

copy-files:
	mkdir -p ./esp8266/data
	cp -r ./esp8266/client/dist/* ./esp8266/data

build-web-client:
	cd ./server/client &&  yarn install && yarn run build

build-server:
	cd ./server && go build -o main ./main.go

run:
	cd ./server && ./main

esp: build-esp-client copy-files

all: build-web-client build-server
