import React from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import Input from './input';
import TextArea from './textArea';
import {
  getAnnouncement,
  deleteAnnouncement,
  createAnnouncement,
  saveAnnouncement
} from '../services/announcementService';

class AnnouncementForm extends Form {
  state = {
    data: { announcement: "" },
    errors: {},
    pageTitle: { title: "" },
    formState: ""
  }

  schema = {
    _id: Joi.string(),
    announcement: Joi.string()
      .min(1)
      .required()
      .label('Announcement')
      .trim()
  };

  async componentDidMount() {
    this.populateBanner();
    await this.populateAnnouncement();
    await this.setFormState();
  }

  async setFormState() {
    let obj = { ...this.state };

    const announcementId = this.props.match.params.id;
    if (announcementId === "new") return this.setState({ formState: "create" });

    const announcement = await getAnnouncement(announcementId);
    if (!announcement) return;

    return this.setState({ formState: "edit" });
  }

  mapToViewModel(announcement) {
    return {
      _id: announcement._id,
      announcement: announcement.content
    }
  }

  mapToDbModel(announcement) {
    return {
      _id: this.state.data._id,
      content: announcement.announcement
    }
  }

  async populateAnnouncement() {
    const announcementId = this.props.match.params.id;
    if (announcementId === "new") return;

    const announcement = await getAnnouncement(announcementId);
    if (!announcement) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(announcement) });
  }

  populateBanner() {
    const announcementId = this.props.match.params.id;
    if (announcementId === "new") {
      this.setState({ pageTitle: { title: "Create a new announcement" } });
      return;
    }

    this.setState({ pageTitle: { title: "Edit Announcement" } })
  }

  handleCreate = async () => {
    let obj = { ...this.state.data };
    obj = this.mapToDbModel(obj);
    await createAnnouncement(obj);

    this.props.history.push("/announcements");
  }

  handleDelete = async announcementId => {
    await deleteAnnouncement(announcementId);
    this.props.history.push("/announcements");
  }

  handleSave = async () => {
    let obj = { ...this.state.data };
    obj = this.mapToDbModel(obj);
    await saveAnnouncement(obj);
    this.props.history.push("/announcements");
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data }
    data.announcement = input.value;
    this.setState({ data });
  }

  renderTextArea = () => {
    return (
      <div className="form-group">
        <label htmlFor="announcement">Announcement</label>
        <textarea
          className="form-control"
          name="announcement"
          id="announcement"
          rows="4"
          onChange={this.handleChange}
          value={this.state.data.announcement}
        >
        </textarea>
      </div>
    )
  }

  renderBtns = () => {
    const { formState } = this.state;
    const announcementId = this.props.match.params.id;

    if (formState === "create") {
      return (
        <button
          className="btn btn-primary mr-2"
          onClick={() => this.handleCreate()}>
          Create</button>
      )
    }

    if (formState === "edit") {
      return (
        <React.Fragment>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(announcementId)}>
            Delete</button>
          <button
            className="btn btn-success ml-2"
            onClick={() => this.handleSave()}>
            Save</button>
        </React.Fragment>
      )
    }
  }

  render() {
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };

    const { pageTitle } = this.state;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <form onSubmit={(e) => e.preventDefault()}>
                {this.renderTextArea()}
                {this.renderBtns()}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AnnouncementForm;