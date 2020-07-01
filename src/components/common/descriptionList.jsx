import React from 'react';

const DescriptionList = ({ labels, names, content }) => {
  return (
    <dl className="row">
      {labels.map((label, index) => {
        return (
          <React.Fragment key={index}>
            <dt htmlFor={names[index]} className="col-md-2 col-form-label">{label}</dt>
            <dd className="col-md-4">{content[index]}</dd>
            <dd className="col-md-6"></dd>
          </React.Fragment>
        )
      })}
    </dl>
  );
}

export default DescriptionList;