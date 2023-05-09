package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"title": "MainMenu"})
	})

	router.StaticFile("./favicon.ico", "../dist/favicon.ico")
	router.Static("/static", "../dist/static")
	router.LoadHTMLGlob("../dist/templates/*")

	router.Run(":8081")
}