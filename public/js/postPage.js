async function getPostHere() {
  console.log('working')
  await getData(`/api/posts/${postId}`).then(output => {
    console.log(output)
    outPosts(output, document.querySelector('.postContainer'));
  });
}

getPostHere();
