async function getPostsData() {
  const result = await getData('/api/posts')
    .then(output => {
      outPosts(output, document.querySelector('.postsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

getPostsData();

function outPosts(results, container) {
  document.getElementById("originalPostContainer").innerHTML = '';
  results.map(result => {
    const newElement = document.createElement('div');
    newElement.classList.add('post');
    const html = createPost(result);
    newElement.setAttribute('data-id', `${result._id}`);
    newElement.innerHTML = html;
    container.prepend(newElement);
  });
  if (results.length === 0) {
    container.append('<span class="noResults">Nothing to Display</span>');
  }
}
