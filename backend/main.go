package main

import (
	"todo-app/config"
	"todo-app/handler"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	config.ConnectDB()

	_, err := config.ConnectDB().Exec(`
		CREATE TABLE IF NOT EXISTS todos (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			completed BOOLEAN DEFAULT FALSE
		)
	`)
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.Use(cors.Default())

	r.Static("/static", "../frontend/static")

	r.LoadHTMLGlob("../frontend/template/*")

	todo := r.Group("/todos")
	{
		todo.GET("", handlers.GetTodos)
		todo.POST("", handlers.CreateTodo)
		todo.PUT("/:id", handlers.UpdateTodo)
		todo.DELETE("/:id", handlers.DeleteTodo)
	}
	

	r.Run(":8080")
}
