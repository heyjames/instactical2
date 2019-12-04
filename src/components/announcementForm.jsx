import React from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import { saveAnnouncement, getAnnouncement } from '../services/fakeAnnouncements';

class AnnouncementForm extends Form {
  state = {
    data: { announcement: "" },
    errors: {}
  }

  schema = {
    announcement: Joi.string().min(1).required().label('Announcement')
  };

  doSubmit = () => {
    saveAnnouncement(this.state.data);

    this.props.history.push("/announcements");
  }

  componentDidMount() {
    const announcementId = this.props.match.params.id;
    if (announcementId === "new") return;

    const announcement = getAnnouncement(announcementId);
    if (!announcement) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(announcement) });
  }

  mapToViewModel(announcement) {
    return {
      _id: announcement._id,
      announcement: announcement.content
    }
  }

  render() {
    const pageTitle = { title: "Create a new announcement" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <form onSubmit={this.handleSubmit}>
                {this.renderTextArea("announcement", "Announcement", "4")}
                {this.renderButton("Create")}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AnnouncementForm;