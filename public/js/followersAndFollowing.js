if (selectedTab === 'followers') {
  loadFollowers();
} else {
  loadFollowing();
}

async function loadFollowers() {
  await getData(`/api/users/${profileUserId}/followers`)
    .then(response => {
      outputUsers(response.followers, document.querySelector('.resultsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}

async function loadFollowing() {
  await getData(`/api/users/${profileUserId}/following`)
    .then(response => {
      outputUsers(response.following, document.querySelector('.resultsContainer'));
    })
    .catch(err => {
      console.log(err);
    });
}
