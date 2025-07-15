# Makefile
build:
	npm run build

remove-image:
	docker rmi  vidly-frontend

create-container-image:
	docker build -t vidly-frontend .

start-container:
	docker-compose up -d 

remove:
	docker-compose down
	docker-compose rm
	docker rmi  vidly-frontend


start-development:
	npm start



.PHONY: build create-container-image start-development start-container remove