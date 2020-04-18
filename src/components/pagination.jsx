import React from 'react';
import _ from "lodash";

const Pagination = (props) => {
  const { itemsCount, currentPage, pageSize, onPageChange } = props;

  const pagesCount = itemsCount / pageSize;
  const pagesMax = Math.ceil(pagesCount);
  const pages = _.range(1, pagesCount + 1);

  return (
    <nav aria-label="...">
      <ul className="pagination">
        <li className={(currentPage === 1) ? "page-item disabled" : "page-item"}>
          <a className="page-link shadow-none" href="#" onClick={() => onPageChange(currentPage - 1)}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </a>
        </li>
        {pages.map(page =>
          <li key={page} className={currentPage === page ? "page-item active" : "page-item"}>
            <a className="page-link shadow-none" href="#" onClick={() => onPageChange(page)}>{page}</a>
          </li>
        )}
        <li className={(currentPage >= pagesMax) ? "page-item disabled" : "page-item"}>
          <a className="page-link shadow-none" href="#" onClick={() => onPageChange(currentPage + 1)}>
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;