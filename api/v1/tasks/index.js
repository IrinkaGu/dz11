const express   = require("express");
const app = module.exports = express();

app.get('/', function(req, res) {
	console.log("Задачи");
	res.status(200).json(["Задачи"]);
});

