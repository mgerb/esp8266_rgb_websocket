build-client:
	cd ./esp8266/client && yarn install && yarn run build

copy-files:
	mkdir -p ./esp8266/data
	cp -r ./esp8266/client/dist/* ./esp8266/data

all: build-client copy-files
