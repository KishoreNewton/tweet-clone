async function getDataHere() {
  await getData(`/api/chats/${chatId}`)
    .then(data => {
      document.getElementById('chatName').innerText = getChatName(data);
    })
    .catch(err => {
      alert(err);
    });

  await getData(`/api/chats/${chatId}/messages`)
    .then(data => {
      const messages = [];

      data.forEach(message => {
        const html = createMessageHtml(message);
        messages.push(html);
      });

      const messagesHtml = messages.join('');
      addMessagesHtmlToPage(messagesHtml);
    })
    .catch(err => {
      alert(err);
    });
}

function addMessagesHtmlToPage(html) {
  document.getElementsByClassName('chatMessages')[0];
  const newElement = document.createElement('div');
  newElement.innerHTML = html;
  document.getElementsByClassName('chatMessages')[0].append(newElement);
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
    event.preventDefault();
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

async function sendMessage(content) {
  await postData('/api/messages', { content, chatId }).then(message => {
    if (!message) {
      alert('Could not send message');
      document.getElementsByClassName('inputTextbox').value = content;
    }
    addChatMessageHtml(message);
  });
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    alert('Message is not valid');
    return;
  }

  let messageDiv = createMessageHtml(message);

  // document.getElementsByClassName('chatMessages')[0];
  // const newElement = document.createElement('div');
  // newElement.innerHTML = messageDiv;
  // document.getElementsByClassName('chatMessages')[0].append(newElement);
  addMessagesHtmlToPage(messageDiv);
}

function createMessageHtml(message) {
  let isMine = message.sender._id === userLoggedIn._id;
  const liClassName = isMine ? 'mine' : 'theirs';

  return `<li class='message ${liClassName}'>
            <div class='messageContainer'>
              <span class='messageBody'>
                ${message.content}
              </span>
            </div>
          </li>`;
}
