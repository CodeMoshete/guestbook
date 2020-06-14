const debug = require('debug')('guestbook-server');
const express = require('express');
const util = require('util');
const guestbookManager = require('./guestbookManager.js');
const guestbookDashboard = require('./guestbookDashboard.js');

const router = express.Router();

router.route('/signGuestBook')
  .post(async (req, res) => {
    debug(`Signing guestbook!\n${util.inspect(req.body)}`);
    const guestName = req.body.name;
    const guestMessage = req.body.message;
    guestbookManager.signGuestbook(guestName, guestMessage);
    res.sendStatus(200);
  });

router.route('/setLiveStatus')
  .post(async (req, res) => {
    debug(`Setting live status!\n${util.inspect(req.body)}`);
    const liveStatus = req.body.isLive;
    guestbookManager.setLiveStatus(liveStatus);
    res.sendStatus(200);
  });

router.route('/getRandomGuestbookMessage')
  .get(async (req, res) => {
    debug('Getting random guestbook message!');
    const message = guestbookManager.getRandomMessage();
    res.send(message);
  });

router.route('/')
  .get((req, res) => {
    const content = guestbookDashboard.showDashboard();
    res.send(content);
  });

module.exports = router;