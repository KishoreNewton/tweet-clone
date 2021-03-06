async function getDataHere() {
  await getData(`/api/chats/${chatId}`)
    .then(data => {
      document.getElementById('chatName').innerText = getChatName(data);
    })
    .catch(err => {
      alert(err);
    });
}

getDataHere();

document.getElementById('chatNameButton').addEventListener('click', async event => {
  const chatName = document.getElementById('chatNameTextbox').value.trim();

  const result = await putDataWith(`/api/chats/${chatId}`, { chatName })
    .then(() => {
      location.reload();
    })
    .catch(err => {
      alert(err);
    });
});

document.getElementsByClassName('sendMessageButton')[0].addEventListener('click', () => {
  messageSubmited();
});

document.getElementsByClassName('inputTextbox')[0].addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    messageSubmited();
    return false;
  }
});

function messageSubmited() {
  const content = document.getElementsByClassName('inputTextbox')[0].value.trim();
  if (content !== '') {
    sendMessage(content);
    document.getElementsByClassName('inputTextbox')[0].value = '';
  }
}

function sendMessage(content) {}
