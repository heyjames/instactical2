import React from 'react';

const Banner = ({ info, style }) => {
  const { tag, title, subtitle } = info;

  return (
    <div className="jumbotron jumbotron-fluid" style={style}>
      <div className="container text-light">
        <h2 className="display-6">{title}</h2>
        { subtitle && (
          <span title={tag}>
            <p className="lead">{subtitle}</p>
          </span>
        )}
      </div>
    </div>
  );
}

export default Banner;