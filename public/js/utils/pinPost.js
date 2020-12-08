// Caution::Arrow function can't be used
document.getElementById('pinPostButton') &&
  document.getElementById('pinPostButton').addEventListener('click', async function () {
    const getId = this.getAttribute('data-id');
    const pinned = {
      pinned: true
    };
    await putDataWith(`/api/posts/${getId}`, pinned).then(() => {
      location.reload();
    });
  });
