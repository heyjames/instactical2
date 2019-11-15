import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { getFeaturedBlogPost } from '../../services/fakeBlogPosts';

class MainInfo extends Component {
  state = {}
  renderXp = (server) => { if (server.xp) return "XP" };

  renderServerStatus = (status) => {
    var renderClass = "font-weight-bold text-";
    renderClass += (status === "Online") ? "success" : "danger";
    return <div className={renderClass}>{status}</div>
  };

  render() {
    const { servers, announcements, announcementsPreview, featuredPost } = this.props;
    const jumbotronStyle = { backgroundColor: "#e9e6df", marginBottom: "0" };

    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container">
            <div className="row">

              <div className="col-xl pb-4">
                <h5>Servers (USA)</h5>

                {servers.map(server =>
                  <div key={server._id} className="card">
                    <div className="card-body">
                      {this.renderServerStatus(server.status)}
                      <div className="font-weight-bold text-muted">{server.name}</div>
                      <div className="text-muted">{server.ip}<span className="small text-info"> Copy</span></div>
                      <div className="small text-muted">{this.renderXp(server)}</div>
                      {server.playerList.map(player => <div className="small">{player}</div>)}
                    </div>
                  </div>
                )}

              </div>

              <div className="col-xl-3 pb-4">
                <h5>Featured Post</h5>
                <Link to={"/blog/post/" + featuredPost.slug}>
                  <div className="card" style={{ backgroundColor: "#ffdd57" }}>
                    <div className="card-body">
                      <p>{featuredPost.title}</p>
                      <div>{featuredPost.content.substring(0, 255).trim()}...</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-xl">
                <h5>Announcements</h5>
                <div className="card">
                  <ul className="list-group list-group-flush">
                    {announcementsPreview.map(announcement =>
                      <li key={announcement._id} className="list-group-item">
                        <div>{announcement.content}</div>
                      </li>
                    )}
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
      </React.Fragment>
    );
  }
}

export default MainInfo;