// Keyup Event for Tweet area
document.addEventListener('keyup', event => {
  // For tweet place
  const includesIdOfTextarea = ['postTextarea', 'replyTextarea'];

  if (includesIdOfTextarea.some(el => event.target.id.includes(el))) {
    const textBox = event.target;
    const value = textBox.value.trim();
    const isModal = textBox.closest('.modal') ? true : false;
    const submitButton = isModal
      ? document.getElementById('submitReplyButton')
      : document.getElementById('submitPostButton');
    if (submitButton.length === 0) return;
    if (value === '') return (submitButton.disabled = true);
    submitButton.disabled = false;
  }
});

// Click Event
document.addEventListener('click', async event => {
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

  // For Tweet
  const includesTweetClass = ['submitPostButton', 'submitReplyButton'];
  if (includesTweetClass.some(el => event.target.id.includes(el))) {
    const button = event.target;
    const isModal = button.closest('.modal') ? true : false;
    const textBox = isModal
      ? document.getElementById('replyTextarea')
      : document.getElementById('postTextarea');
    const data = {
      content: textBox.value
    };

    if (isModal) {
      const postId = button.getAttribute('data-id');
      if (postId === null) return alert('button is not defined');
      data.replyTo = postId;
    }

    const result = await postData('/api/posts', data);
    console.log(result);

    if (result.replyTo) {
      location.reload();
    }

    const html = createPost(result);
    const newElement = document.createElement('div');
    newElement.classList.add('post');
    newElement.setAttribute('data-id', `${result._id}`);
    newElement.innerHTML = html;
    document.querySelector('.postsContainer').prepend(newElement);
    button.disabled = true;
    textBox.value = '';
  }

  // For post click
  const includesPostOnClick = ['post'];
  if (includesPostOnClick.some(el => event.target.classList.value.includes(el))) {
    const element = event.target;
    const getId = getPostIdFromElement(element, ['mainContentContainer']);

    if (getId !== undefined) {
      window.location.href = `/posts/${getId}`;
    }
  }
});
