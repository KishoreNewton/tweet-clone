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
  container.innerHtml = '';
  console.log(results);

  results.map(result => {
    const newElement = document.createElement('div');
    newElement.classList.add('post');
    const html = createPost(result);
    newElement.innerHTML = html;
    document.querySelector('.postsContainer').prepend(newElement);
    // container.pr(html);

  });
  if (results.length === 0) {
    container.append('<span class="noResults">Nothing to Display</span>');
  }
}
