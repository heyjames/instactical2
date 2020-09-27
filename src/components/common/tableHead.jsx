import React from 'react';
import '../../css/default.css';

const TableHead = ({ headerClass, colHead, onColumnSort }) => {
  return (
    <thead className={headerClass}>
      <tr>
        {Object.keys(colHead).map((label, index) => {
          const showSortIcon = colHead[label];

          return (
            <th 
              scope="col" 
              key={index} 
              className="noselect text-nowrap"
              onClick={() => onColumnSort(label)}
            >
              {label} {showSortIcon && <i className="fa fa-sort"></i>}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default TableHead;