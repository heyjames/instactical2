import React from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import { getAnnouncement, deleteAnnouncement, createAnnouncement, saveAnnouncement } from '../services/fakeAnnouncements';

class AnnouncementForm extends Form {
  state = {
    data: { announcement: "" },
    errors: {}
  }

  schema = {
    announcement: Joi.string().min(1).required().label('Announcement')
  };

  doSubmit = async () => {
    let obj = { ...this.state.data };
    obj = this.mapViewToModel2(obj);
    console.log(obj);
    await createAnnouncement(obj);

    this.props.history.push("/announcements");
  }

  mapViewToModel2(obj) {
    return {
      _id: this.props.match.params.id,
      content: obj.announcement
    }
  }

  async componentDidMount() {
    const announcementId = this.props.match.params.id;
    if (announcementId === "new") return;

    const announcement = await getAnnouncement(announcementId);
    if (!announcement) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(announcement) });
  }

  handleDelete = async announcementId => {
    await deleteAnnouncement(announcementId);
    this.props.history.push("/announcements");
  }

  handleSave = async () => {

    let obj = { ...this.state.data };
    obj = this.mapViewToModel2(obj);
    // console.log(obj);
    // obj = JSON.stringify(obj);
    await saveAnnouncement(obj);
    // this.props.history.push("/announcements");
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
    const announcementId = this.props.match.params.id;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <form onSubmit={this.handleSubmit}>
                {this.renderTextArea("announcement", "Announcement", "4")}
                {this.renderButton("Create")}
                <button className="btn btn-danger" onClick={() =>
                  this.handleDelete(announcementId)}>Delete</button>
                <button className="btn btn-success" onClick={() =>
                  this.handleSave()}>Save</button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AnnouncementForm;