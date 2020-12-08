// Caution::Jquery version required
$('#replyModal').on('shown.bs.modal', async event => {
  const button = event.relatedTarget;
  const postId = getPostIdFromElement(button);
  $('#submitReplyButton').attr('data-id', postId);
  await getData(`/api/posts/${postId}`).then(response => {
    outPosts(response.postData, document.getElementById('originalPostContainer'));
  });
});

$('#replyModal').on('hidden.bs.modal', async event => {
  document.getElementById('originalPostContainer').innerHTML = '';
});


$('#deletePostModal').on('shown.bs.modal', async event => {
  const button = event.relatedTarget;
  const postId = getPostIdFromElement(button);
  $('#deletePostButton').attr('data-id', postId);
});


$('#confirmPinModal').on('shown.bs.modal', async event => {
  const button = event.relatedTarget;
  const postId = getPostIdFromElement(button);
  $('#pinPostButton').attr('data-id', postId);
});
