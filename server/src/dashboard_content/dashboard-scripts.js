/* eslint-disable no-unused-vars */
function submitGuestbookEntry() {
  const serverAddress = '/*IP-ADDRESS*/';
  const name = document.getElementById('nameField').value;
  const message = document.getElementById('messageField').value;
  console.log(`NAME: ${name}, MESSAGE:${message}`);
}