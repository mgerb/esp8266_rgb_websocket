build-client:
	cd ./client && yarn install && yarn run build

copy-files:
	cp -r ./client/dist ./esp8266/data

all: build-client copy-files
