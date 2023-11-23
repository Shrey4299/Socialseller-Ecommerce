require("dotenv").config();
const app = require("./server");
const express = require("express");
const subdomainMiddleware = require("./src/middlewares/subdomain");
const databaseMiddleware = require("./src/middlewares/database");
const morgan = require("morgan");
const cors = require("cors");
const syntaxErrorhandler = require("./src/middlewares/syntaxErrorhandler");
const notFoundHandler = require("./src/middlewares/notFoundHandler");
const instance_starter = require("./src/utils/instance_starter")();
const firebaseAdmin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./config/web-push-559b6-firebase-adminsdk-8ruqy-5670e6b148.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

app.use(morgan("dev"));
// app.use(express.json());
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(syntaxErrorhandler);
app.use(subdomainMiddleware);
app.use(databaseMiddleware);
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(cors());
// adding routes
require("./src/utils/routes");
app.use(notFoundHandler);
// Start the server

const PORT = process.env.PORT || 4500;

// const cluster = require('cluster');
// const os = require('os');
// const totalCPUs = os.cpus().length;
// console.log(totalCPUs);
// const instance_starter = require('./src/utils/instance_starter');
// if (cluster.isPrimary) {
//     instance_starter()
//     for (let i = 0; i < totalCPUs; i++) {
//         cluster.fork();
//     }
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//     });
// } else {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
