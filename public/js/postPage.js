async function getPostHere() {
  const result = await getData(`/api/posts/${postId}`)
    .then(output => {
      outPostsWithReplies(output, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

getPostHere();
