function createPost(result) {
  const postedBy = result.postedBy;
  const displayName = `${postedBy.firstName} ${postedBy.lastName}`;
  const timestamp = timeDifference(new Date(), new Date(result.createdAt));
  const content = result.content;
  const likeButtonActive = result.likes.includes(userLoggedIn._id) ? 'active' : '';

  if (result.postedBy._id === undefined) return console.log('User Object not populated');

  return `
    <div class='mainContentContainer'>
        <div class='userImageContainer'>
            <img src='${postedBy.profilePic}'>
        </div>
        <div class='postContentContainer'>
            <div class='header'>
                <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                <span class='username'>@${postedBy.username}</span>
                <span class='date'>${timestamp}</span>
            </div>
            <div class='postBody'>
                <span>${content}</span>
            </div>
            <div class='postFooter'>
                <div class='postButtonContainer'>
                    <button>
                        <i class='fal fa-comment'></i>
                    </button>
                </div>
                <div class='postButtonContainer green'>
                    <button class='retweetButton'>
                        <i class='fal fa-retweet'></i>
                    </button>
                </div>
                <div class='postButtonContainer red'>
                    <button class='likeButton ${likeButtonActive}'>
                        <i class='fal fa-heart'></i>
                        <span class='likes'>${result.likes.length || ''}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365; 

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000) {
      return 'Just now';
    }
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}
