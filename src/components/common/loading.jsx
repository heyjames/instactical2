import React from 'react';

export const renderLoadingBannerInfo = () => {
  return {
    subtitle: "Loading..."
  }
}

export const renderLoadingIndicator = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}