function getPostIdFromElement(element, included = ['post']) {
  let isRoot = included.some(el => element.classList.value.includes(el));
  const rootElement = isRoot ? element : element.closest('.post');
  const postId = rootElement.getAttribute('data-id');
  if (postId === undefined) return alert('Post id undefined');
  return postId;
}