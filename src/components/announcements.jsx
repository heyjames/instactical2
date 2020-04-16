import React, { Component } from 'react';
import Banner from './banner';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../services/announcementService';
import axios from 'axios';
import moment from 'moment';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';

class Announcements extends Component {
  state = {
    announcements: [],
    currentPage: 1,
    pageSize: 2
  };

  async componentDidMount() {
    let { data } = await getAnnouncements();
    data = data.sort((a, b) => (a._id < b._id) ? 1 : -1);

    this.setState({ announcements: data });
  }

  handlePageChange = (page) => { this.setState({ currentPage: page }); }

  render() {
    const pageTitle = { title: "Announcements" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };
    const { announcements: allAnnouncements, currentPage, pageSize } = this.state;
    const { length: count } = this.state.announcements;

    const announcements = paginate(allAnnouncements, currentPage, pageSize);
    const { user } = this.props;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">

          {user && <div className="row pb-4">
            <div className="col-md-6 offset-md-3">
              <Link to={"/announcements/new/"}>
                <button
                  className="btn btn-sm btn-primary">
                  <i className="fa fa-plus" aria-hidden="true"></i> New</button>
              </Link>
            </div>
          </div>}

          <div className="row">
            <div className="col-md-6 offset-md-3">

              <div className="card">
                <ul className="list-group list-group-flush">
                  {announcements.map(announcement =>
                    <li key={announcement._id} className="list-group-item">
                      <div>{announcement.content}</div>
                      <div className="text-muted">
                        {announcement.createdAt && "Created: " + moment(announcement.createdAt, "YYYY-MM-DD hh:mm:ss Z").fromNow()}
                      </div>
                      <div className="text-muted">
                        {announcement.updatedAt && "Updated: " + moment(announcement.updatedAt, 'YYYY-MM-DD hh:mm:ss Z').fromNow()}
                      </div>
                      {user && <Link to={"/announcements/" + announcement._id}>Edit</Link>}
                    </li>
                  )}
                </ul>
              </div>
              <Pagination
                itemsCount={count}
                currentPage={this.state.currentPage}
                pageSize={this.state.pageSize}
                onPageChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Announcements;