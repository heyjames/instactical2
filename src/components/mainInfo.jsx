import React from 'react';

const MainInfo = () => {
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
                  <li className="list-group-item">
                    <div>Server is constantly undergoing changes (especially the difficulty e.g. bot count among other things). Check back occasionally. Especially after mod tools are released.</div>
                  </li>
                  <li className="list-group-item">
                    <div>Public XP Server is online</div>
                    <div className="text-muted small">5 days ago</div>
                  </li>
                  <li className="list-group-item">
                    <div>Updated guidelines, removed idle player kick, removed "wave" system (doesn't scale with player count), and added the TeamSpeak server. Use the same IP as the Dallas server in your TeamSpeak bookmarks and ask me for the password.</div>
                    <div className="text-muted small">3 months ago</div>
                  </li>
                  <li className="list-group-item">
                    <div>Updated guidelines.</div>
                    <div className="text-muted small">3 months ago</div>
                  </li>
                </ul>
              </div>

              <div className="card border-0" style={{ backgroundColor: "#e9e6df" }}>
                <div className="card-body">
                  <h6 className="text-right">More Announcements</h6>
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