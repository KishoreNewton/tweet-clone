async function getPostHere() {
  const result = await getData(`/api/posts/${postId}`)
    .then(output => {
      outPostsWithReplies(output.postData, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

getPostHere();
