const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const debug = require('debug')('guestbook-server');
const express = require('express');
const path = require('path');// Load configuration
const guestbookRouter = require('./src/routes.js');

global.appRoot = path.resolve(__dirname);

const app = express();
app.use(bodyParser.json()); // Set up express to use json parser.
app.use(cors()); // Enable cross-origin resource sharing (web security thing).// Set up routing.
app.use('/guestbook', guestbookRouter);
app.use(express.static('./static_content'));
const listenPort = 8080;
app.listen(listenPort, () => {
  debug(`Listening on port ${chalk.green(listenPort)}`);
});
