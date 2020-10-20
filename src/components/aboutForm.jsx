import React from 'react';
import { getAbout, saveAbout } from '../services/aboutService';
import Banner from './navigation/banner';
import Form from './common/form';
import Joi from 'joi-browser';
import Row from './common/row';
import Container from './common/container';
// import { pause } from './common/utils';
import LoadingWrapper from './common/loadingWrapper';

class AboutForm extends Form {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
      data: {
        _id: "",
        title: "",
        content: ""
      },
      errors: {}
    };
  
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = "Edit About - insTactical";

    this.populateAbout();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  schema = {
    _id: Joi.string().min(1).max(50),
    title: Joi.string().min(1).max(5).required().label("Title"),
    content: Joi.string().min(2).required().label("Content")
  }
  
  populateAbout = async () => {
    try {
      // await pause(0.8);
      const { data } = await getAbout();
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

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error && error.details[0].message;
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    const errorMsg = this.validateProperty(input);
    obj.errors[input.name] = errorMsg;
    obj.data[input.name] = input.value;

    this.setState(obj);
  }

  handleCancel = e => {
    e.preventDefault();

    this.props.history.push("/about");
  }

  handleSave = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSave();
  }

  doSave = async () => {
    try {
      const { _id, title, content } = this.state.data;
      await saveAbout({ _id, title, content });
      
      this.props.history.push("/about");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
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
    const bannerInfo = { title: "About" };
    const { data, errors, loading } = this.state;
    const { title, content } = data;
    const { bannerStyle, backgroundStyle } = this.getPageStyles();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>
            <Row>
              <form onSubmit={this.handleSave}>
                <div className="pb-3">
                  {this.renderButton("Cancel", "btn-sm btn-secondary mr-2", this.handleCancel)}
                  {this.renderButton("Save", "btn-sm btn-success ml-2 mr-2")}
                </div>
                {this.renderInput("title", "Title", title, this.handleChange, "text", errors)}
                {this.renderTextArea("content", "Content", content, this.handleChange, "18", errors)}
              </form>
            </Row>
          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default AboutForm;