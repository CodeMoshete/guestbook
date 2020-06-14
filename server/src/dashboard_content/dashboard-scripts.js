/* eslint-disable no-unused-vars */
function submitGuestbookEntry() {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const clientAddress = '/*CLIENT-ADDRESS*/';
  const nameValue = document.getElementById('nameField').value;
  const messageValue = document.getElementById('messageField').value;
  console.log(`NAME: ${nameValue}, MESSAGE:${messageValue}`);

  const bodyData = {
    name: nameValue,
    message: messageValue,
    ip: clientAddress
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/guestbook/signGuestBook`,
    {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(bodyData, null, 2)
    }
  );

  fetch(request)
    .then()
    .then(() => {
      console.log('Success');
      const container = document.getElementById('inputContainer');
      container.innerHTML = '';
      const thankYouSpan = document.createElement('SPAN');
      thankYouSpan.classList.add('border2');
      thankYouSpan.innerHTML = 'THANK YOU!';
      container.appendChild(thankYouSpan);
    });
}