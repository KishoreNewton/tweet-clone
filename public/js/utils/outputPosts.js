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
    const newElement = document.createElement('div');
    const html = '<span class="noResults">Tweets Not found.</span>';
    newElement.innerHTML = html;
    container.append(newElement);
  }
}

function outPostsWithReplies(results, container) {

  if (results.replyTo && results.replyTo._id) {
    const newElement = document.createElement('div');
    newElement.classList.add('post');
    const html = createPost(results.replyTo);
    newElement.innerHTML = html;
    newElement.setAttribute('data-id', `${results.postData._id}`);
    container.append(newElement);
  }

  const newMainElement = document.createElement('div');
  newMainElement.classList.add('post');
  const mainPostHtml = createPost(results.postData, true);
  newMainElement.innerHTML = mainPostHtml;
  newMainElement.setAttribute('data-id', `${results.postData._id}`);
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
