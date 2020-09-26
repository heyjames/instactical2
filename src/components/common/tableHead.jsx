import React from 'react';
import '../../css/default.css';

const TableHead = ({ headerClass, colHead, onColumnSort }) => {
  return (
    <thead className={headerClass}>
      <tr>
        {colHead.map((label, index) =>
          <th 
            scope="col" 
            key={index} 
            className="noselect" 
            onClick={() => onColumnSort(label)}
          >
            {label}
          </th>
        )}
      </tr>
    </thead>
  );
}

export default TableHead;