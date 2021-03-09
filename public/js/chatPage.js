let typing = false;
let lastTypingTime;

socket.emit('join room', chatId);
socket.on('typing', () => (document.getElementsByClassName('typingDots')[0].style.display = 'block'));
socket.on('stop typing', () => (document.getElementsByClassName('typingDots')[0].style.display = 'none'));

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

      let lastSenderId = '';

      data.forEach((message, index) => {
        const html = createMessageHtml(message, data[index + 1], lastSenderId);

        messages.push(html);
        lastSenderId = message.sender._id;
      });

      const messagesHtml = messages.join('');
      addMessagesHtmlToPage(messagesHtml);
      scrollToBottom(false);

      document.getElementsByClassName('loadingSpinnerContainer')[0].style.display = 'none';
      document.getElementsByClassName('chatContainer')[0].style.visibility = 'visible';
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
  updateTyping();

  if (event.keyCode === 13) {
    event.preventDefault();
    messageSubmited();
    return false;
  }
});

function updateTyping() {
  if (!connected) return;

  if (!typing) {
    typing = true;
    socket.emit('typing', chatId);
  }

  lastTypingTime = new Date().getTime();
  let timerLength = 3000;

  setTimeout(() => {
    let timeNow = new Date().getTime();
    let timeDiff = timeNow - lastTypingTime;

    if (timeNow >= timerLength && typing) {
      socket.emit('stop typing', chatId);
      typing = false;
    }
  }, timerLength);
}

function messageSubmited() {
  const content = document.getElementsByClassName('inputTextbox')[0].value.trim();

  if (content !== '') {
    sendMessage(content);
    document.getElementsByClassName('inputTextbox')[0].value = '';
    socket.emit('stop typing', chatId);
    typing = false;
  }
}

async function sendMessage(content) {
  await postData('/api/messages', { content, chatId }).then(message => {
    if (!message) {
      alert('Could not send message');
      document.getElementsByClassName('inputTextbox').value = content;
    }

    addChatMessageHtml(message);

    if (connected) {
      socket.emit('new message', message);
    }
  });
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    alert('Message is not valid');
    return;
  }

  let messageDiv = createMessageHtml(message, null, '');

  // document.getElementsByClassName('chatMessages')[0];
  // const newElement = document.createElement('div');
  // newElement.innerHTML = messageDiv;
  // document.getElementsByClassName('chatMessages')[0].append(newElement);
  addMessagesHtmlToPage(messageDiv);
  scrollToBottom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {
  let sender = message.sender;
  let senderName = sender.firstName + ' ' + sender.lastName;

  let currentSenderId = sender._id;
  let nextSenderId = nextMessage != null ? nextMessage.sender._id : '';

  const isFirst = lastSenderId != currentSenderId;
  const isLast = nextSenderId != currentSenderId;

  let isMine = message.sender._id === userLoggedIn._id;
  let liClassName = isMine ? 'mine' : 'theirs';

  let nameElement = '';
  if (isFirst) {
    liClassName += ' first';

    if (!isMine) {
      nameElement = `<span class='senderName'>${senderName}</span>`;
    }
  }

  let profileImage = '';
  if (isLast) {
    liClassName += ' last';
    profileImage = `<img src='${sender.profilePic}'>`;
  }

  let imageContainer = '';
  if (!isMine) {
    imageContainer = `<div class='imageContainer'>
                        ${profileImage}
                      </div>`;
  }

  return `<li class='message ${liClassName}'>
            ${imageContainer}
            <div class='messageContainer'>
              ${nameElement}
              <span class='messageBody'>
                ${message.content}
              </span>
            </div>
          </li>`;
}

function scrollToBottom(animated) {
  const container = document.getElementsByClassName('chatMessages')[0];
  let scrollHeight = container.scrollHeight;

  if (animated) {
    container.scrollTo({
      bottom: scrollHeight,
      behavior: 'smooth'
    });
  } else {
    container.scrollTop = scrollHeight;
  }
}
