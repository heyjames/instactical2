import React, { Component } from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import Input from './input';
import TextArea from './textArea';
import moment from 'moment';
import {
  getAnnouncement,
  deleteAnnouncement,
  createAnnouncement,
  saveAnnouncement
} from '../services/announcementService';
// import { pause } from './common/utils';
import Row from './common/row';
import Container from './common/container';
import LoadingWrapper from './common/loadingWrapper';

class AnnouncementForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {
        announcement: "",
        createdAt: "",
        updatedAt: ""
      },
      errors: {}
    }
  
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const announcementId = this.props.match.params.id;
    
    (announcementId === "new")
      ? this.stopLoading()
      : this.populateAnnouncement(announcementId);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // schema = {
  //   _id: Joi.string(),
  //   announcement: Joi.string()
  //     .min(1)
  //     .required()
  //     .label('Announcement')
  //     .trim()
  // };

  mapToViewModel = announcement => {
    return {
      _id: announcement._id,
      announcement: announcement.content,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt
    }
  }

  stopLoading = async () => {
    try {
      // await pause(0.2);
    } catch (ex) {
      this.props.history.replace("/");
    }

    if (this._isMounted) {
      return this.setState({ loading: false });
    }
  }

  populateAnnouncement = async announcementId => {
    try {
      // await pause(0.35);
      const announcement = await getAnnouncement(announcementId);
      if (!announcement) return this.props.history.replace("/not-found");
      const data = this.mapToViewModel(announcement)
      const loading = false;
  
      if (this._isMounted) {
        this.setState({ data, loading });
      }
    } catch (ex) {
      if (ex.response.status === 403) {
        this.props.history.replace("/unauthorized");
      } else {
        this.props.history.replace("/");
      }
    }
  }

  handleCreate = async () => {
    const { announcement } = this.state.data;

    try {
      await createAnnouncement({ content: announcement });
      this.props.history.push("/announcements");
    } catch (ex) {
      this.props.history.replace("/");
    }
  }

  handleDelete = async announcementId => {
    const confirmMsg = "Are you sure?";

    if (window.confirm(confirmMsg)) {
      try {
        await deleteAnnouncement(announcementId);
        this.props.history.push("/announcements");
      } catch (ex) {
        this.props.history.replace("/");
      }
    }
  }

  handleSave = async announcementId => {
    const { data } = this.state;

    try {
      await saveAnnouncement({
        _id: announcementId,
        content: data.announcement,
        updatedAt: data.updatedAt
      });
  
      this.props.history.push("/announcements");
    } catch (ex) {
      this.props.history.replace("/");
    }
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data }
    data.announcement = input.value;
    
    this.setState({ data });
  }

  handleCancel = () => {
    this.props.history.push("/announcements");
  }

  renderTextArea = announcement => {
    return (
      <div className="form-group">
        <textarea
          autoFocus
          className="form-control"
          name="announcement"
          id="announcement"
          rows="4"
          onChange={this.handleChange}
          value={announcement}
        >
        </textarea>
      </div>
    )
  }

  renderCreateBtns = announcementId => {
    if (announcementId !== "new") return;
    
    return (
      <button
        className="btn btn-primary mr-2"
        onClick={() => this.handleCreate()}
      >
        Create
      </button>
    )
  }

  renderEditBtns = announcementId => {
    if (announcementId === "new") return;
    
    return (
      <React.Fragment>
        <button
          className="btn btn-danger"
          onClick={() => this.handleDelete(announcementId)}
        >
          Delete
        </button>
        <button
          className="btn btn-success ml-2"
          onClick={() => this.handleSave(announcementId)}
        >
          Save
        </button>
      </React.Fragment>
    )
  }

  renderBtns = announcementId => {
    return (
      <React.Fragment>
        <button
          className="btn btn-secondary mr-2"
          onClick={() => this.handleCancel()}
        >
          Cancel
        </button>
        {this.renderCreateBtns(announcementId)}
        {this.renderEditBtns(announcementId)}
      </React.Fragment>
    )
  }

  getPageStyles = () => {
    const pageStyles = {};

    pageStyles.bannerStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    pageStyles.backgroundStyle = {
      backgroundColor: "#f5f5f5",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    return pageStyles;
  }

  getBannerInfo = announcementId => {
    const pageTitle = { title: "" };

    pageTitle.title = (announcementId === "new")
      ? "Create A New Announcement"
      : "Edit Announcement";

    return pageTitle;
  }

  render() {
    const { data: { announcement }, loading } = this.state;
    const { bannerStyle, backgroundStyle } = this.getPageStyles();
    const announcementId = this.props.match.params.id;
    const bannerInfo = this.getBannerInfo(announcementId);

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>
            <Row customColClass="col-md-6 offset-md-3">
              {this.renderTextArea(announcement)}
              {this.renderBtns(announcementId)}
            </Row>
          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default AnnouncementForm;