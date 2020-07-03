const debug = require('debug')('guestbook-server');
const express = require('express');
const util = require('util');
const guestbookManager = require('./guestbookManager.js');
const guestbookDashboard = require('./guestbookDashboard.js');
const adminDashboard = require('./adminDashboard.js');

const router = express.Router();

router.route('/signGuestBook')
  .post(async (req, res) => {
    debug(`Signing guestbook!\n${util.inspect(req.body)}`);
    const guestName = req.body.name;
    const guestMessage = req.body.message;
    const ipAddress = req.body.ip;
    guestbookManager.signGuestbook(guestName, guestMessage, ipAddress);
    res.sendStatus(200);
  });

router.route('/approveEntry')
  .post(async (req, res) => {
    debug(`Approving guestbook entry!\n${util.inspect(req.body)}`);
    const ipAddress = req.body.ip;
    guestbookManager.approveEntry(ipAddress);
    res.sendStatus(200);
  });

router.route('/removeEntry')
  .post(async (req, res) => {
    debug(`Removing guestbook entry!\n${util.inspect(req.body)}`);
    const ipAddress = req.body.ip;
    const queueName = req.body.queue;
    guestbookManager.removeEntry(ipAddress, queueName);
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
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const clientIp = req.connection.remoteAddress;
    const content = await guestbookDashboard.showDashboard(serverIp, clientIp);
    res.send(content);
  });

router.route('/admin')
  .get(async (req, res) => {
    const serverIp = req.headers.host.split(':')[0];
    const content = await adminDashboard.showDashboard(serverIp);
    res.send(content);
  });

module.exports = router;
