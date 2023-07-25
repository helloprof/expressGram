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

module.exports.getInstaPostById = (id) => {
  return new Promise((resolve, reject) => {
    InstaPost.findOne({
      where: {
        instaPostID: id
      }
    }).then((instaPost) => {
      if(instaPost) {
        resolve(instaPost)
      } else {
        reject("No insta post found by that id!")
      }
    }).catch((err) => {
      console.log(err)
      reject("ERR RETRIEVING POST ERR: "+err)
    })
  })
}

module.exports.deleteInstaPostById = (id) => {
  return new Promise((resolve, reject) => {
    InstaPost.destroy({
      where: {
        instaPostID: id
      }
    }).then(() => {
      resolve("Post deleted successfully!")
    }).catch((err) => {
      console.log(err)
      reject("ERR DELETING POST ERR: "+err)
    })
  })
}

module.exports.deleteProfileById = (id) => {
  return new Promise((resolve, reject) => {
    Profile.destroy({
      where: {
        profileID: id
      }
    }).then(() => {
      resolve("Profile deleted successfully!")
    }).catch((err) => {
      console.log(err)
      reject("ERR DELETING PROFILE ERR: "+err)
    })
  })
}