let timer;
let selectedUsers = [];

async function searchUsers(searchTerm) {
  await getData(`/api/users?search=${searchTerm}`)
    .then(response => {
      outputSelectableUsers(response, document.querySelector('.resultsContainer'));
    })
    .catch(err => {
      throw new Error('Something went wrong');
    });
}

function outputSelectableUsers(results, container) {
  container.innerHTML = '';

  results.map(result => {
    if (result._id === userLoggedIn._id) {
      return;
    }

    let html = createUserHtml(result, true);
    const newElement = document.createElement('div');
    newElement.innerHTML = html;
    newElement.addEventListener('click', () => userSelected(result));
    container.append(newElement);
  });
}

function userSelected(user) {
  selectedUsers.push(user);
  document.getElementById('userSearchTextbox').value = '';
  document.getElementById('userSearchTextbox').focus();
  document.querySelector('.resultsContainer').innerHTML = '';
  document.getElementById('createChatButton').disabled = false;
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
