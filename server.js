const express = require("express");
const api     = require("./api");
const app     = express();
const server  = require('http').createServer(app);
const PORT    = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log('Server listening at port %d', PORT);
});

// Routing
app.use(express.static(__dirname + '/public'));
app.use('/api', api);
app.on('error', err => console.error(err));