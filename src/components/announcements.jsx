import React, { Component } from 'react';
import Banner from './banner';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../services/announcementService';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';
import Time from './time';
import { pause } from './common/utils';
import { renderLoadingIndicator } from './common/loading';
import Container from './common/container';

class Announcements extends Component {
  state = {
    loading: true,
    announcements: [],
    currentPage: 1,
    pageSize: 2
  };
  
  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    document.title = "Announcements - insTactical";

    try {
      await pause(0.35);
      let { data } = await getAnnouncements();
      data = data.sort((a, b) => (a._id < b._id) ? 1 : -1);
      const loading = false;

      if (this._isMounted) {
        this.setState({ announcements: data, loading });
      }
    } catch (ex) {
      if (ex.response.status === 403) {
        this.props.history.replace("/unauthorized");
      } else {
        this.props.history.replace("/");
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePageChange = page => { this.setState({ currentPage: page }); }

  initializePageStyles = () => {
    const pageStyles = {};

    pageStyles.bannerStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    pageStyles.backgroundStyle = {
      backgroundColor: "#f5f5f5",
      marginBottom: "0"
    };

    return pageStyles;
  }

  render() {
    const bannerInfo = { title: "Announcements" };
    const { announcements: allAnnouncements, currentPage, pageSize, loading } = this.state;
    const { length: count } = this.state.announcements;
    const announcements = paginate(allAnnouncements, currentPage, pageSize);
    const { user } = this.props;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          {(loading)
            ? renderLoadingIndicator()
            : <React.Fragment>
                <div className="row">
                  <div className="col-md-4">
                    <Pagination
                      itemsCount={count}
                      currentPage={this.state.currentPage}
                      pageSize={this.state.pageSize}
                      onPageChange={this.handlePageChange}
                    />
                  </div>

                  <div className="col-md-6">
                    {(user && user.isAdmin) && <div className="pb-4">
                      <Link to={"/announcements/new/"}>
                        <button
                          className="btn btn-sm btn-primary">
                          <i className="fa fa-plus" aria-hidden="true"></i> New</button>
                      </Link>
                    </div>}

                    <div className="card shadow-sm rounded">
                      <ul className="list-group list-group-flush">
                        {announcements.map(announcement =>
                          <li key={announcement._id} className="list-group-item">
                            <div>{announcement.content}</div>
                            <div className="small text-muted">
                              <Time data={announcement} />
                            </div>
                            {(user && user.isAdmin) && <Link to={"/announcements/" + announcement._id}>Edit</Link>}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </React.Fragment>
          }
        </Container>
      </React.Fragment>
    );
  }
}

export default Announcements;