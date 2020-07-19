import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAbout } from '../services/aboutService';
import parse from 'html-react-parser';
import Banner from './banner';
import Button from './button';
import Admin from './common/admin';
import Row from './common/row';
import Container from './common/container';

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: "",
      title: "",
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const { data } = await getAbout();
      const { _id, title, content } = data[0];

      this.setState({ _id, title, content });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  initializePageStyles = () => {
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
    const { title, content } = this.state;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>

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
          
        </Container>
      </React.Fragment>
    );
  }
}

export default About;