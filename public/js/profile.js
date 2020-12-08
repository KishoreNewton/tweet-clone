if (selectedTab === 'replies') {
  loadReplies();
} else {
  loadPosts();
}

async function loadPosts() {
  await getData(`/api/posts?postedBy=${profileUserId}&isReply=false`)
    .then(response => {
      outPosts(response, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

async function loadReplies() {
  await getData(`/api/posts?postedBy=${profileUserId}&isReply=true`)
    .then(response => {
      outPosts(response, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}
