import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayers, saveCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Banner from './banner';
import Joi from 'joi-browser';

class CassandraPlayers extends Form {
  state = { data: [], new: { steamId: "" }, errors: {} };

  async componentDidMount() {
    const data = await getCassandraPlayers();

    console.log(data);
    this.setState({ data });
  }

  schema = {
    _id: Joi.string().min(1).max(50),
    steamId: Joi.string().min(17).max(17).required().label("Steam ID")
  }

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.new, this.schema, options);
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

  handleCancel = (e) => {
    e.preventDefault();

    console.log("Cancel button pressed.");
  }

  handleSave = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSave();
  }

  doSave = async () => {
    try {
      // const { data } = this.state;

      // await saveCassandraPlayer();

      // this.props.history.push("/about");
      await console.log("Save button pressed.");
    } catch (ex) {
      // if (ex.response && ex.response.status === 404) {
      //   this.props.history.replace("/not-found");
      // }
    }
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    const errorMsg = this.validateProperty(input);
    obj.errors[input.name] = errorMsg;
    obj.new[input.name] = input.value;

    this.setState(obj);
  }

  renderNewForm = () => {
    const { errors } = this.state;
    const { steamId } = this.state.new;

    return (
      <div className="row">
        <div className="col-md-3">
          <form onSubmit={this.handleSave}>
            <div className="pb-4">
              {this.renderButton("Cancel", "btn-secondary mr-2", this.handleCancel)}
              {this.renderButton("Save", "btn-success ml-2 mr-2")}
            </div>
            {this.renderInput("steamId", "Steam ID", steamId, this.handleChange, "text", errors)}
            {/* {this.renderTextArea("content", "Content", content, this.handleChange, "18")} */}
          </form>
        </div>
      </div>
    );
  }

  render() {
    const pageTitle = { title: "Cassandra Players" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };
    const classification = [
      { type: "admin", css: "" },
      { type: "mod", css: "" }
    ];

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">
                {this.renderNewForm()}

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Edit</th>
                      <th scope="col">Steam ID</th>
                      <th scope="col">Alias</th>
                      <th scope="col">Classification</th>
                      <th scope="col">Comment</th>
                      <th scope="col">Full Ban</th>
                      <th scope="col">Kicks</th>
                      <th scope="col">Bans</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.data.map((player, index) => {
                      return (
                        <tr key={index}>
                          <td></td>
                          <td>{player.steamId}</td>
                          <td>{player.alias.map((name, index, arrayObj) => {
                            return (
                              <div key={index} className="badge badge-pill badge-secondary">{name}</div>
                            )
                          })}
                          </td>
                          <td><span className="badge badge-pill badge-primary">{classification[player.classification].type}</span></td>
                          <td>{player.comment}</td>
                          <td>{player.fullBan.toString()}</td>
                          <td>{player.kicks.map((kick, index, arrayObj) => {
                            return (
                              <div key={index}>
                                <div className="badge badge-pill badge-warning">{kick.server}</div>
                                <div className="badge badge-pill badge-secondary">{kick.date}</div>
                                <div className="badge badge-pill badge-secondary">{kick.autoKick.toString()}</div>
                                <div className="badge badge-pill badge-secondary">{kick.reasonCode}</div>
                                <div className="badge badge-pill badge-secondary">{kick.reason}</div>
                                <div className="badge badge-pill badge-secondary">{kick.sid}</div>
                                <div className="badge badge-pill badge-secondary">{kick.sidTimestamp}</div>
                                <div className="badge badge-pill badge-secondary">{kick.sidComment}</div>
                              </div>
                            )
                          })}
                          </td>
                          <td>{player.bans.map((ban, index, arrayObj) => {
                            return (
                              <div key={index}>
                                <div className="badge badge-pill badge-danger">{ban.server}</div>
                                <div className="badge badge-pill badge-secondary">{ban.date}</div>
                                <div className="badge badge-pill badge-secondary">{ban.reasonCode}</div>
                                <div className="badge badge-pill badge-secondary">{ban.reason}</div>
                                <div className="badge badge-pill badge-secondary">{ban.sid}</div>
                                <div className="badge badge-pill badge-secondary">{ban.sidTimestamp}</div>
                                <div className="badge badge-pill badge-secondary">{ban.sidComment}</div>
                              </div>
                            )
                          })}
                          </td>
                        </tr>
                      )
                    }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CassandraPlayers;