function createPost(result) {
  const postedBy = result.postedBy;
  const displayName = `${postedBy.firstName} ${postedBy.lastName}`;
  const timestamp = result.createdAt;
  const content = result.content;

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
                <div class='postButtonContainer'>
                    <button>
                        <i class='fal fa-retweet'></i>
                    </button>
                </div>
                <div class='postButtonContainer'>
                    <button>
                        <i class='fal fa-heart'></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
