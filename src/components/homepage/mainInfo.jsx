import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PlayerList from './playerList';
import { getAnnouncementsPreview } from '../../services/announcementService';
// import { getFeaturedBlogPost } from '../../services/fakeBlogPosts';
import { getFeaturedPost } from '../../services/blogService';

class MainInfo extends Component {
  state = { announcementsPreview: [], featuredPost: {} };

  async componentDidMount() {
    const announcementsPreview = await getAnnouncementsPreview();
    let featuredPost = await getFeaturedPost();
    featuredPost.content = featuredPost.content.substring(0, 255).trim();

    this.setState({ announcementsPreview, featuredPost });
  }

  renderXp = (server) => { if (server.xp) return "XP" };

  renderServerStatus = (status) => {
    let renderClass = "font-weight-bold text-";
    let label = ""

    if (status) {
      renderClass += "success";
      label = "Online";
    } else {
      renderClass += "danger";
      label = "Offline";
    }

    return <div className={renderClass}>{label}</div>
  };

  togglePlayerList = () => {
    // TODO: Move player list into its own component and toggle it via style=display: none
  };

  render() {
    const { announcementsPreview, featuredPost } = this.state;
    const { servers } = this.props;
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
                      <div><span className="display-4">3</span> <span className="h5">/ 8</span></div>
                      <div className="small text-muted">{this.renderXp(server)}</div>
                      <PlayerList onClick={this.togglePlayerList} />
                      <div id="playerList">
                        {server.playerList.map(player => <div key={player.steamId} className="small" ><a target="_blank" rel="noopener noreferrer" href={"https://steamcommunity.com/profiles/" + player.steamId}>{player['name']}</a></div>)}
                      </div>
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
                      <div>{featuredPost.content}...</div>
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