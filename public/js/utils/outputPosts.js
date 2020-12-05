function outPosts(results, container) {
  if (!Array.isArray(results)) {
    results = [results];
  }

  document.getElementById('originalPostContainer').innerHTML = '';

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

function outPostsWithReplies(results, container) {
  document.getElementById('originalPostContainer').innerHTML = '';

  if (!Array.isArray(results)) {
    results = [results];
  }

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
