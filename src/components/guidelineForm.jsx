import React, { Component } from 'react';
import Banner from './banner';
import { getGuidelines, saveGuidelines } from '../services/fakeGuidelines';
import { pause } from './common/utils';
import Admin from './common/admin';
import Row from './common/row';
import Container from './common/container';
import LoadingWrapper from './common/loadingWrapper';

class GuidelineForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {
        _id: "",
        title: "",
        content: ""
      }
    };
  
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = "Edit Guidelines - insTactical";

    this.populateGuidelines();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  populateGuidelines = async () => {
    try {
      await pause(0.8);
      const { data } = await getGuidelines();
      const { _id, title, content } = data[0];
      const loading = false;
  
      if (this._isMounted) {
        this.setState({ data: { _id, title, content }, loading });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  }

  handleCancel = () => {
    this.props.history.push("/guidelines");
  }

  handleSave = async () => {
    try {
      const guidelines = this.state.data;
      await saveGuidelines(guidelines);
      this.props.history.push("/guidelines");
    } catch (ex) {
      console.log(ex.response.data);
    }
  }

  renderButtons = () => {
    return (
      <div className="pb-3">
        <button
          className="btn btn-sm btn-secondary mr-2"
          onClick={this.handleCancel}
        >
          Cancel
        </button>
        <button
          className="btn btn-sm btn-success ml-2"
          onClick={this.handleSave}
        >
          Save
        </button>
      </div>
    )
  }

  renderForm = (title, content) => {
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            autoFocus
            className="form-control"
            name="title"
            id="title"
            onChange={this.handleChange}
            value={title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            name="content"
            id="content"
            rows="30"
            onChange={this.handleChange}
            value={content}
          >
          </textarea>
        </div>
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
      marginBottom: "0"
    };

    return pageStyles;
  }

  render() {
    const pageTitle = { title: "Guidelines" };
    const { user } = this.props;
    const { data: { title, content }, loading } = this.state;
    const { bannerStyle, backgroundStyle } = this.getPageStyles();

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>

            <Admin user={user}>
              <Row>
                {this.renderButtons()}
                {this.renderForm(title, content)}
              </Row>
            </Admin>

          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default GuidelineForm;