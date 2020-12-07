async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

async function getData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache'
  });
  return response.json();
}

async function putData(url = '') {
  const response = await fetch(url, {
    method: 'PUT',
    mode: 'cors'
  });
  return response.json();
}

async function deleteData(url = '') {
  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache'
  });
  return response.text();
}
