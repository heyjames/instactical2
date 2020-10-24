import React, { Component } from 'react';
import _ from 'lodash';

class Pagination extends Component {
  // Current page to the left of the ellipsis.
  renderSinglePageInsideEllipsis = (currentPage, pageAbbrMax, pagesMax) => {
    if (currentPage <= pageAbbrMax || currentPage === pagesMax) return;

    return (
      <li key={currentPage + "b"} className="page-item active">
        <button className="page-link shadow-none">{currentPage}</button>
      </li>
    )
  }

  renderEllipsis = key => {
    return (
      <React.Fragment key={key}>
        <li className="page-item disabled">
          <button className="page-link shadow-none">...</button>
        </li>
      </React.Fragment>
    )
  }

  renderLeftAngleBracket = () => {
    const { currentPage, onPageChange } = this.props;
    
    return (
      <li className={(currentPage === 1) ? "page-item disabled" : "page-item"}>
        <button className="page-link shadow-none" onClick={() => onPageChange(currentPage - 1)}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
      </li>
    )
  }

  renderRightAngleBracket = pagesMax => {
    const { currentPage, onPageChange } = this.props;
    
    return (
      <li className={(currentPage >= pagesMax) ? "page-item disabled" : "page-item"}>
        <button className="page-link shadow-none" onClick={() => onPageChange(currentPage + 1)}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </button>
      </li>
    )
  }

  renderPageNumber = page => {
    const { currentPage, onPageChange } = this.props;
    
    return (
      <li key={page} className={currentPage === page ? "page-item active" : "page-item"}>
        <button className="page-link shadow-none" onClick={() => onPageChange(page)}>{page}</button>
      </li>
    )
  }

  pageExceedThreshold = (pages, pageThreshold) => {
    return (pages.length > pageThreshold);
  }

  pageIsInEllipsis = (page, pages, pageAbbrMax) => {
    return (page > pageAbbrMax && page < pages.length);
  }

  render() {
    const { itemsCount, pageSize, currentPage, onPageChange } = this.props;
    let { addToClass = null } = this.props;
    addToClass = (addToClass) ? " " + addToClass : "";

    const pagesCount = itemsCount / pageSize;
    const pages = _.range(1, pagesCount + 1);
    const pagesMax = Math.ceil(pagesCount);

    // 1,2,3,(8)...11
    const pageAbbrMax = 3;
    const pageThreshold = 10;

    return (
      <nav>
        <ul className={"pagination" + addToClass}>
          {this.renderLeftAngleBracket()}
          
          {pages.map(page => {
            if (this.pageExceedThreshold(pages, pageThreshold) && this.pageIsInEllipsis(page, pages, pageAbbrMax)) {
              if (page === pages.length-1) {
                return (
                  <React.Fragment key={currentPage + "a"}>
                    {this.renderSinglePageInsideEllipsis(currentPage, pageAbbrMax, pagesMax)}
                    {!(currentPage === (pagesMax - 1)) && this.renderEllipsis(page, currentPage, onPageChange)}
                  </React.Fragment>
                );
              } else {
                return null;
              }
            }
      
            return this.renderPageNumber(page);
          })}
        
          {this.renderRightAngleBracket(pagesMax)}
        </ul>
      </nav>
    );
  }
}

export default Pagination;