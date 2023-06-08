const express = require("express");
const app = express();
const path = require("path")
const instaService = require("./instaService")

const HTTP_PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));

function onHttpStart() {
  console.log("server is ready on " + HTTP_PORT + " 🚀🚀🚀");
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"))
})

app.get("/instaPosts", (req, res) => {
  instaService.getAllInstaPosts().then((instaPosts) => {
    res.json(instaPosts)
  }).catch((err) => {
    console.log(err)
  })
})

app.get("/profiles", (req, res) => {
  instaService.getAllProfiles().then((profiles) => {
    res.json(profiles)
  }).catch((err) => {
    console.log(err)
  })
})

app.get("/profiles/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addProfile.html"))
})

app.post("/profiles/add", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/addProfile.html"))
  instaService.addProfile(req.body).then(() => {
    res.redirect("/profiles")
  }).catch((err) => {
    console.log(err)
  })

})


app.use((req, res) => {
  res.status(404).send("Page Not Found")
})

instaService.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart)
}).catch((err) => {
  console.log(err)
})
