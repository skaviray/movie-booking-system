# Makefile
postgres-setup:
	docker-compose up -d

create-container-image:
	docker build --no-cache -t vidly-backend .

remove-image:
	docker rmi  vidly-backend

postgres-start:
	docker-compose start

postgres-destroy:
	docker-compose stop
	docker-compose rm -f
	rm -rf ~/vividly/postgres

createdb:
	docker exec -it go-vividly-db-1  createdb --username=root --owner=root vividly

dropdb:
	docker exec -it go-vividly-db-1   dropdb vividly


migrate-create: 
	migrate create --ext sql -dir db/migration -seq init_schema

migrate-up:
	migrate -path db/migration -database "postgresql://root:admin@localhost:5434/vividly?sslmode=disable" -verbose up

migrate-down:
	migrate -path db/migration -database "postgresql://root:admin@localhost:5434/vividly?sslmode=disable" -verbose  down 1

sqlc:
	sqlc generate 

test:
	go test -v -cover ./...

console:
	docker exec -it go-bank-db-1 psql -U root -d simple_bank

start-server:
	go run main.go

mock:
	mockgen -destination db/mock/store.go -package mockdb  simple-bank/db/sqlc Store 

.PHONY: createdb dropdb postgres-destroy postgres-setup migrate-up migrate-down sqlc test start-server mock create-container-image remove-image