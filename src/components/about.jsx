import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAbout } from '../services/aboutService';
import parse from 'html-react-parser';
import Banner from './banner';
import Button from './button';
import Admin from './common/admin';
import Row from './common/row';
import Container from './common/container';
import { pause } from './common/utils';
import LoadingWrapper from './common/loadingWrapper';

class About extends Component {
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
    document.title = "About - insTactical";

    this.populateAbout();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  populateAbout = async () => {
    try {
      // await pause(0.8);
      const { data } = await getAbout();
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
    const { user } = this.props;
    const { title, content, loading } = this.state;
    const { bannerStyle, backgroundStyle } = this.getPageStyles();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>

            <Admin user={user}>
              <Row addToRowClass="pb-4">
                <Link to={"/about/edit"}>
                  <Button
                    label="Edit"
                    customClass="btn-sm btn-primary"
                    fontAwesomeClass="fa-edit"
                  />
                </Link>
              </Row>
            </Admin>

            <Row>
              <h3>{title}</h3>
              <div>{parse(content)}</div>
            </Row>

          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default About;