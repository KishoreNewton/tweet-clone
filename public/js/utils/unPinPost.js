// Caution::Arrow function can't be used
document.getElementById('unpinPostButton') &&
  document.getElementById('unpinPostButton').addEventListener('click', async function () {
    const getId = this.getAttribute('data-id');
    const pinned = {
      pinned: false
    };
    await putDataWith(`/api/posts/${getId}`, pinned).then(() => {
      location.reload();
    });
  });
