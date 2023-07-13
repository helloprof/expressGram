let instaPosts = []
let profiles = []
// const fs = require("fs")
const env = require("dotenv")
env.config()

const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_DB, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

// sequelize.authenticate().then(() => {
//   console.log("successfully connected!")
// })


var Profile = sequelize.define('Profile', {
  profileID: {
    type: Sequelize.INTEGER,
    primaryKey: true, // use "project_id" as a primary key
    autoIncrement: true // automatically increment the value
  },
  profile: Sequelize.STRING
})

var InstaPost = sequelize.define('InstaPost', {
  instaPostID: {
    type: Sequelize.INTEGER,
    primaryKey: true, // use "project_id" as a primary key
    autoIncrement: true // automatically increment the value
  },
  caption: Sequelize.STRING,
  photo: Sequelize.STRING,
  postDate: Sequelize.DATE,
  likes: Sequelize.INTEGER,
  comments: Sequelize.ARRAY(Sequelize.STRING)
})

InstaPost.belongsTo(Profile, {foreignKey: 'profileID'})

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      console.log("POSTGRES DB SYNC COMPLETE!")
      resolve()
    }).catch((err) => {
      console.log(err)
      reject()
    })
  })
}

module.exports.getAllInstaPosts = () => {
  return new Promise((resolve, reject) => {
    // if(instaPosts) {
    //   resolve(instaPosts)
    // } else {
    //   reject("No posts found!")
    // }
    InstaPost.findAll().then((instaPosts) => {
      if(instaPosts) {
        resolve(instaPosts)
      } else {
        reject("No insta posts found!")
      }
    }).catch((err) => {
      console.log(err)
      reject("ERR RETRIEVING POSTS ERR: "+err)
    })
  })
}

module.exports.getAllProfiles = () => {
  return new Promise((resolve, reject) => {
    // if(profiles) {
    //   resolve(profiles)
    // } else {
    //   reject("No profiles found!")
    // }
    Profile.findAll().then((profiles) => {
      if(profiles) {
        resolve(profiles)
      } else {
        reject("No profiles found!")
      }
    }).catch((err) => {
      console.log("ERROR QUERYING PROFILES! ERR:"+err)
      reject(err)
    })
  })
}

module.exports.addProfile = (profile) => {
  return new Promise((resolve, reject) => {
    Profile.create(profile).then(() => {
      console.log("PROFILE ADDED")
      resolve()
    }).catch((err) => {
      console.log("ERROR CREATING PROFILE! ERR: "+err)
      reject()
    })
  })
}

module.exports.addInstaPost = (instaPost) => {
  return new Promise((resolve, reject) => {
    // if (instaPost) {
    //   instaPost.id = instaPosts.length + 1
    //   instaPost.date = new Date()
    //   instaPosts.push(instaPost)
    //   resolve("success!")
    // } else {
    //   reject("new insta post not available")
    // }
    instaPost.postDate = new Date()
    InstaPost.create(instaPost).then(() => {
      console.log("POST ADDED")
      resolve()
    }).catch((err) => {
      console.log("ERROR CREATING POST! ERR: "+err)
      reject()
    })

  })
}

