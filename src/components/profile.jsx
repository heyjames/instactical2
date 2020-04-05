import React from 'react';
import Banner from './banner';
import { getUser } from '../services/userService';

const Profile = ({ user }) => {
  const pageTitle = { title: "Me" };
  const jumbotronStyle = {
    backgroundColor: "#424242",
    padding: "2rem 1rem"
  };

  console.log(user);

  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">

        <div className="row">
          <div className="col-md-8 offset-md-2">
            {user._id}
          </div>
        </div>

      </div>
    </React.Fragment>
  );
}

export default Profile;