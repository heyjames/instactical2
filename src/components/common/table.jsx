import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../button';

const Table = ({ colHeaders, data, cells, steamId, addBtn, onAddBtn, editPath, headerClass }) => {
  return (
    <table className="table table-sm table-striped">
      <thead className={headerClass}>
        <tr>
          {colHeaders.map((headerLabel, index) =>
            <th scope="col" key={index}>{headerLabel}</th>
          )}
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => {
          return (
            <tr key={index}>
              <td className="text-center">{editPath && <Link to={editPath + index}>Edit</Link>}</td>
              {cells.map((cell, index) => <td key={index}>{row[cell].toString()}</td>)}
            </tr>
          )
        })}
        {addBtn && <tr>
          <td style={{ width: "40px" }}>
            <Button label="+" customClass="btn-block btn-sm btn-success" onClick={onAddBtn} />
          </td>
          <td colSpan="6"></td>
        </tr>}
      </tbody>
    </table>
  );
}

export default Table;