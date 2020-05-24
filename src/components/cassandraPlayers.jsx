import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayers, saveCassandraPlayer, deleteCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Banner from './banner';
import Joi from 'joi-browser';

class CassandraPlayers extends Form {
  state = {
    data: [],
    newEntry: {
      steamId: "",
      comments: "",
      classification: "",
      fullBan: false,
      alias: "",
      kicks: [],
      bans: [],
      kickDate: "",
      kickedServers: "",
      autoKick: false,
      kickReasonCode: "",
      kickReason: "",
      kickSid: "",
      kickSidTimestamp: "",
      banDate: "",
      bannedServers: "",
      banReasonCode: "",
      banReason: "",
      banSid: "",
      banSidTimestamp: ""
    },
    errors: {}
  };

  classifications = [
    { type: "admin", label: "Admin", code: "00", css: "" },
    { type: "mod", label: "Moderator", code: "01", css: "" },
    { type: "regular", label: "Regular", code: "02", css: "" },
    { type: "moderatelyCompliant", label: "Moderately Compliant", code: "03", css: "" },
    { type: "kickedButReformed", label: "Kicked but Reformed", code: "04", css: "" },
    { type: "uncategorized", label: "Uncategorized", code: "05", css: "" },
    { type: "concern", label: "Concern", code: "06", css: "" },
    { type: "kicked", label: "Kicked", code: "07", css: "" },
    { type: "unbanned", label: "Unbanned", code: "08", css: "" },
    { type: "banned", label: "Banned", code: "09", css: "" }
  ];

  async componentDidMount() {
    const data = await getCassandraPlayers();

    // console.log(data);
    this.setState({ data });
  }

  autoInputSampleEntry = (e) => {
    e.preventDefault();

    const newEntry = {
      steamId: "76561197981103098",
      comments: "Doesn't communicate and constantly breaks the tap rule even after warnings.",
      classification: "09",
      fullBan: false,
      alias: "el-jack",
      kickDate: "2020-01-01",
      kickedServers: "1",
      autoKick: false,
      kickReasonCode: "tap",
      kickReason: "Constantly tapping objective after warnings.",
      kickSid: "436845d0-7559-4685-aee5-ea599b0e4fb8",
      kickSidTimestamp: "32:16",
      banDate: "2020-02-02",
      bannedServers: "4",
      banReasonCode: "tap",
      banReason: "Warned, kicked, still taps.",
      banSid: "436845d0-7559-4685-aee5-ea599b0e4fb3",
      banSidTimestamp: "12:51"
    }

    this.setState({ newEntry });
  }

  schema = {
    _id: Joi.string().min(1).max(50),
    steamId: Joi.string().min(17).max(17).required().label("Steam ID"),
    comments: Joi.string().max(350).allow("").label("Comments"),
    classification: Joi.string().max(20).allow("").label("Classification"),
    alias: Joi.string().min(1).max(350).required().label("Alias"),
    fullBan: Joi.boolean().label("Full Ban"),
    kickDate: Joi.string().max(50).allow("").label("Kick Date"),
    kickedServers: Joi.string().max(10).allow("").label("Kicked Servers"),
    autoKick: Joi.boolean().label("Auto-kick"),
    kickReasonCode: Joi.string().max(8).allow("").label("Kick Reason Code"),
    kickReason: Joi.string().max(350).allow("").label("Kick Reason"),
    kickSid: Joi.string().max(50).allow("").label("Kick SID"),
    kickSidTimestamp: Joi.string().max(20).allow("").label("Kick SID Timestamp"),
    banDate: Joi.string().max(50).allow("").label("Ban Date"),
    bannedServers: Joi.string().max(10).allow("").label("Banned Servers"),
    banReasonCode: Joi.string().max(8).allow("").label("Ban Reason Code"),
    banReason: Joi.string().max(350).allow("").label("Ban Reason"),
    banSid: Joi.string().max(50).allow("").label("Ban SID"),
    banSidTimestamp: Joi.string().max(20).allow("").label("Ban SID Timestamp"),
    kicks: Joi.array(),
    bans: Joi.array()
  }

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.newEntry, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    // console.log(error);

    return error && error.details[0].message;
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    const errorMsg = this.validateProperty(input);
    obj.errors[input.name] = errorMsg;
    obj.newEntry[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState(obj);
  }

  handleCancel = (e) => {
    e.preventDefault();

    console.log("Cancel button pressed.");
  }

  mapViewToModel = (newEntry) => {
    const alias = (newEntry.alias.includes(","))
      ? newEntry.alias.split(",")
      : [newEntry.alias];

    const kicks = [];
    const kick = {
      kickDate: newEntry.kickDate,
      kickedServers: newEntry.kickedServers,
      autoKick: newEntry.autoKick,
      kickReasonCode: newEntry.kickReasonCode,
      kickReason: newEntry.kickReason,
      kickSid: newEntry.kickSid,
      kickSidTimestamp: newEntry.kickSidTimestamp
    }
    kicks.push(kick);

    const bans = [];
    const ban = {
      banDate: newEntry.banDate,
      bannedServers: newEntry.bannedServers,
      banReasonCode: newEntry.banReasonCode,
      banReason: newEntry.banReason,
      banSid: newEntry.banSid,
      banSidTimestamp: newEntry.banSidTimestamp
    }
    bans.push(ban);

    return ({
      steamId: newEntry.steamId,
      comments: newEntry.comments,
      classification: newEntry.classification,
      fullBan: newEntry.fullBan,
      alias: alias,
      kicks: kicks,
      bans: bans
    });
  }

  handleDelete = async (steamId) => {
    try {
      if (window.confirm("Are you sure?")) {
        await deleteCassandraPlayer(steamId);

        const data = this.state.data.filter(c => c.steamId !== steamId);
        this.setState({ data });
        // this.props.history.push("/cassandraplayers");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
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
      const newEntry = this.mapViewToModel(this.state.newEntry);
      const response = await saveCassandraPlayer(newEntry);

      const data = await getCassandraPlayers();
      this.setState({ data });

      console.log("Save button pressed.");
      // this.props.history.push("/cassandraplayers");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  renderDropdown = () => {
    const classifications = this.classifications;

    return (
      <div className="form-group">
        <div>
          <label>Classification</label>
        </div>

        <select name="classification" size="12" onChange={this.handleChange} value={this.state.newEntry.classification}>
          <option value=""> -- select an option -- </option>
          {classifications.map((classification, index) => {
            return (
              <option key={index} value={classification.code}>{classification.label}</option>
            )
          })}
        </select>
      </div>
    );
  }

  renderNewForm = () => {
    const { errors } = this.state;
    const {
      steamId,
      comments,
      fullBan,
      alias,
      kickDate,
      kickedServers,
      autoKick,
      kickReasonCode,
      kickReason,
      kickSid,
      kickSidTimestamp,
      banDate,
      bannedServers,
      banReasonCode,
      banReason,
      banSid,
      banSidTimestamp
    } = this.state.newEntry;

    return (
      <div className="row">
        <div className="col-md-3">
          {this.renderButton("Auto-Input Data", "btn-primary ml-2 mr-2", this.autoInputSampleEntry)}
          <form onSubmit={this.handleSave}>
            <div className="pb-4">
              {this.renderButton("Cancel", "btn-secondary mr-2", this.handleCancel)}
              {this.renderButton("Save", "btn-success ml-2 mr-2")}
            </div>
            {this.renderInput("steamId", "Steam ID", steamId, this.handleChange, "text", errors)}
            {this.renderInput("alias", "Alias", alias, this.handleChange, "text", errors)}
            {this.renderCheckbox("fullBan", "Full Ban", fullBan, this.handleChange)}
            {this.renderInput("comments", "Comments", comments, this.handleChange, "text", errors)}
            {this.renderDropdown()}
            {this.renderInput("kickDate", "Kick Date", kickDate, this.handleChange, "text", errors)}
            {this.renderInput("kickedServers", "Kicked Servers", kickedServers, this.handleChange, "text", errors)}
            {this.renderCheckbox("autoKick", "Auto-kick", autoKick, this.handleChange)}
            {this.renderInput("kickReasonCode", "Kick Reason Code", kickReasonCode, this.handleChange, "text", errors)}
            {this.renderInput("kickReason", "Kick Reason", kickReason, this.handleChange, "text", errors)}
            {this.renderInput("kickSid", "Kick SID", kickSid, this.handleChange, "text", errors)}
            {this.renderInput("kickSidTimestamp", "Kick SID Timestamp", kickSidTimestamp, this.handleChange, "text", errors)}

            {this.renderInput("banDate", "Ban Date", banDate, this.handleChange, "text", errors)}
            {this.renderInput("bannedServers", "Banned Servers", bannedServers, this.handleChange, "text", errors)}
            {this.renderInput("banReasonCode", "Ban Reason Code", banReasonCode, this.handleChange, "text", errors)}
            {this.renderInput("banReason", "Ban Reason", banReason, this.handleChange, "text", errors)}
            {this.renderInput("banSid", "Ban SID", banSid, this.handleChange, "text", errors)}
            {this.renderInput("banSidTimestamp", "Ban SID Timestamp", banSidTimestamp, this.handleChange, "text", errors)}
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
    const classifications = this.classifications;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Edit</th>
                      <th scope="col">Steam ID</th>
                      <th scope="col">Alias</th>
                      <th scope="col">Classification</th>
                      <th scope="col">Comments</th>
                      <th scope="col">Full Ban</th>
                      <th scope="col">Kicks</th>
                      <th scope="col">Bans</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.data.map((player, index) => {
                      let fullBanClass = "badge badge-pill";
                      fullBanClass += (player.fullBan) ? " badge-danger" : " badge-secondary";

                      const steamId = player.steamId;

                      let classificationLabel = "";
                      let classificationId = player.classification;

                      if (player.classification !== "") {
                        let classification = classifications.filter((c) => { return c.code === player.classification })[0];
                        if (classification) {
                          classificationLabel = classification.label;
                        } else {
                          console.log("Classification Error");
                        }
                      }

                      return (
                        <tr key={index}>
                          <td>
                            <form onSubmit={(e) => e.preventDefault()}>
                              {this.renderButton("Delete", "btn-sm btn-danger mr-2", () => this.handleDelete(steamId))}
                            </form>
                          </td>
                          <td>{player.steamId}</td>
                          <td>{player.alias.map((name, index, arrayObj) => {
                            return (
                              <div key={index} className="badge badge-pill badge-secondary">{name}</div>
                            )
                          })}
                          </td>
                          <td><span className="badge badge-pill badge-secondary">{classificationLabel}</span></td>
                          <td>{player.comments}</td>
                          <td><span className={fullBanClass}>{player.fullBan.toString()}</span></td>
                          <td>{player.kicks.map((kick, index, arrayObj) => {
                            return (
                              <div key={index}>
                                <div className="badge badge-pill badge-warning">{kick.kickedServers}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickDate}</div>
                                <div className="badge badge-pill badge-secondary">{kick.autoKick.toString()}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickReasonCode}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickReason}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickSid}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickSidTimestamp}</div>
                              </div>
                            )
                          })}
                          </td>
                          <td>{player.bans.map((ban, index, arrayObj) => {
                            return (
                              <div key={index}>
                                <div className="badge badge-pill badge-danger">{ban.bannedServers}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banDate}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banReasonCode}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banReason}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banSid}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banSidTimestamp}</div>
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
                {this.renderNewForm()}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CassandraPlayers;