async function outputUsers(results, container) {
  container.innerHTML = '';
  if (!Array.isArray(results)) {
    results = [results];
  }

  results.forEach(result => {
    const html = createUserHtml(result, true);
    const newElement = document.createElement('div');
    newElement.innerHTML = html;
    container.append(newElement);
  });

  if (results.length === 0) {
    container.append('No result');
  }
}
