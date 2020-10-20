import React, { Component } from 'react';
import Banner from './navigation/banner';
import Row from './common/row';
import Container from './common/container';
// import { pause } from './common/utils';
import LoadingWrapper from './common/loadingWrapper';
// // Alternative method to get current user object
// import { getUser } from '../services/userService';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    document.title = "Profile - insTactical";

    // await pause(0.8);
    const loading = false;
    
    if (this._isMounted) {
      this.setState({ loading });
    }
  //   // Alternative method to get current user object
  //   const { data } = await getUser();
  //   console.log(data);
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

  renderAdminValue = isAdmin => {
    let customClass = "";
    let adminLabel = "";

    if (isAdmin) {
      customClass = "success";
      adminLabel = "Yes";
    } else {
      customClass = "danger";
      adminLabel = "No";
    }

    return (
      <span className={`badge badge-${customClass} pl-2 pr-2`}>
        {adminLabel}
      </span>
    )
  }

  render() {
    const bannerInfo = { title: "Me" };
    const { user } = this.props;
    const { loading } = this.state;
    const { bannerStyle, backgroundStyle } = this.getPageStyles();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>
            <Row>
              <p><span className="font-weight-bold">User ID: </span>{user._id}</p>
              <p><span className="font-weight-bold">Name: </span>{user.name}</p>
              <p><span className="font-weight-bold">Email: </span>{user.email}</p>
              <p><span className="font-weight-bold">Admin: </span>{this.renderAdminValue(user.isAdmin)}</p>
            </Row>
          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default Profile;