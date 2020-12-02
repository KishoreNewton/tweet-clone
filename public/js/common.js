document.getElementById('postTextarea').addEventListener('keyup', event => {
  const textbox = event.target;
  const value = textbox.value.trim();
  const submitButton = document.getElementById('submitPostButton');
  if (submitButton.length === 0) return;
  if (value === '') return (submitButton.disabled = true);
  submitButton.disabled = false;
});

document.getElementById('submitPostButton').addEventListener('click', async event => {
  const button = event.target;
  const textbox = document.getElementById('postTextarea');
  const data = {
    content: textbox.value
  };
  const result = await postData('/api/posts', data);
  const html = createPost(result);
  console.log(result);
  const newElement = document.createElement('div');
  newElement.classList.add('post');
  newElement.setAttribute('data-id', `${result._id}`);
  newElement.innerHTML = html;
  document.querySelector('.postsContainer').prepend(newElement);
  button.disabled = true;
  textbox.value = '';
});

// document.onload(event => {});

document.addEventListener('click', event => {
  const includedLikeClass = ['fa-heart', 'likeButton'];
  if (includedLikeClass.some(el => event.target.classList.value.includes(el))) {
    const button = event.target;
    const getId = getPostIdFromElement(button);
    if (getId === undefined) return;
    putData(`/api/posts/${getId}/like`)
      .then(postData => {
        console.log(postData.likes.length)
        button.querySelector(".likes").innerHTML = postData.likes.length || ""
      })
      .catch(err => {
        console.log(err);
      });
  }
});
