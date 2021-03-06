getData(`/api/chats/${chatId}`, data => {
  document.getElementById('chatName').innerText = getChatName(data);
});

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
