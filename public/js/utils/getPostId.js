function getPostIdFromElement(element, included = ['post']) {
  element.classList;
  let isRoot = included.some(el => element.classList.value.includes(el));
  const rootElement = isRoot ? element : element.closest('.post');
  const postId = rootElement.getAttribute('data-id');
  if (postId === undefined) return alert('Post id undefined');
  return postId;
}


// function getModalIdFromElement(element, included = ['modal']) {
//   element.classList;
//   let isRoot = included.some(el => el.classList.value.includes(el));
//   return isRoot;
// }