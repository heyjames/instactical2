import React, { Component } from 'react';
import { getGuidelines } from '../services/guidelineService';
import Banner from './navigation/banner';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
// import { pause } from './common/utils';
import Admin from './common/admin';
import Row from './common/row';
import Container from './common/container';
import LoadingWrapper from './common/loadingWrapper';

class Guidelines extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      loading: true,
      _id: "",
      title: "",
      content: ""
    };
  
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    document.title = "Guidelines - insTactical";

    this.populateGuidelines();
  }
  
  populateGuidelines = async () => {
    try {
      // await pause(0.8);
      const { data } = await getGuidelines();
      const { _id, title, content } = data[0];
      const loading = false;
  
      if (this._isMounted) {
        this.setState({ _id, title, content, loading });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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
    const bannerInfo = { title: "Guidelines" };
    const { user } = this.props;
    const { title, content, loading } = this.state;
    const { bannerStyle, backgroundStyle } = this.getPageStyles();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>
            
            <Admin user={user}>
              <Row addToRowClass="pb-3">
                <Link to={"/guidelines/edit"}>
                  <button
                    className="btn btn-sm btn-primary mr-2">
                    <i className="fa fa-edit" aria-hidden="true"></i> Edit
                  </button>
                </Link>
              </Row>
            </Admin>

            <Row>
              <p>{title}</p>
              {parse(content)}
            </Row>

          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default Guidelines;