import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PlayerList from './playerList';
import { getAnnouncements } from '../../services/announcementService';
import { getFeaturedPost } from '../../services/blogService';
import { getServerInfo } from '../../services/fakeServers';
import _ from "lodash";
import moment from 'moment';
import Time from './../time';
import Container from '../common/container';
import { pause } from '../common/utils';
import { renderLoadingIndicator } from '../common/loading';

class MainInfo extends Component {
  state = {
    isLoadingAnnouncements: true,
    isLoadingFeaturedPost: true,
    isLoadingServerInfo: true,
    announcementsPreview: [],
    featuredPost: {},
    serverInfo: {}
  };
  
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    this.populateServerInfo();

    this.finishPopulating();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  finishPopulating = async () => {
    const results = await Promise.all([this.populateFeaturedPost(), this.populateAnnouncements()]);

    if (this._isMounted) {
      this.setState({ ...results[0], ...results[1] });
    }
  }

  populateServerInfo = async () => {
    try {
      const { data: serverInfo } = await getServerInfo();
      const isLoadingServerInfo = false;
      await pause(0.85);
  
      if (this._isMounted) {
        this.setState({ serverInfo, isLoadingServerInfo });
        }
    } catch (ex) {
      console.log(ex.response);
    }
  }

  populateFeaturedPost = async () => {
    try {
      let featuredPost = await getFeaturedPost();
      featuredPost.content = featuredPost.content.substring(0, 255).trim();
      const isLoadingFeaturedPost = false;
      await pause(0.3);

      return { featuredPost, isLoadingFeaturedPost };
    } catch (ex) {
      console.log(ex.response);
    }
  }

  populateAnnouncements = async () => {
    try {
      let { data: announcementsPreview } = await getAnnouncements();
      announcementsPreview = announcementsPreview.slice(0, 4);
      const isLoadingAnnouncements = false;
      await pause(0.6);

      return { announcementsPreview, isLoadingAnnouncements };
    } catch (ex) {
      console.log(ex.response);
    }
  }

  renderXp = server => {
    if (server.xp) return "XP";
  }

  renderServerStatus = status => {
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

  getPageStyles = () => {
    const pageStyles = {};

    pageStyles.backgroundStyle = {
      backgroundColor: "#e9e6df",
      marginBottom: "0"
    };

    return pageStyles;
  }

  renderAnnouncements = () => {
    const { announcementsPreview, isLoadingAnnouncements } = this.state;

    return (
      <div className="col-xl">
        <h5 className="font-weight-bold">
          <i className="fa fa-bullhorn" aria-hidden="true"></i> Announcements
        </h5>
        {isLoadingAnnouncements
          ? renderLoadingIndicator()
          : 
            (<React.Fragment>
              <div className="card shadow-sm rounded">
                <ul className="list-group list-group-flush">
                  {announcementsPreview.map(announcement =>
                    <li key={announcement._id} className="list-group-item">
                      <div>{announcement.content}</div>
                      <div className="small text-muted">
                        <Time data={announcement} shorthand={true} />
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
            </React.Fragment>)
        }
      </div>
    );
  }

  renderFeaturedPost = () => {
    const { featuredPost, isLoadingFeaturedPost } = this.state;

    return (
      <div className="col-xl-3 pb-4">
        <h5 className="font-weight-bold">
          <i className="fa fa-star" aria-hidden="true"></i> Featured Post
        </h5>
        {isLoadingFeaturedPost
          ? renderLoadingIndicator()
          : (<Link className="no-underline" to={"/blog/post/" + featuredPost.slug}>
              <div className="card shadow-sm rounded" style={{ backgroundColor: "#ffdd57" }}>
                <div className="card-body">
                  <h4>{featuredPost.title}</h4>
                  <div>{featuredPost.content}...</div>
                </div>
              </div>
            </Link>)
        }
      </div>
    );
  }

  renderServerInfo = () => {
    const { serverInfo, isLoadingServerInfo } = this.state;

    let ip = _.get(serverInfo, ["query", "host"]);
    let port = _.get(serverInfo, ["raw", "port"]);
    let map = _.get(serverInfo, ["map"]);
    let length = _.get(serverInfo, ["players", "length"]);
    
    return (
      <div className="col-xl pb-4">
        <h5 className="font-weight-bold">
          <i className="fa fa-server" aria-hidden="true"></i> Servers (US)
        </h5>
        {isLoadingServerInfo 
          ? renderLoadingIndicator()
          : (<div className="card shadow-sm rounded">
            <div className="card-body">

              {this.renderServerStatus(true)}
              <div className="font-weight-bold text-muted">{serverInfo.name}</div>
              <div className="text-muted">{ip + ":" + port}
                <span className="small text-info"> Copy</span>
              </div>
              <div>{map}</div>
              <div>
                <span className="display-4">{length}</span>
                <span className="h5"> / {serverInfo.maxplayers}</span>
              </div>
              <div>{this.getPlayerList()}</div>

            </div>
          </div>)
        }
      </div>
    );
  }

  render() {
    const { backgroundStyle } = this.getPageStyles();

    return (
      <Container style={backgroundStyle}>
        <div className="row">
          {this.renderServerInfo()}
          {this.renderFeaturedPost()}
          {this.renderAnnouncements()}
        </div>
      </Container>
    );
  }
}

export default MainInfo;