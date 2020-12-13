let timer;

async function searchUsers(searchTerm) {
  await getData(`/api/users?search=${searchTerm}`)
    .then(response => {
      console.log(response);
      outputSelectableUsers(response, document.querySelector('.resultsContainer'));
    })
    .catch(err => {
      throw new Error('Something went wrong');
    });
}

function outputSelectableUsers(results, container) {
  container.innerHTML = '';
  console.log(results);

  results.map(result => {
    console.log(result);
    if (result._id === userLoggedIn._id) {
      console.log('returned');
    }
    console.log('working');
    let html = createUserHtml(result, true);
    container.appendChild(html);
  });
}

document.getElementById('userSearchTextbox') &&
  document.getElementById('userSearchTextbox').addEventListener('keydown', event => {
    clearTimeout(timer);
    const textBox = event.target;
    let value = textBox.value;

    if (value === '' && event.keycode === 8) {
      return;
    }

    timer = setTimeout(async () => {
      value = textBox.value;

      if (value === '') {
        document.querySelector('.resultsContainer').innerHTML = '';
      } else {
        await searchUsers(value);
      }
    }, 200);
  });
