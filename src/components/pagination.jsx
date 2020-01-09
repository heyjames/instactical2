import React from 'react';
import _ from "lodash";

const Pagination = (props) => {
  const { itemsCount, currentPage, pageSize, onPageChange } = props;

  const pagesCount = itemsCount / pageSize;
  const pages = _.range(1, pagesCount + 1);

  return (
    <nav aria-label="Page navigation example" className="pt-4">
      <ul className="pagination">
        {pages.map(page =>
          <li key={page} className={currentPage === page ? "page-item active" : "page-item"}>
            <a className="page-link" href="#" onClick={() => onPageChange(page)}>{page}</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Pagination;