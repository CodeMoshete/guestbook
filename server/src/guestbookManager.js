const fs = require('fs');
const path = require('path');

const liveStatusFileName = 'live_status.json';
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

exports.signGuestbook = function signGuestbook(guestName, guestMessage) {
  const isLive = getIsLive();
  const messagesFile = isLive ? liveMessageFileName : messagesFileName;
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  const messagesFilePath = path.join(dataPath, messagesFile);
  let messagesContent = [];
  if (fs.existsSync(messagesFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
  }
  messagesContent.push({ name: guestName, message: guestMessage });
  fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
};

exports.getRandomMessage = function getRandomMessage() {
  const dataPath = path.join(global.appRoot, 'guestbook_data');
  const messagesFilePath = path.join(dataPath, messagesFileName);
  const liveMessagesFilePath = path.join(dataPath, liveMessageFileName);
  let isLive = getIsLive() && fs.existsSync(liveMessagesFilePath);

  let messagesContent = [];
  if (isLive) {
    messagesContent = JSON.parse(fs.readFileSync(liveMessagesFilePath));
    isLive = messagesContent.length > 0;
  }

  if (!isLive && fs.existsSync(messagesFilePath)) {
    messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
  }

  let returnMessage = {};
  if (messagesContent.length > 0) {
    const randomIndex = Math.floor(Math.random() * messagesContent.length);
    returnMessage = messagesContent[randomIndex];

    if (isLive) {
      messagesContent.splice(randomIndex, 1);
      fs.writeFileSync(liveMessagesFilePath, JSON.stringify(messagesContent, null, 2));

      messagesContent = JSON.parse(fs.readFileSync(messagesFilePath));
      messagesContent.push(returnMessage);
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
    for (let i = 0, count = liveMessagesContent.length; i < count; i += 1) {
      messagesContent.push(liveMessagesContent[i]);
    }

    fs.writeFileSync(liveMessagesFilePath, JSON.stringify([], null, 2));
    fs.writeFileSync(messagesFilePath, JSON.stringify(messagesContent, null, 2));
  }
};
