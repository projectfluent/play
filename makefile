export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)

start:
	npm start

build:
	npm run build

deploy:
	gh-pages -d build -o upstream

.PHONY: build
