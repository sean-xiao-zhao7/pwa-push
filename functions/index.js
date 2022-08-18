var functions = require("firebase-functions");
var admin = require("firebase-admin");
var cors = require("cors")({ origin: true });
var webPush = require("web-push");
import { vapidPrivate, vapidPublic, firebaseUrl } from "./vars";

var serviceAccount = require("./pwagram-fb-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseUrl,
});

exports.storePostData = functions.https.onRequest(function (request, response) {
    cors(request, response, function () {
        admin
            .database()
            .ref("posts")
            .push({
                id: request.body.id,
                title: request.body.title,
                location: request.body.location,
                image: request.body.image,
            })
            .then(function () {
                webPush.setVapidDetails(
                    "mailto:asdfasdfs@asdfasdfasdfs.com",
                    vapidPublic,
                    vapidPrivate
                );
                return admin.database;
                response
                    .status(201)
                    .json({ message: "Data stored", id: request.body.id });
            })
            .catch(function (err) {
                response.status(500).json({ error: err });
            });
    });
});
