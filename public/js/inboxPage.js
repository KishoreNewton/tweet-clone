const chatData = async () => {
  const chat = await getData('/api/chats');
  if (!chat) {
    alert('Could not get the chat list.');
  } else {
    outputChatList(chat, document.getElementsByClassName('resultsContainer')[0]);
  }
};

chatData();

function outputChatList(chatList, container) {
  chatList.forEach(chat => {
    const newElement = document.createElement('div');
    const html = createChatHtml(chat);
    newElement.innerHTML = html;
    container.append(newElement);

    // const html = '<span class="noResults">Tweets Not found.</span>';
  });

  if (chatList.length === 0) {
    const newElement = document.createElement('div');
    const html = '<span class="noResults">Tweets Not found.</span>';
    newElement.innerHTML = html;
    container.append(newElement);
  }
}

function createChatHtml(chatData) {
  const chatName = getChatName(chatData);
  const image = getChatImageElements(chatData);
  const latestMessage = getLatestMessage(chatData.latestMessage);

  return `<a href='/messages/${chatData._id}' class='resultListItem'>
                ${image}
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='heading ellipsis'>${chatName}</span>
                    <span class='subText ellipsis'>${latestMessage}</span>
                </div>
            </a>`;
}

function getLatestMessage(latestMessage) {
  if (latestMessage != null) {
    const sender = latestMessage.sender;
    return `${sender.firstName} ${sender.lastName}: ${latestMessage.content}`;
  }

  return 'New Chat';
}

function getChatImageElements(chatData) {
  const otherChatUsers = getOtherChatUsers(chatData.users);

  let chatImage = getUserChatImageElement(otherChatUsers[0]);
  let groupChatClass = '';
  if (otherChatUsers.length > 1) {
    groupChatClass = 'groupChatImage';
    chatImage += getUserChatImageElement(otherChatUsers[1]);
  }

  return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;
}

function getUserChatImageElement(user) {
  if (!user || !user.profilePic) {
    return alert('User passed into function is invalid');
  }

  return `<img src='${user.profilePic}' alt='Users profile pic' />`;
}
