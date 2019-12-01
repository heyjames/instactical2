import React from 'react';
import Banner from './banner';
import { Link } from 'react-router-dom';

const Announcements = ({ announcements }) => {
  const pageTitle = { title: "Announcements" };
  const jumbotronStyle = {
    backgroundColor: "#424242",
    padding: "2rem 1rem"
  };
  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4">

            <Link to={"/announcements/new/"}>New</Link>
            <div className="card">
              <ul className="list-group list-group-flush">
                {announcements.map(announcement =>
                  <li key={announcement._id} className="list-group-item">
                    <div>{announcement.content}</div>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Announcements;