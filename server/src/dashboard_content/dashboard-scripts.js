/* eslint-disable no-unused-vars */
function submitGuestbookEntry() {
  const name = document.getElementById('nameField').value;
  const message = document.getElementById('messageField').value;
  console.log(`NAME: ${name}, MESSAGE:${message}`);
}