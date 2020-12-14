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
    if (result._id === userLoggedIn._id || selectedUsers.some(u => u._id === result._id)) {
      return;
    }

    let html = createUserHtml(result, false);
    const newElement = document.createElement('div');
    newElement.innerHTML = html;
    newElement.addEventListener('click', () => userSelected(result));
    container.append(newElement);
  });
}

function userSelected(user) {
  selectedUsers.push(user);
  updateSelectedUsersHtml();
  document.getElementById('userSearchTextbox').value = '';
  document.getElementById('userSearchTextbox').focus();
  document.querySelector('.resultsContainer').innerHTML = '';
  document.getElementById('createChatButton').disabled = false;
}

function updateSelectedUsersHtml() {
  const removeSelectedUsersHtml = document.querySelectorAll('.selectedUser') 
  for (i = removeSelectedUsersHtml.length; i--;) {         
    removeSelectedUsersHtml[i].parentNode.removeChild(removeSelectedUsersHtml[i]);             
  }
  let elements = [];

  selectedUsers.map(user => {
    const name = `${user.firstName} ${user.lastName}`;
    let userElement = document.createElement('span');
    userElement.setAttribute('class', 'selectedUser');
    userElement.innerText = `${name}`;
    elements.push(userElement);
  });

  elements &&
    elements.map(element => {
      document
        .getElementById('selectedUsers')
        .insertBefore(element, document.getElementById('userSearchTextbox'));
    });
}

document.getElementById('userSearchTextbox') &&
  document.getElementById('userSearchTextbox').addEventListener('keydown', event => {
    clearTimeout(timer);
    const textBox = event.target;
    let value = textBox.value;

    if (value === '' && event.key === 'Backspace') {
      selectedUsers.pop();
      updateSelectedUsersHtml();
      document.querySelector('.resultsContainer').innerHTML = '';
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
