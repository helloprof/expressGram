var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const env = require("dotenv")
env.config()

const bcrypt = require('bcryptjs');

userSchema = new Schema({
  "userName": {
    "type": String,
    "unique": true
  },
  "password": String,
  "email": String,
  "loginHistory": [
    {
      "dateTime": Date,
      "userAgent": String
    }
  ]
})

let User;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(process.env.MONGO_URI_STRING);
    db.on('error', (err) => {
      reject(err)
    })

    db.once('open', () => {
      console.log("MongoDB Connected!")
      User = db.model("users", userSchema);
      resolve()
    })
  })
}

module.exports.registerUser = function(userData) {
  return new Promise((resolve, reject) => {
    if (userData.password != userData.password2) {
      reject("PASSWORDS DO NOT MATCH!")
    } else {
      bcrypt.hash(userData.password, 10).then((hash) => {
        console.log(hash)
        userData.password = hash 

        let newUser = new User(userData)
        newUser.save().then(() => {
          resolve("USER CREATED SUCCESSFULLY!")
        }).catch((err) => {
          if (err.code == 11000) {
            reject("USERNAME IS ALREADY TAKEN")
          } else {
            reject(err)
          }
        })
      }).catch((err) => {
        console.log(err)
        reject("PASSWORD ENCRYPTION ERROR! ERR: "+err)
      })
    }
  })
}

module.exports.loginUser = function(userData) {
  return new Promise((resolve, reject) => {
    User.findOne({userName: userData.userName})
    .exec()
    .then((user) => {
      bcrypt.compare(userData.password, user.password).then((result) => {
        console.log(result)
        console.log("USER LOGGED IN SUCCESSFULLY")
        if(result === true) {
          user.loginHistory.push({dateTime: new Date(), userAgent: userData.userAgent})
          User.updateOne(
            { userName: user.userName},
            { $set: { loginHistory: user.loginHistory}}
          ).exec()
          .then(() => {
            resolve(user)
          }).catch((err) => {
            reject("ERR UPDATING LOGIN HISTORY")
            console.log(err)
          })
        } else {
          reject("CREDENTIALS ERR")
        }
      }).catch((err) => {
        console.log(err)
        reject("CREDENTIALS INCORRECT! TRY AGAIN")
      })

    }).catch((err) => {
      reject("CREDENTIALS INCORRECT! TRY AGAIN")
    })
  })
}


