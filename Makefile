default: build

.PHONY: build run runb

build:
	@docker build -t dotnews-crawler .

run:
	@docker run -it dotnews-crawler

runb: build run
