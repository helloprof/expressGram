let instaPosts = []
let profiles = []
const fs = require("fs")

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/instaPosts.json", "utf-8", (err, data) => {
      if (err) {
        reject("ERR: " + err)
      }
      instaPosts = JSON.parse(data)

      fs.readFile("./data/profiles.json", "utf-8", (err, data) => {
        if (err) {
          reject("ERR: " + err)
        }
        profiles = JSON.parse(data)
        resolve("success!")
      })
    })
  })
}

module.exports.getAllInstaPosts = () => {
  return new Promise((resolve, reject) => {
    if(instaPosts) {
      resolve(instaPosts)
    } else {
      reject("No posts found!")
    }
  })
}