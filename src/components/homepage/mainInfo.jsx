import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PlayerList from './playerList';
import { getAnnouncementsPreview } from '../../services/announcementService';
import { getFeaturedPost } from '../../services/blogService';
import { getServerInfo } from '../../services/fakeServers';
import _ from "lodash";
import moment from 'moment';

class MainInfo extends Component {
  state = { announcementsPreview: [], featuredPost: {}, serverInfo: {} };

  async componentDidMount() {
    const announcementsPreview = await getAnnouncementsPreview();
    let featuredPost = await getFeaturedPost();
    featuredPost.content = featuredPost.content.substring(0, 255).trim();

    this.setState({ announcementsPreview, featuredPost });
    this.renderServerInfo();
  }

  renderServerInfo = async () => {
    const result = await getServerInfo();
    const serverInfo = JSON.parse(result);
    this.setState({ serverInfo });
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

  getPlayerList = () => {
    const { serverInfo } = this.state;

    let list = [];
    for (let i = 0; i < _.get(serverInfo, "players.length"); i++) {
      list[i] = _.get(serverInfo, ["players", [i], "name"]);
    }

    return (
      <div>
        {list.map(player => (
          <span className="badge badge-pill badge-secondary mr-1" key={player}>{player}</span>
        ))}
      </div>
    )
  };

  render() {
    const { announcementsPreview, featuredPost, serverInfo } = this.state;
    const { servers } = this.props;
    const jumbotronStyle = { backgroundColor: "#e9e6df", marginBottom: "0" };

    let ip = _.get(serverInfo, ["query", "host"]);
    let port = _.get(serverInfo, ["raw", "port"]);
    let map = _.get(serverInfo, ["map"]);
    let length = _.get(serverInfo, "players.length");



    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container">
            <div className="row">
              <div className="col-xl pb-4">
                <h5 className="font-weight-bold"><i className="fa fa-server" aria-hidden="true"></i> Servers (US)</h5>

                <div className="card shadow-sm rounded">
                  <div className="card-body">
                    {this.renderServerStatus(!serverInfo.message)}
                    <div className="font-weight-bold text-muted">{serverInfo.name}</div>
                    <div className="text-muted">{ip + ":" + port}<span className="small text-info"> Copy</span></div>
                    <div>{map}</div>
                    <div><span className="display-4">{length}</span> <span className="h5">/ {serverInfo.maxplayers}</span></div>
                    <div>{this.getPlayerList()}</div>
                  </div>
                </div>

              </div>

              <div className="col-xl-3 pb-4">
                <h5 className="font-weight-bold"><i className="fa fa-star" aria-hidden="true"></i> Featured Post</h5>
                <Link className="no-underline" to={"/blog/post/" + featuredPost.slug}>
                  <div className="card shadow-sm rounded" style={{ backgroundColor: "#ffdd57" }}>
                    <div className="card-body">
                      <h4>{featuredPost.title}</h4>
                      <div>{featuredPost.content}...</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-xl">
                <h5 className="font-weight-bold"><i className="fa fa-bullhorn" aria-hidden="true"></i> Announcements</h5>
                <div className="card shadow-sm rounded">
                  <ul className="list-group list-group-flush">
                    {announcementsPreview.map(announcement =>
                      <li key={announcement._id} className="list-group-item">
                        <div>{announcement.content}</div>
                        <div className="text-muted">
                          {announcement.createdAt && moment(announcement.createdAt, "YYYY-MM-DD hh:mm:ss Z").fromNow()}
                          {(announcement.updatedAt !== announcement.createdAt) ? "*" : null}
                        </div>

                      </li>
                    )}
                  </ul>
                </div>

                <div className="card border-0 mt-2" style={{ backgroundColor: "#e9e6df" }}>
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