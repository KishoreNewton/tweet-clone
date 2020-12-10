let timer;

document.getElementById('searchBox') &&
  document.getElementById('searchBox').addEventListener('keydown', event => {
    clearTimeout(timer);
    const textBox = event.target;
    const searchType = textBox.getAttribute('data-search');
    let value = textBox.value;

    timer = setTimeout(async () => {
      value = textBox.value;
      if (value === '') {
        document.querySelector('.resultsContainer').innerHTML = '';
      } else {
        await search(value, searchType);
      }
    }, 200);
  });

async function search(searchTerm, searchType) {
  const url = searchType === 'users' ? '/api/users' : '/api/posts';
  await getData(`${url}?search=${searchTerm}`).then(response => {
    if (searchType === 'users') {
      outputUsers(response, document.querySelector('.resultsContainer'));
    } else {
      document.querySelector('.resultsContainer').innerHTML = '';
      outPosts(response, document.querySelector('.resultsContainer'));
    }
  });
}
