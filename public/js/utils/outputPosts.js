function outPosts(results, container) {
    document.getElementById("originalPostContainer").innerHTML = '';
    // console.log(container);
    results.map(result => {
      // console.log(result)
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
  