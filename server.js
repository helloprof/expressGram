const express = require("express");
const app = express();
const path = require("path")
const instaService = require("./instaService")
const userService = require("./userService")

const env = require("dotenv")
env.config()
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  // defaultLayout: 'main' 
}));
app.set('view engine', '.hbs');

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const upload = multer(); // no { storage: storage } 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});


const HTTP_PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));

function onHttpStart() {
  console.log("server is ready on " + HTTP_PORT + " 🚀🚀🚀");
}

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/index.html"))
  instaService.getAllInstaPosts().then((instaPosts) => {
    res.render('index', {
      data: instaPosts
      // layout: 'main'
    })
  }).catch((err) => {
    console.log(err)
  })

})

// app.get("/instaPosts", (req, res) => {
//   instaService.getAllInstaPosts().then((instaPosts) => {
//     res.json(instaPosts)
//   }).catch((err) => {
//     console.log(err)
//   })
// })



app.get("/profiles", (req, res) => {
  instaService.getAllProfiles().then((profiles) => {
    // res.json(profiles)
    res.render('profiles', {
      data: profiles
    })
  }).catch((err) => {
    console.log(err)
  })
})

app.get("/profiles/add", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/addProfile.html"))
  res.render('addProfile', {
    // layout: 'main'
  })
})

app.post("/profiles/add", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/addProfile.html"))
  instaService.addProfile(req.body).then(() => {
    res.redirect("/profiles")
  }).catch((err) => {
    console.log(err)
  })

})

app.get("/instaPosts/add", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/addInstaPost.html"))
  instaService.getAllProfiles().then((profiles) => {
    res.render('addInstaPost', {
      // layout: 'main'
      data: profiles
    })
  })

})

app.post("/instaPosts/add", upload.single("photo"),(req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(expressGramURL) {
    req.body.photo = expressGramURL;
    instaService.addInstaPost(req.body).then(() => {
      res.redirect("/")
    }).catch((err) => {
      res.redirect("/instaPosts/add")
      console.log(err)
      
    })
    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
  }


})

app.get("/instaPost/delete/:id", (req, res) => {
  instaService.deleteInstaPostById(req.params.id).then(() => {
    res.redirect("/")
  }).catch((err) => {
    console.log(err)
  })
})

app.get("/profiles/delete/:id", (req, res) => {
  instaService.deleteProfileById(req.params.id).then(() => {
    res.redirect("/profiles")
  }).catch((err) => {
    console.log(err)
  })
})

app.get("/instaPost/:id", (req, res) => {
  instaService.getInstaPostById(req.params.id).then((instaPost) => {
    res.render('index', {
      data: [instaPost]
    })
  }).catch((err) => {
    console.log(err)
  })
})

app.get("/register", (req, res) => {
  res.render('registerUser', {
    layout: 'main'
  })
})

app.post("/register", (req, res) => {
  userService.registerUser(req.body).then((successMsg) => {
    // res.redirect("/login")
    res.render("registerUser", {
      layout: 'main',
      successMsg: successMsg
    })
  }).catch((err) => {
    console.log(err)
    res.render("registerUser", {
      layout: 'main',
      errMsg: err
    })
  })
})

app.get("/login", (req, res) => {
  res.render('loginUser', {
    layout: 'main'
  })
})

app.post("/login", (req, res) => {
  userService.loginUser(req.body).then(() => {
    res.redirect("/")
  }).catch((err) => {
    console.log(err)
  })
})

app.use((req, res) => {
  res.status(404).send("Page Not Found")
})

instaService.initialize()
.then(userService.initialize)
.then(() => {
  app.listen(HTTP_PORT, onHttpStart)
}).catch((err) => {
  console.log(err)
})
