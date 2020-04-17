import React from 'react';

const Footer = () => {
  const mySteamUrl = "https://steamcommunity.com/profiles/76561197993336390/";

  return (
    <footer className="my-5 text-muted text-center text-small">
      <p className="mb-1">
        <a target="_blank" rel="noopener noreferrer" href={mySteamUrl}>
          My Steam Profile <i className="fa fa-external-link" aria-hidden="true"></i>
        </a>
      </p>
    </footer>
  );
}

export default Footer;