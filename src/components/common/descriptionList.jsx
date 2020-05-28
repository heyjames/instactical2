import React from 'react';

const DescriptionList = ({ items }) => {
  return (
    <dl className="row">
      {Object.keys(items).map((item, index) => {
        return (
          <React.Fragment key={index}>
            <dt className="col-sm-2">{item}</dt>
            <dd className="col-sm-10">{items[item]}</dd>
          </React.Fragment>
        )
      })}
    </dl>
  );
}

export default DescriptionList;