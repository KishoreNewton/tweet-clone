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
  const result = await postData('http://localhost:3000/api/posts', data);
  const html = createPost(result);
  console.log(result)
  // const postContainer = document.querySelector('.postsContainer');
  const newElement = document.createElement('div');
  newElement.classList.add('post');
  newElement.innerHTML = html;
  document.querySelector('.postsContainer').prepend(newElement);
  button.disabled = true;
  textbox.value = '';
});
