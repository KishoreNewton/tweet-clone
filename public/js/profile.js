async function loadPosts() {
  await getData(`/api/posts?postedBy=${profileUserId}&isReply=false`)
    .then(response => {
      outPosts(response, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

loadPosts();
