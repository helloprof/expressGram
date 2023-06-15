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

module.exports.getAllProfiles = () => {
  return new Promise((resolve, reject) => {
    if(profiles) {
      resolve(profiles)
    } else {
      reject("No profiles found!")
    }
  })
}

module.exports.addProfile = (profile) => {
  return new Promise((resolve, reject) => {
    if (profile) {
      profile.id = profiles.length + 1
      profiles.push(profile)
      resolve("success!")
    } else {
      reject("new profile not available")
    }

  })
}

module.exports.addInstaPost = (instaPost) => {
  return new Promise((resolve, reject) => {
    if (instaPost) {
      instaPost.id = instaPosts.length + 1
      instaPost.date = new Date()
      instaPosts.push(instaPost)
      resolve("success!")
    } else {
      reject("new insta post not available")
    }

  })
}
