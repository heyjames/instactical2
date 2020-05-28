import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayers, createCassandraPlayer, deleteCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Banner from './banner';
import Joi from 'joi-browser';
import _ from "lodash";

class CassandraPlayers extends Form {

  defaultClassificationCode = "";

  state = {
    data: [],
    filteredData: [],
    search: "",
    filter: {},
    newEntry: {
      steamId: "",
      comments: "",
      classification: this.defaultClassificationCode,
      fullBan: false,
      alias: "",
      kicks: [],
      bans: [],
      // kickDate: "",
      // kickedServers: "",
      // autoKick: false,
      // kickReasonCode: "",
      // kickReason: "",
      // kickSid: "",
      // kickSidTimestamp: "",
      // banDate: "",
      // bannedServers: "",
      // banReasonCode: "",
      // banReason: "",
      // banSid: "",
      // banSidTimestamp: ""
    },
    errors: {}
  };

  classifications = [
    { type: "admin", label: "Admin", code: "00", css: { backgroundColor: "#8000ff" } },
    { type: "mod", label: "Moderator", code: "01", css: { backgroundColor: "#0070ff" } },
    { type: "regular", label: "Regular", code: "02", css: { backgroundColor: "#00ce16" } },
    { type: "moderatelyCompliant", label: "Moderately Compliant", code: "03", css: { backgroundColor: "#00ce16", border: "2px solid #000000" } },
    { type: "kickedButReformed", label: "Kicked but Reformed", code: "04", css: { backgroundColor: "#00ce16", border: "3px solid #ff7800" } },
    { type: "uncategorized", label: "Uncategorized", code: "05", css: { backgroundColor: "#000000" } },
    { type: "concern", label: "Concern", code: "06", css: { backgroundColor: "#c37c7c" } }, // ffaaaa
    { type: "kicked", label: "Kicked", code: "07", css: { backgroundColor: "#ff7800" } },
    { type: "unbanned", label: "Unbanned", code: "08", css: { backgroundColor: "#00ce16", border: "3px dashed #ff0000" } },
    { type: "banned", label: "Banned", code: "09", css: { backgroundColor: "#ff0000" } }
  ];

  async componentDidMount() {

    this.focusElement("steamId", 1000);
    const data = await getCassandraPlayers();

    // console.log(data);
    this.setState({ data });
  }

  focusElement = (elementId, ms) => {
    const elementToFocus = document.getElementById(elementId);
    setTimeout(() => {
      elementToFocus.focus();
    }, ms);
  }

  resetForm = () => {
    // e.preventDefault();
    // console.log("Form resetted!");
    const newEntry = {
      steamId: "",
      comments: "",
      classification: this.defaultClassificationCode,
      fullBan: false,
      alias: "",
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
    }

    this.setState({ newEntry });
  }

  autoInputSampleEntry = (e) => {
    e.preventDefault();

    const newEntry = {
      steamId: "76561111111111111",
      comments: "Doesn't communicate and constantly breaks the tap rule even after warnings.",
      classification: "09",
      fullBan: false,
      alias: "Alias_One, Alias_Two",
      kickDate: "1111-11-11",
      kickedServers: "1",
      autoKick: false,
      kickReasonCode: "tap",
      kickReason: "Constantly tapping objective after warnings.",
      kickSid: "11111111-1111-1111-1111-111111111111",
      kickSidTimestamp: "11:1",
      banDate: "1111-11-11",
      bannedServers: "2",
      banReasonCode: "tk",
      banReason: "Intentional team killing.",
      banSid: "22222222-2222-2222-2222-222222222222",
      banSidTimestamp: "22:22"
    }

    this.setState({ newEntry });
  }

  schema = {
    _id: Joi.string().min(1).max(50),
    steamId: Joi.string().min(17).max(17).required().label("Steam ID"),
    comments: Joi.string().max(350).allow("").label("Comments"),
    classification: Joi.string().max(20).allow("").label("Classification"),
    alias: Joi.string().min(1).max(350).allow("").label("Alias"),
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

    // console.log("Cancel button pressed.");
  }

  mapViewToModel = (newEntry) => {
    newEntry.alias = newEntry.alias.trim().toLowerCase();
    const alias = (newEntry.alias.includes(","))
      ? newEntry.alias.split(",")
      : [newEntry.alias];

    // const kicks = [];
    // const kick = {
    //   kickDate: newEntry.kickDate,
    //   kickedServers: newEntry.kickedServers,
    //   autoKick: newEntry.autoKick,
    //   kickReasonCode: newEntry.kickReasonCode,
    //   kickReason: newEntry.kickReason,
    //   kickSid: newEntry.kickSid,
    //   kickSidTimestamp: newEntry.kickSidTimestamp
    // }
    // kicks.push(kick);

    // const bans = [];
    // const ban = {
    //   banDate: newEntry.banDate,
    //   bannedServers: newEntry.bannedServers,
    //   banReasonCode: newEntry.banReasonCode,
    //   banReason: newEntry.banReason,
    //   banSid: newEntry.banSid,
    //   banSidTimestamp: newEntry.banSidTimestamp
    // }
    // bans.push(ban);

    return ({
      steamId: newEntry.steamId,
      comments: newEntry.comments,
      classification: newEntry.classification,
      fullBan: newEntry.fullBan,
      alias: alias,
      kicks: newEntry.kicks,
      bans: newEntry.bans
    });
  }

  handleDelete = async (steamId) => {
    try {
      if (window.confirm("Are you sure?")) {
        // console.log(steamId);
        await deleteCassandraPlayer(steamId);

        const data = this.state.data.filter(c => c.steamId !== steamId);
        this.setState({ data });
        this.props.history.push("/cassandraplayers");
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
      const response = await createCassandraPlayer(newEntry);

      const data = await getCassandraPlayers();
      this.setState({ data });
      this.resetForm();
      this.focusElement("steamId", 1000);






      // console.log("Save button pressed.");
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

        <select name="classification" size="11" onChange={this.handleChange} value={this.state.newEntry.classification} style={{ padding: "10px" }}>
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
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // console.log("Enter key pressed!");
      this.handleSave(e);
    }
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
        <div className="col-md-12">
          <form onSubmit={this.handleSave}>
            <div className="pb-4">
              {/* {this.renderButton("Cancel", "btn-sm btn-secondary mr-2", this.handleCancel)} */}
              {this.renderButton("Save", "btn-sm btn-success ml-2 mr-2")}
              {this.renderButton("Auto-Input Data", "btn-sm btn-secondary ml-2 mr-2", this.autoInputSampleEntry)}
              {this.renderButton("Reset Form", "btn-sm btn-secondary ml-2 mr-2", this.resetForm)}
            </div>
            {this.renderInput("steamId", "Steam ID", steamId, this.handleChange, "text", errors, false, true, this.handleKeyPress)}
            {this.renderInput("alias", "Alias", alias, this.handleChange, "text", errors, false, false, this.handleKeyPress)}
            {this.renderCheckbox("fullBan", "Full Ban", fullBan, this.handleChange)}
            {this.renderInput("comments", "Comments", comments, this.handleChange, "text", errors)}
            {this.renderDropdown()}
            {/* <h1>Kick</h1>
            {this.renderInput("kickDate", "Kick Date", kickDate, this.handleChange, "text", errors)}
            {this.renderInput("kickedServers", "Kicked Servers", kickedServers, this.handleChange, "text", errors)}
            {this.renderCheckbox("autoKick", "Auto-kick", autoKick, this.handleChange)}
            {this.renderInput("kickReasonCode", "Kick Reason Code", kickReasonCode, this.handleChange, "text", errors)}
            {this.renderInput("kickReason", "Kick Reason", kickReason, this.handleChange, "text", errors)}
            {this.renderInput("kickSid", "Kick SID", kickSid, this.handleChange, "text", errors)}
            {this.renderInput("kickSidTimestamp", "Kick SID Timestamp", kickSidTimestamp, this.handleChange, "text", errors)}

            <h1>Ban</h1>
            {this.renderInput("banDate", "Ban Date", banDate, this.handleChange, "text", errors)}
            {this.renderInput("bannedServers", "Banned Servers", bannedServers, this.handleChange, "text", errors)}
            {this.renderInput("banReasonCode", "Ban Reason Code", banReasonCode, this.handleChange, "text", errors)}
            {this.renderInput("banReason", "Ban Reason", banReason, this.handleChange, "text", errors)}
            {this.renderInput("banSid", "Ban SID", banSid, this.handleChange, "text", errors)}
            {this.renderInput("banSidTimestamp", "Ban SID Timestamp", banSidTimestamp, this.handleChange, "text", errors)} */}
          </form>
        </div>
      </div>
    );
  }

  handleSearch = async ({ currentTarget: input }) => {
    this.setState({ search: input.value });

    if (input.value.length >= 1) {
      const filteredData = this.state.data.filter(c => (c.steamId.includes(input.value)) || (c.alias.find(a => a.includes(input.value))));
      this.setState({ filteredData });
    }
  }

  handleEdit = async ({ currentTarget: input }, steamId) => {
    // console.log("Edit button pressed.");
    this.props.history.push("/cassandraplayers" + "/" + steamId);
  }

  render() {
    const pageTitle = { title: "Cassandra Players", subtitle: "An admin tool for Cassandra Confluvium servers" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };
    const classifications = this.classifications;
    const { data, filteredData, search, errors } = this.state;

    let players = data;
    if (search) {
      players = filteredData;
    } else {
      players = data;
    }
    // players = players.filter(p => (p.classification !== "00") && (p.classification !== "01"));
    // players = players.filter(p => p.classification === "03"); // Regular
    // players = players.filter(p => p.classification === "06"); // Concern
    players = players.slice(players.length - 3); // last 3 added

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">
                {this.renderInput("search", "Search", this.state.search, (e) => this.handleSearch(e), "text", errors)}
                <div className="pb-2">Found <span className="font-weight-bold">{players.length}</span> player(s)</div>
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Edit</th>
                      <th scope="col">Steam ID</th>
                      <th scope="col">Alias</th>
                      <th scope="col">Classification</th>
                      {/* <th scope="col">Comments</th> */}
                      <th scope="col">Full Ban</th>
                      <th scope="col">Kicks</th>
                      <th scope="col">Bans</th>
                    </tr>
                  </thead>

                  <tbody>
                    {players.map((player, index) => {
                      let fullBanClass = "badge badge-pill";
                      fullBanClass += (player.fullBan) ? " badge-secondary" : " badge-secondary";

                      const steamId = player.steamId;

                      let classificationLabel = "";
                      let classificationId = player.classification;
                      let classificationCss = {};

                      if (player.classification !== "") {
                        let classification = classifications.filter((c) => { return c.code === player.classification })[0];
                        if (classification) {
                          classificationLabel = classification.label;
                          classificationCss = classification.css;
                        } else {
                          console.log("Classification Error");
                        }
                      }

                      return (
                        <tr key={index}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <form onSubmit={(e) => e.preventDefault()}>
                              {this.renderButton("Edit", "btn-sm btn-secondary mr-1", (e) => this.handleEdit(e, steamId))}
                              <Link to={"/cassandraplayers/" + player.steamId + "/kick/new"}>
                                {this.renderButton("+K", "btn-sm btn-secondary mr-1")}
                              </Link>
                              <Link to={"/cassandraplayers/" + player.steamId + "/ban/new"}>
                                {this.renderButton("+B", "btn-sm btn-secondary mr-1")}
                              </Link>
                              {this.renderButton("X", "btn-sm btn-secondary mr-2", () => this.handleDelete(steamId))}
                              <a target="_blank" rel="noopener noreferrer" href={"https://steamcommunity.com/profiles/" + steamId}>
                                <i className="fa fa-steam-square" aria-hidden="true"></i>
                              </a>
                            </form>
                          </td>
                          <td style={{ wordBreak: "break-all" }}>{player.steamId}</td>
                          <td>{player.alias.map((name, index) => {
                            return (
                              <div key={index} className="badge badge-pill badge-secondary mr-1" style={classificationCss}>{name}</div>
                            )
                          })}
                          </td>
                          <td><span className="badge badge-pill badge-secondary">{classificationLabel}</span></td>
                          {/* <td>{player.comments}</td> */}
                          <td>{player.fullBan && (<span className={fullBanClass}>{player.fullBan.toString()}</span>)}</td>
                          <td>
                            {player.kicks.map((kick, index, arrayObj) => {
                              // console.log(steamId + ": " + kick.kickReasonCode);
                              if (kick && kick.kickReasonCode === "") kick.kickReasonCode = "n/a";

                              return (
                                <div key={index}>
                                  {/* <div className="badge badge-pill badge-secondary mr-1">{index + 1}</div> */}
                                  <Link to={"/cassandraplayers/" + player.steamId + "/kick/" + index}>
                                    {/* <div className="badge badge-pill badge-warning mr-1">Edit</div> */}
                                    <div className="badge badge-pill badge-secondary mr-1">{kick.kickReasonCode}</div>
                                  </Link>
                                  {/* <div className="badge badge-pill badge-secondary mr-1">{kick.kickedServers}</div> */}
                                  {/* <div className="badge badge-pill badge-secondary mr-1">{kick.kickDate}</div> */}
                                  {/* <div className="badge badge-pill badge-secondary mr-1">{kick.autoKick.toString()}</div> */}
                                  {/* <div className="badge badge-pill badge-secondary mr-1">{kick.kickReasonCode}</div> */}
                                  {/* <div className="badge badge-pill badge-secondary">{kick.kickReason}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickSid}</div>
                                <div className="badge badge-pill badge-secondary">{kick.kickSidTimestamp}</div> */}
                                </div>
                              )
                            })}
                          </td>
                          <td>{player.bans.map((ban, index, arrayObj) => {
                            return (
                              <div key={index}>
                                {/* <div className="badge badge-pill badge-secondary mr-1">{ban.bannedServers}</div> */}
                                {/* <div className="badge badge-pill badge-secondary mr-1">{ban.banDate}</div> */}
                                <Link to={"/cassandraplayers/" + player.steamId + "/ban/" + index}><div className="badge badge-pill badge-secondary mr-1">{ban.banReasonCode}</div></Link>
                                {/* <div className="badge badge-pill badge-secondary">{ban.banReason}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banSid}</div>
                                <div className="badge badge-pill badge-secondary">{ban.banSidTimestamp}</div> */}
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
                <hr className="mt-5 mb-5" />
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