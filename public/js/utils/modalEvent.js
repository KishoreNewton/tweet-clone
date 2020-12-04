// Caution::Jquery version required
$('#replyModal').on('shown.bs.modal', async event => {
  const button = event.relatedTarget;
  console.log(button);
  const postId = getPostIdFromElement(button);
  await getData(`/api/posts/${postId}`).then(response => {
    console.log(response);
  });
});
