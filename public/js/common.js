let cropper;

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

// Change Event
document.getElementById('filePhoto') &&
  document.getElementById('filePhoto').addEventListener('change', event => {
    const input = event.target;
    console.log(event.target);

    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        const image = document.getElementById('imagePreview');
        image.src = e.target.result;
        // image.setAttribute('src', e.target.result);

        if (cropper !== undefined) {
          cropper.destroy();
        }
        cropper = new Cropper(image, {
          aspectRatio: 1 / 1,
          background: false
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  });

document.getElementById('coverPhoto') &&
  document.getElementById('coverPhoto').addEventListener('change', event => {
    const input = event.target;
    console.log(event.target);

    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        const image = document.getElementById('coverPreview');
        image.src = e.target.result;
        // image.setAttribute('src', e.target.result);

        if (cropper !== undefined) {
          cropper.destroy();
        }
        cropper = new Cropper(image, {
          aspectRatio: 16 / 9,
          background: false
        });
      };
      reader.readAsDataURL(input.files[0]);
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

  // For follow button
  const includesFollowOnClick = ['followButton'];
  if (includesFollowOnClick.some(el => event.target.classList.value.includes(el))) {
    const button = event.target;
    const userId = button.getAttribute('data-user');

    putData(`/api/users/${userId}/follow`)
      .then(response => {
        let difference = 1;

        if (response.following && response.following.includes(userId)) {
          button.classList.add('following');
          button.innerText = 'Following';
        } else {
          button.classList.remove('following');
          button.innerText = 'Follow';
          difference = -1;
        }

        const followersLabel = document.getElementById('followersValue');

        if (followersLabel && followersLabel.length !== 0) {
          const followersText = followersLabel.innerText * 1;
          followersLabel.innerText = followersText + difference;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // For the profile image upload
  const imageUploadIncludes = ['imageUploadButton'];
  if (imageUploadIncludes.some(el => event.target.id.includes(el))) {
    let canvas = cropper.getCroppedCanvas();

    if (!canvas) {
      alert('could not upload image. Make sure it is an image file');
    }

    canvas.toBlob(async blob => {
      let formData = new FormData();
      formData.append('croppedImage', blob);

      await postImage(`/api/users/profilePicture`, formData)
        .then(() => {
          location.reload();
        })
        .catch(err => console.log(err));
    });
  }

  // For the cover photo upload
  const imageCoverUploadsIncludes = ['coverPhotoButton'];
  if (imageCoverUploadsIncludes.some(el => event.target.id.includes(el))) {
    let canvas = cropper.getCroppedCanvas();

    if (!canvas) {
      alert('could not upload image. Make sure it is an image file');
    }

    canvas.toBlob(async blob => {
      let formData = new FormData();
      formData.append('croppedImage', blob);

      await postImage(`/api/users/coverPhoto`, formData)
        .then(() => {
          location.reload();
        })
        .catch(err => console.log(err));
    });
  }

  // For Chat
  const chatButtonIncludes = ['createChatButton'];
  if (chatButtonIncludes.some(el => event.target.id.includes(el))) {
    const data = JSON.stringify(selectedUsers);

    const chat = await postData('/api/chats', { users: data });

    if (!chat || !chat._id) return alert('Invalid response from server.');
    if (chat) {
      window.location.href = `/messages/${chat._id}`;
    }
  }
});

// Get the Chat name
function getChatName(chatData) {
  let chatName = chatData.chatName;

  if (!chatName) {
    let otherChatUsers = getOtherChatUsers(chatData.users);
    let namesArray = otherChatUsers.map(user => `${user.firstName} ${user.lastName}`);
    chatName = namesArray.join(', ');
  }

  return chatName;
}

function getOtherChatUsers(users) {
  if (users.length === 1) return users;

  return users.filter(user => {
    return user._id !== userLoggedIn._id;
  });
}
