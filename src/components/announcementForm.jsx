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
import moment from 'moment';

class AnnouncementForm extends Form {
  state = {
    data: { announcement: "", createdAt: "", updatedAt: "" },
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
    this.renderBannerTitle();
    await this.populateAnnouncement();
    this.setFormState();
  }

  setFormState() {
    let formState = "edit";

    const announcementId = this.props.match.params.id;
    if (announcementId === "new") formState = "create";

    return this.setState({ formState });
  }

  mapToViewModel(announcement) {
    return {
      _id: announcement._id,
      announcement: announcement.content,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt
    }
  }

  async populateAnnouncement() {
    const announcementId = this.props.match.params.id;
    if (announcementId === "new") return;

    const announcement = await getAnnouncement(announcementId);
    if (!announcement) return this.props.history.replace("/not-found");

    this.setState({ data: this.mapToViewModel(announcement) });
  }

  handleCreate = async () => {
    const { announcement } = this.state.data;
    await createAnnouncement({ content: announcement });
    this.props.history.push("/announcements");
  }

  handleDelete = async announcementId => {
    const confirmMsg = "Are you sure?";
    if (window.confirm(confirmMsg)) {
      await deleteAnnouncement(announcementId);
      this.props.history.push("/announcements");
    }
  }

  handleSave = async () => {
    const { data } = this.state;
    const { id } = this.props.match.params;

    await saveAnnouncement({
      _id: id,
      content: data.announcement,
      updatedAt: data.updatedAt
    });

    this.props.history.push("/announcements");
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data }
    data.announcement = input.value;
    this.setState({ data });
  }

  handleCancel = () => {
    this.props.history.push("/announcements");
  }

  renderBannerTitle() {
    let pageTitle = { title: "Edit Announcement" };
    const announcementId = this.props.match.params.id;
    if (announcementId === "new") pageTitle.title = "Create a new announcement";
    this.setState({ pageTitle });
  }

  renderTextArea = () => {
    return (
      <div className="form-group">
        <label htmlFor="announcement">Announcement</label>
        <textarea
          autoFocus
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
    const { id } = this.props.match.params;

    if (formState === "create") {
      return (
        <React.Fragment>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.handleCancel()}>
            Cancel</button>
          <button
            className="btn btn-primary mr-2"
            onClick={() => this.handleCreate()}>
            Create</button>
        </React.Fragment>
      )
    }

    if (formState === "edit") {
      return (
        <React.Fragment>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.handleCancel()}>
            Cancel</button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(id)}>
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