package main

import (
	"context"
	"log"
	"vividly-backend/api"
	db "vividly-backend/db/sqlc"
	"vividly-backend/utils"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

func main() {
	config, err := utils.LoadConfig(".")
	if err != nil {
		log.Fatalf("unable to load the config fie %e", err)
	}
	// conn, err := sql.Open(config.DBDriver, config.DBSource)
	pool, err := pgxpool.New(context.Background(), config.DBSource)
	if err != nil {
		log.Fatalf("cannot connect to db %e", err)
	}
	log.Println("successfully connected to database..")

	store := db.NewStore(pool)
	server, err := api.New(store, config)
	if err != nil {
		log.Println(err)
	}
	err = server.CreateDefaultAdminUser()
	if err != nil {
		log.Fatal("cannot create default admin user: ", err)
	}
	server.Start(config.ListenAddress)
}
