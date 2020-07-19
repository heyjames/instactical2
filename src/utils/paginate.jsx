export function paginate(items, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}

export function getLastPage(data, pageSize) {
  const pagesCount = (data.length / pageSize);
  return Math.ceil(pagesCount);
}