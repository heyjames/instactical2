import React from 'react';

const TableBodyRows = ({ cells }) => {
  return (
    <React.Fragment>
      <tr>
        {cells.map((label, index) =>
          <td className="text-nowrap" scope="col" key={index}>
            {label}
          </td>
        )}
      </tr>
    </React.Fragment>
  );
}

export default TableBodyRows;