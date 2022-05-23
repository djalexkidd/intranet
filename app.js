const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render(index.html);
});

app.get("/form", (req, res) => {
    res.sendFile(__dirname + '/public/newworker.html');
});

app.listen(3000, () => console.log("Server is running!"));