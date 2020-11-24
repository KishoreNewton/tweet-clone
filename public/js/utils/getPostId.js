function getPostIdFromElement(element, included = ['post']) {
  element.classList;
  let isRoot = included.some(el => element.classList.value.includes(el));
  const rootElement = isRoot ? element : element.closest('.post');
  const postId = rootElement.getAttribute('data-id');
}
