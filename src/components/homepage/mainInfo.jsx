import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../../services/announcementService';
import { getFeaturedPost } from '../../services/blogService';
import { getServerInfo } from '../../services/serverInfoService';
import _ from "lodash";
import Time from './../time';
import Container from '../common/container';
import { pause } from '../common/utils';
import LoadingWrapper from '../common/loadingWrapper';
import Server from '../server';

class MainInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingAnnouncements: true,
      isLoadingFeaturedPost: true,
      isLoadingServerInfo: true,
      announcementsPreview: [],
      featuredPost: {},
      serverInfo: []
      };
    
      this._isMounted = false;
    };

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
        
        <LoadingWrapper loading={isLoadingAnnouncements}>
          <React.Fragment>
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
          </React.Fragment>
        </LoadingWrapper>
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

        <LoadingWrapper loading={isLoadingFeaturedPost}>
          <Link className="no-underline" to={"/blog/post/" + featuredPost.slug}>
            <div className="card shadow-sm rounded" style={{ backgroundColor: "#ffdd57" }}>
              <div className="card-body">
                <h4>{featuredPost.title}</h4>
                <div>{featuredPost.content}...</div>
              </div>
            </div>
          </Link>
        </LoadingWrapper>
      </div>
    );
  }

  renderServerInfo = () => {
    const { serverInfo, isLoadingServerInfo } = this.state;
    
    return (
      <div className="col-xl pb-4">
        <h5 className="font-weight-bold">
          <i className="fa fa-server" aria-hidden="true"></i> Servers (US)
        </h5>

        <LoadingWrapper loading={isLoadingServerInfo}>
          {serverInfo.map((data, index) => <Server key={index} data={data} />)}
        </LoadingWrapper>
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