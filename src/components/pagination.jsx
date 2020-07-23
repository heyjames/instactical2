import React, { Component } from 'react';
import _ from "lodash";

class Pagination extends Component {
  renderEllipsis = key => {
    return (
      <li key={key} className="page-item disabled">
        <a className="page-link shadow-none" href="#" >...</a>
      </li>
    )
  }

  renderLeftChevron = () => {
    const { currentPage, onPageChange } = this.props;
    
    return (
      <li className={(currentPage === 1) ? "page-item disabled" : "page-item"}>
        <a className="page-link shadow-none" href="#" onClick={() => onPageChange(currentPage - 1)}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </a>
      </li>
    )
  }

  renderRightChevron = pagesMax => {
    const { currentPage, onPageChange } = this.props;
    
    return (
      <li className={(currentPage >= pagesMax) ? "page-item disabled" : "page-item"}>
        <a className="page-link shadow-none" href="#" onClick={() => onPageChange(currentPage + 1)}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </a>
      </li>
    )
  }

  renderPageNumber = page => {
    const { currentPage, onPageChange } = this.props;
    
    return (
      <li key={page} className={currentPage === page ? "page-item active" : "page-item"}>
        <a className="page-link shadow-none" href="#" onClick={() => onPageChange(page)}>{page}</a>
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
    const { itemsCount, pageSize } = this.props;
    let { addToClass = null } = this.props;
    const pagesCount = itemsCount / pageSize;
    const pages = _.range(1, pagesCount + 1);
    const pagesMax = Math.ceil(pagesCount);
    const pageAbbrMax = 5;
    const pageThreshold = 10;
    addToClass = (addToClass) ? " " + addToClass : "";

    return (
      <nav>
        <ul className={"pagination" + addToClass}>
          {this.renderLeftChevron()}
          
          {pages.map(page => {
            if (this.pageExceedThreshold(pages, pageThreshold)
                && this.pageIsInEllipsis(page, pages, pageAbbrMax)
               ) {
              if (page === pages.length-1) {
                return this.renderEllipsis(page);
              } else {
                return;
              }
            }
      
            return this.renderPageNumber(page);
          })}
        
          {this.renderRightChevron(pagesMax)}
        </ul>
      </nav>
    );
  }
}

export default Pagination;