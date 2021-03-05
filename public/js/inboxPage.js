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
  const chatName = 'Chat Name';
  const image = '';
  const latestMessage = 'This is the latest message';

  return `<a href='/messages/${chatData._id}' class='resultListItem'>
                <div class='resultsDetailsContainer'>
                    <span class='heading'>${chatName}</span>
                    <span class='subText'>${latestMessage}</span>
                </div>
            </a>`;
}
