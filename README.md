## Requirements 

- Git (clone the repo)
- [NodeJS] (https://nodejs.org/en)
- [nodemon] (https://www.npmjs.com/package/nodemon)
- [Cloudinary Account] (https://cloudinary.com/)
- [ElephantSQL Account] (https://www.elephantsql.com/)
- [MongoDB Atlas Account] (https://www.mongodb.com/atlas/database) 

## Local Development

1. Clone the repo - `git clone https://github.com/helloprof/expressGram.git`
2. Copy `sample.env` as `.env` and customize with your own keys - `cp sample.env .env`
3. Install npm packages - `npm install`
4. Run the local node/express server - `nodemon server.js` OR `node server.js`

Your app will be available at http://localhost:8080

## Current BUGS
- dropdown not working with Bootstrap 5 (imported popper.js necessary but still not working) - maybe try a different way of showing data in the dropdown? like a modal or popup or tabs
- east coast servers not working on campus so try to choose west coast
- loginHistory array becomes too large after too many logins - maybe consider removing loginHistory entirely or saving less data into the document (i.e. not User-Agent)