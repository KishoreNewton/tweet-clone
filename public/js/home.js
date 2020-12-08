async function getPostsData() {
  const result = await getData('/api/posts?followingOnly=true')
    .then(output => {
      outPosts(output, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

getPostsData();