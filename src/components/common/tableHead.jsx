import React from 'react';

const TableHead = ({ headerClass, colHead }) => {
  return (
    <thead className={headerClass}>
      <tr>
        {colHead.map((label, index) =>
          <th scope="col" key={index}>{label}</th>
        )}
      </tr>
    </thead>
  );
}

export default TableHead;