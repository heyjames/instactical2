import React from 'react';

const DescriptionList = ({ labels, names, content }) => {
  return (
    <dl className="form-group row">
      {labels.map((label, index) => {
        return (
          <React.Fragment>
            <label for={names[index]} class="col-md-2 col-form-label">{label}</label>
            <div class="col-md-4">{content[index]}</div>
            <div className="col-md-6"></div>
          </React.Fragment>
        )
      })}
    </dl>
  );
}

export default DescriptionList;