getData(`/api/posts/${postId}`).then(results => {
  outPosts(results, document.querySelector('.postsContainer'));
});
