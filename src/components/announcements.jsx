import React, { Component } from 'react';
import Banner from './banner';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../services/announcementService';
import axios from 'axios';
import moment from 'moment';

class Announcements extends Component {
  state = { announcements: [] };

  async componentDidMount() {
    let { data } = await getAnnouncements();
    data = data.sort((a, b) => (a._id < b._id) ? 1 : -1);

    this.setState({ announcements: data });
  }

  render() {
    const pageTitle = { title: "Announcements" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };
    const { announcements } = this.state;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">

              <Link to={"/announcements/new/"}>New</Link>
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
                      <Link to={"/announcements/" + announcement._id}>Edit</Link>
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
}

export default Announcements;