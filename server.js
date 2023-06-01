const express = require("express");
const app = express();
const path = require("path")
const instaService = require("./instaService")

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("server is ready on " + HTTP_PORT + " 🚀🚀🚀");
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/index.html"))
})

app.get("/instaPosts", (req, res) => {
    instaService.getAllInstaPosts().then((instaPosts) => {
        res.json(instaPosts)
    })
})

app.use((req, res) => {
  res.status(404).send("Page Not Found")
})

instaService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart)
})
