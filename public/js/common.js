document.getElementById('submitPostButton').addEventListener('click', async event => {
  const button = event.target;
  const textBox = document.getElementById('postTextarea');
  const data = {
    content: textBox.value
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
  textBox.value = '';
});

// document.onload(event => {});

document.addEventListener('keyup', event => {
  // For Submit Button
  const includesIdOfTextarea = ['postTextarea', 'replyTextarea'];

  if (includesIdOfTextarea.some(el => event.target.id.includes(el))) {
    const textBox = event.target;
    const value = textBox.value.trim();
    const submitButton = document.getElementById('submitPostButton');
    if (submitButton.length === 0) return;
    if (value === '') return (submitButton.disabled = true);
    submitButton.disabled = false;
  }
});

document.addEventListener('click', event => {
  // For Like
  const includedLikeClass = ['fa-heart', 'likeButton'];

  if (includedLikeClass.some(el => event.target.classList.value.includes(el))) {
    const button = event.target;
    const getId = getPostIdFromElement(button);
    if (getId === undefined) return;
    putData(`/api/posts/${getId}/like`)
      .then(postData => {
        button.querySelector('.likes').innerHTML = postData.likes.length || '';
        if (postData.likes.includes(userLoggedIn._id)) {
          button.classList.add('active');
          button.querySelector('.likes').classList.add('active');
        } else {
          button.classList.remove('active');
          button.querySelector('.likes').classList.remove('active');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // For Retweet
  const includesRetweetClass = ['fa-retweet', 'retweetButton'];

  if (includesRetweetClass.some(el => event.target.classList.value.includes(el))) {
    const button = event.target;
    const getId = getPostIdFromElement(button);
    if (getId === undefined) return;
    if (userLoggedIn.retweets.some(el => el.includes(getId))) {
      console.log('working')
      postData(`/api/posts/${getId}/deleteTweet`)
        .then(result => {
          console.log('it worked')
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
      return;
    }
    postData(`/api/posts/${getId}/retweet`)
      .then(postData => {
        button.querySelector('.retweet').innerHTML = postData.retweetUsers.length || '';
        if (postData.retweetUsers.includes(userLoggedIn._id)) {
          button.classList.add('active');
          button.querySelector('.retweet').classList.add('active');
        } else {
          button.classList.remove('active');
          button.querySelector('.retweet').classList.remove('active');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});
