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
    const html = '<span class="noResults">Nothing to Display</span>';
    container.append(html);
  }
}

function outPostsWithReplies(results, container) {

  if (results.replyTo && results.replyTo._id) {
    const newElement = document.createElement('div');
    const html = createPost(results.replyTo);
    newElement.innerHTML = html;
    container.append(newElement);
  }

  const newMainElement = document.createElement('div');
  const mainPostHtml = createPost(results.postData);
  newMainElement.innerHTML = mainPostHtml;
  container.append(newMainElement);

  results.replies.map(result => {
    const newElement = document.createElement('div');
    newElement.classList.add('post');
    const html = createPost(result);
    newElement.setAttribute('data-id', `${result._id}`);
    newElement.innerHTML = html;
    container.append(newElement);
  });
}
