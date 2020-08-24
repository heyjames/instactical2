import React, { Component } from 'react';
import Banner from './banner';

// // Alternative method to get current user object
// import { getUser } from '../services/userService';

class Profile extends Component {
  componentDidMount() {
    document.title = "Profile - insTactical";
  //   // Alternative method to get current user object
  //   const { data } = await getUser();
  //   console.log(data);
  }

  render() {
    const pageTitle = { title: "Me" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };

    const { user } = this.props;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">

          <div className="row">
            <div className="col-md-8 offset-md-2">
              <p><span className="font-weight-bold">User ID: </span>{user._id}</p>
              <p><span className="font-weight-bold">Name: </span>{user.name}</p>
              <p><span className="font-weight-bold">Email: </span>{user.email}</p>
              <p><span className="font-weight-bold">Admin: </span>{user.isAdmin ? "true" : "false"}</p>
            </div>
          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default Profile;