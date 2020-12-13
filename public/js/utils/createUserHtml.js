function createUserHtml(userData, showFollowButton) {
  console.log('working')
  const { firstName, lastName, username, profilePic } = userData;
  const name = `${firstName} ${lastName}`;
  const isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
  const text = isFollowing ? 'Following' : 'Follow';
  const buttonClass = isFollowing ? 'followButton following' : 'followButton';

  let followButton = '';
  if (showFollowButton && userLoggedIn._id === userData._id) {
    followButton = `<div class="followButtonContainer">
                          <button class="${buttonClass}" data-user="${userData._id}">${text}</button>
                      </div>`;
  }

  return `<div class='user'>
                  <div class='userImageContainer'>
                      <img src='${profilePic}' />
                  </div>
                  <div class='userDetailsContainer'>
                      <div class='header'>
                          <a href='/profile/${username}'>${name}</a>
                          <span class='username'>@${username}</span>
                      </div>
                  </div>
                  ${followButton}
              </div>`;
}
