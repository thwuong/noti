const express = require("express");
const webPush = require("web-push");
const app = express();

const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails("mailto:duongthuong654@gmail.com", vapidKeys.publicKey, vapidKeys.privateKey);

app.use(express.json());
app.use(require("body-parser").json());

app.post("/subscribe", (req, res) => {
    const subScription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: "test" });

    console.log(subScription);

    webPush.sendNotification(subScription, payload).catch((error) => {
        console.error(error.stack);
    });
});

app.get("/register", (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: "./" });
});

app.use(require("express-static")("./"));

app.listen(3000, (req, res) => {
    console.log("http://localhost:3000");
});
