import React, { Component } from 'react';

class Blog extends Component {
  render() {
    const jumbotronStyle = { backgroundColor: "#f5f5f5", marginBottom: "0" };
    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container">


            <div className="row">
              <div className="col-xl">
                <h5>Blog</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-lg pb-4">
                <div class="card">
                  <img class="card-img-top" src="dallas-returns.png" alt="Card image cap" />
                  <div class="card-body">
                    <p class="card-text">Dallas server is being brought back to replace the San Francisco server. This way, the ping from anyone in the US will be no greater than...</p>
                  </div>
                </div>
              </div>

              <div className="col-lg pb-4">
                <div class="card">
                  <img class="card-img-top" src="dallas-hiatus.png" alt="Card image cap" />
                  <div class="card-body">
                    <p class="card-text">Dallas server is being brought back to replace the San Francisco server. This way, the ping from anyone in the US will be no greater than...</p>
                  </div>
                </div>
              </div>

              <div className="col-lg">
                <div class="card">
                  <img class="card-img-top" src="server-info.png" alt="Card image cap" />
                  <div class="card-body">
                    <p class="card-text">Dallas server is being brought back to replace the San Francisco server. This way, the ping from anyone in the US will be no greater than...</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg">
                <div class="card border-0" style={{ backgroundColor: "#f5f5f5" }}>
                  <div class="card-body">
                    <h6 className="text-right">More Posts</h6>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Blog;