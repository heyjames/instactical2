import React from 'react';

const BlogPostCard = ({ data }) => {
  const { img, content } = data;

  return (
    <React.Fragment>
      <div className="card shadow-sm rounded">
        <img className="card-img-top" src={img} alt="Card cap" />
        <div className="card-body">
          <p className="card-text">{content}</p>
        </div>
      </div>
    </React.Fragment>
  );
}
 
export default BlogPostCard;