function createPost(result) {
  console.log(result);
  if (result === null) alert('Post object is null');
  const isRetweet = result.retweetData !== undefined;
  const retweetedBy = isRetweet ? result.postedBy.username : null;
  result = isRetweet ? result.retweetData : result;
  const postedBy = result.postedBy;
  const displayName = `${postedBy.firstName} ${postedBy.lastName}`;
  const timestamp = timeDifference(new Date(), new Date(result.createdAt));
  const content = result.content;
  const likeButtonActive = result.likes.includes(userLoggedIn._id) ? 'active' : '';
  const retweetButtonActive = result.retweetUsers.includes(userLoggedIn._id) ? 'active' : '';
  let retweetText = '';
  if (isRetweet) {
    retweetText = `<span>
                    <i class="fa fa-retweet"></i>
                    Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
                  </span>`;
  }
  // console.log(result);

  let replyFlag = '';
  if (result.replyTo) {
    console.log(result)
    if (result.replyTo._id === null) return alert('Reply to is not populated');
    if (result.replyTo.postedBy._id === null) return alert('PostedById is not populated');
    const replyToUsername = result.replyTo.postedBy.username;
    replyFlag = `
      <div class="replyFlag">
        Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
      </div>
    `;
  }

  if (result.postedBy._id === undefined) return console.log('User Object not populated');

  return `
    <div class="postActionContainer">
      ${retweetText}
    </div>  
    <div class="mainContentContainer">
      <div class="userImageContainer">
        <img src="${postedBy.profilePic}" />
      </div>
      <div class="postContentContainer">
        <div class="header">
          <a href="/profile/${postedBy.username}" class="displayName">${displayName}</a>
          <span class="username">@${postedBy.username}</span>
          <span class="date">${timestamp}</span>
        </div>
        ${replyFlag}
        <div class="postBody">
          <span>${content}</span>
        </div>
        <div class="postFooter">
          <div class="postButtonContainer">
            <button data-toggle="modal" data-target="#replyModal">
              <i class="fal fa-comment"></i>
            </button>
          </div>
          <div class="postButtonContainer green">
            <button class="retweetButton ${retweetButtonActive}">
              <i class="fal fa-retweet"></i>
              <span class="retweet ${retweetButtonActive}">${result.retweetUsers.length || ''}</span>
            </button>
          </div>
          <div class="postButtonContainer red">
            <button class="likeButton ${likeButtonActive}">
              <i class="fal fa-heart"></i>
              <span class="likes ${likeButtonActive}">${result.likes.length || ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
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
