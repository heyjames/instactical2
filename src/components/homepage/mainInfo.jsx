import React from 'react';
import { Link } from 'react-router-dom';

const MainInfo = ({ announcements }) => {
  const jumbotronStyle = { backgroundColor: "#e9e6df", marginBottom: "0" };

  return (
    <React.Fragment>
      <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
        <div className="container">
          <div className="row">

            <div className="col-xl pb-4">
              <h5>Servers (USA)</h5>
              <div className="card">
                <div className="card-body">
                  <div className="font-weight-bold text-danger">Offline</div>
                  <div className="font-weight-bold text-muted">insTactical.com - Slow/No Rush</div>
                  <div className="text-muted">155.138.240.50<span className="small text-info"> Copy</span></div>
                  <div className="small text-muted">XP Enabled</div>
                </div>
              </div>
            </div>

            <div className="col-xl pb-4">
              <h5>Featured Post</h5>
              <div className="card" style={{ backgroundColor: "#ffdd57" }}>
                <div className="card-body">
                  <p>Launch day!</p>
                  <div>Started this near the beginning of January to fill a niche play style in Sandstorm. It was a good way to improve my web dev skills, support the...</div>
                </div>
              </div>
            </div>

            <div className="col-xl">
              <h5>Announcements</h5>
              <div className="card">

                <ul className="list-group list-group-flush">
                  {announcements.map(announcement =>
                    <li key={announcement._id} className="list-group-item">
                      <div>{announcement.content}</div>
                    </li>)}
                </ul>

              </div>

              <div className="card border-0" style={{ backgroundColor: "#e9e6df" }}>
                <div className="card-body">
                  <Link to="/announcements"><h6 className="text-right">More Announcements</h6></Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </React.Fragment >
  );
}

export default MainInfo;