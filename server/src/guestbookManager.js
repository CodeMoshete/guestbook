const fs = require('fs');
const path = require('path');

const liveStatusFileName = 'live_status.json';
const pendingMessagesFileName = 'messages_pending.json';
const liveMessageFileName = 'messages_live.json';
const messagesFileName = 'messages.json';

function getIsLive() {
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  let isLive = false;
  const liveStatusFilePath = path.join(dataPath, liveStatusFileName);
  if (fs.existsSync(liveStatusFilePath)) {
    isLive = JSON.parse(fs.readFileSync(liveStatusFilePath)).isLive;
  }
  return isLive;
}

exports.signGuestbook = function signGuestbook(guestName, guestMessage, guestIp) {
  const messagesFile = pendingMessagesFileName;
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  const messagesFilePath = path.join(dataPath, messagesFile);
  let messagesContent = {};
  if (fs.existsSync(messagesFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
  }
  messagesContent[guestIp] = { name: guestName, message: guestMessage };
  fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
};

exports.getRandomMessage = function getRandomMessage() {
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  const messagesFilePath = path.join(dataPath, messagesFileName);
  const liveMessagesFilePath = path.join(dataPath, liveMessageFileName);
  let isLive = getIsLive() && fs.existsSync(liveMessagesFilePath);

  let messagesContent = {};
  if (isLive) {
    messagesContent = JSON.parse(fs.readFileSync(liveMessagesFilePath));
    isLive = Object.keys(messagesContent.length > 0);
  }

  if (!isLive && fs.existsSync(messagesFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
  }

  let returnMessage = {};
  const keys = Object.keys(messagesContent);
  if (keys.length > 0) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomIndex];
    returnMessage = messagesContent[randomKey];

    if (isLive) {
      delete messagesContent[randomKey];
      fs.writeFileSync(liveMessagesFilePath, JSON.stringify(messagesContent, null, 2));

      messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
      messagesContent[randomKey] = returnMessage;
      fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
    }
  }
  return returnMessage;
};

exports.setLiveStatus = function setLiveStatus(liveStatus) {
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  const liveStatusFilePath = path.join(dataPath, liveStatusFileName);
  const statusContent = { isLive: liveStatus };
  fs.writeFileSync(liveStatusFilePath, JSON.stringify(statusContent, null, 2));

  const liveMessagesFilePath = path.join(dataPath, liveMessageFileName);
  if (!liveStatus && fs.existsSync(liveMessagesFilePath)) {
    const messagesFilePath = path.join(dataPath, messagesFileName);
    let messagesContent = [];
    if (fs.existsSync(messagesFilePath)) {
      messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
    }

    const liveMessagesContent = JSON.parse(fs.readFileSync(liveMessagesFilePath));
    const messageKeys = Object.keys(liveMessagesContent);
    for (let i = 0, count = messageKeys.length; i < count; i += 1) {
      messagesContent[messageKeys[i]] = liveMessagesContent[messageKeys[i]];
    }

    fs.writeFileSync(liveMessagesFilePath, JSON.stringify({}, null, 2));
    fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
  }
};

exports.approveEntry = function approveEntry(ipAddress) {
  const isLive = getIsLive();
  const messagesFile = isLive ? pendingMessagesFileName : messagesFileName;
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  const messagesFilePath = path.join(dataPath, messagesFile);
  let messagesContent = {};
  if (fs.existsSync(messagesFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
  }

  const pendingMessagesPath = path.join(dataPath, pendingMessagesFileName);
  if (fs.existsSync(pendingMessagesPath)) {
    const pendingMessageContent = JSON.parse(fs.readFileSync(pendingMessagesPath));
    messagesContent[ipAddress] = pendingMessageContent[ipAddress];
    fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
    delete pendingMessageContent[ipAddress];
    fs.writeFileSync(pendingMessagesPath, JSON.stringify(pendingMessageContent, null, 2));
  }
};

exports.removeEntry = function approveEntry(ipAddress, queueName) {
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  let queueFileName = '';
  switch (queueName) {
    case 'archive':
      queueFileName = messagesFileName;
      break;
    case 'live':
      queueFileName = liveMessageFileName;
      break;
    case 'pending':
      queueFileName = pendingMessagesFileName;
      break;
    default:
      // Intentionally empty.
      break;
  }

  const messagesFilePath = path.join(dataPath, queueFileName);
  let messagesContent = {};
  if (fs.existsSync(messagesFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
    delete messagesContent[ipAddress];
    fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
  }
};
