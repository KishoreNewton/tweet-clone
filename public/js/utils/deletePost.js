// Caution::Arrow function can't be used
document.getElementById('deletePostButton') && document.getElementById('deletePostButton').addEventListener('click', async function () {
  const getId = this.getAttribute('data-id');
  await deleteData(`/api/posts/${getId}`).then(() => {
    location.reload();
  });
});
