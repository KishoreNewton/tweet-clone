function createPost(postedBy, content) {
  return `
    <div class='mainContentContainer'>
        <div class='userImageContainer'>
            <img src='${postedBy.profilePic}'>
        </div>
        <div class='postContentContainer'>
            <div class='header'>
            </div>
            <div class='postBody'>
                <span>${content}</span>
            </div>
            <div class='postFooter'>
            </div>
        </div>
    </div>`;
}
