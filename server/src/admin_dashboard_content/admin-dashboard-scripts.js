/* eslint-disable no-unused-vars */
function approveGuestbookEntry(clientAddress) {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const bodyData = {
    ip: clientAddress
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/guestbook/approveEntry`,
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
      location.reload(false);
    });
}

function deleteGuestbookEntry(clientAddress, queueName) {
  const serverAddress = '/*SERVER-ADDRESS*/';
  const bodyData = {
    ip: clientAddress,
    queue: queueName
  };

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const request = new Request(
    `http://${serverAddress}:8080/guestbook/removeEntry`,
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
      location.reload(false);
    });
}
