async function getPostsData() {
  const result = await getData('/api/posts')
    .then(output => {
      console.log(output);
    })
    .catch(err => {
      console.log(err);
    });
}

getPostsData();
