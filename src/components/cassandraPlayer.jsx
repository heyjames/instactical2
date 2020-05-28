import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Joi from 'joi-browser';
import Banner from './banner';
import _ from "lodash";
import DescriptionList from './common/descriptionList';

class CassandraPlayer extends Form {
  state = {
    data: {
      _id: "",
      steamId: "",
      comments: "",
      fullBan: "",
      classification: "",
      kicks: [],
      bans: [],
      alias: ""
    },
    oldData: {
      _id: "",
      steamId: "",
      comments: "",
      fullBan: "",
      classification: "",
      kicks: [],
      bans: [],
      alias: ""
    },
    insertNewKick: false,
    newKick: {},
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

  schema = {
    _id: Joi.string().min(1).max(50),
    steamId: Joi.string().min(17).max(17).required().label("Steam ID"),
    comments: Joi.string().max(350).allow("").label("Comments"),
    classification: Joi.string().max(20).allow("").label("Classification"),
    alias: Joi.string().min(1).max(350).label("Alias"),
    fullBan: Joi.boolean().label("Full Ban")
  }

  async componentDidMount() {
    // console.log(this.props.match);
    try {
      let data = await getCassandraPlayer(this.props.match.params.steamId);
      data.alias = data.alias.join();
      // console.log(data);
      this.setState({ data });
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    // const errorMsg = this.validateProperty(input);
    // obj.errors[input.name] = errorMsg;
    obj.data[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState(obj);
  }

  handleCancel = e => {
    e.preventDefault();

    console.log("Cancel button pressed.");
    this.props.history.push("/cassandraplayers");
  }

  handleSave = e => {
    e.preventDefault();

    this.doSave();
  }

  mapViewToModel = (data) => {
    data.alias = data.alias.trim().toLowerCase();
    // if (data.alias.includes(",")) {
    //   let alias = data.alias.split(",");
    // } else {
    //   let alias = [data.alias];
    // }
    const alias = (data.alias.includes(","))
      ? data.alias.split(",")
      : [data.alias];

    return ({
      _id: data._id,
      steamId: data.steamId,
      comments: data.comments,
      classification: data.classification,
      fullBan: data.fullBan,
      alias: alias,
      kicks: data.kicks,
      bans: data.bans
    });
  }

  // Patch
  doSave = async () => {
    try {
      // const { data } = this.state;
      // const newEntry = this.mapViewToModel(this.state.newEntry);
      // const response = await createCassandraPlayer(newEntry);
      // console.log("hey");
      // console.log(cassandraPlayer);
      // this.setState({ data });

      // console.log(this.state.newKick);
      // return;
      // Works
      const obj = this.mapViewToModel(this.state.data);
      // console.log(obj);
      const cassandraPlayer = await patchCassandraPlayer(obj);
      // this.setState({ data: cassandraPlayer });
      this.props.history.replace("/cassandraplayers");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  // doSave = async () => {
  //   try {
  //     // const { data } = this.state;
  //     const obj = { ...this.state.data };
  //     console.log(obj);
  //     // const newEntry = this.mapViewToModel(this.state.newEntry);
  //     // const response = await createCassandraPlayer(newEntry);
  //     // console.log("hey");
  //     // const cassandraPlayer = await patchCassandraPlayer(obj);
  //     // console.log(cassandraPlayer);
  //     // this.setState({ data });

  //     console.log("Save button pressed.");
  //     // this.props.history.replace("/cassandraplayers" + "/" + cassandraPlayer.data.steamId);
  //   } catch (ex) {
  //     // if (ex.response && ex.response.status === 400) {
  //     if (ex.response) {
  //       const errors = { ...this.state.errors };
  //       errors.steamId = ex.response.data;
  //       this.setState({ errors });
  //     }
  //   }
  // }

  // mapViewToModel = (newEntry) => {
  //   const alias = (newEntry.alias.includes(","))
  //     ? newEntry.alias.split(",")
  //     : [newEntry.alias];

  //   const kicks = [];
  //   const kick = {
  //     kickDate: newEntry.kickDate,
  //     kickedServers: newEntry.kickedServers,
  //     autoKick: newEntry.autoKick,
  //     kickReasonCode: newEntry.kickReasonCode,
  //     kickReason: newEntry.kickReason,
  //     kickSid: newEntry.kickSid,
  //     kickSidTimestamp: newEntry.kickSidTimestamp
  //   }
  //   kicks.push(kick);

  //   const bans = [];
  //   const ban = {
  //     banDate: newEntry.banDate,
  //     bannedServers: newEntry.bannedServers,
  //     banReasonCode: newEntry.banReasonCode,
  //     banReason: newEntry.banReason,
  //     banSid: newEntry.banSid,
  //     banSidTimestamp: newEntry.banSidTimestamp
  //   }
  //   bans.push(ban);

  //   return ({
  //     steamId: newEntry.steamId,
  //     comments: newEntry.comments,
  //     classification: newEntry.classification,
  //     fullBan: newEntry.fullBan,
  //     alias: alias,
  //     kicks: kicks,
  //     bans: bans
  //   });
  // }

  renderDropdown = () => {
    const classifications = this.classifications;

    return (
      <div className="form-group">
        <div>
          <label>Classification</label>
        </div>

        <select name="classification" size="12" onChange={this.handleChange} value={this.state.data.classification}>
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

  render() {
    const pageTitle = { title: "Cassandra Player Details" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };
    const classifications = this.classifications;
    const {
      steamId,
      comments,
      fullBan,
      alias,
      kicks,
      classification,
      bans
    } = this.state.data;
    const { errors, newKick, insertNewKick } = this.state;

    let fullBanClass = "badge badge-pill";
    fullBanClass += (fullBan) ? " badge-secondary" : " badge-secondary";

    let classificationLabel = "";
    let classificationId = classification;

    if (classificationId !== "") {
      let classification2 = classifications.filter(c => { return c.code === classificationId })[0];
      if (classification2) {
        classificationLabel = classification2.label;
      } else {
        console.log("Classification Error");
      }
    }
    // console.log(insertNewKick);
    // console.log(alias);
    // alias = alias.split(",").map((name, index, arrayObj) => {
    //   return (
    //     <div key={index} className="badge badge-pill badge-secondary mr-1">{name}</div>
    //   )
    // });


    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">
                {this.renderButton("Cancel", "btn-sm btn-secondary ml-2 mr-2 mb-3", this.handleCancel)}
                {this.renderButton("Save", "btn-sm btn-success ml-2 mr-2 mb-3", this.handleSave)}
                <DescriptionList
                  items={{
                    "Steam ID": steamId,
                    "Alias": alias,
                    "Classification": classificationLabel,
                    "Comments": comments,
                    "Full Ban": fullBan.toString()
                  }}
                />
                <table className="table table-sm table-striped">
                  <thead className="table-warning">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">kickedServers</th>
                      <th scope="col">kickDate</th>
                      <th scope="col">autoKick</th>
                      <th scope="col">kickReasonCode</th>
                      <th scope="col">kickSid</th>
                      <th scope="col">kickSidTimestamp</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      {kicks.map((kick, index) => {
                        if (kick.kickReasonCode === "") kick.kickReasonCode = "n/a";
                        return (
                          <React.Fragment key={index}>
                            <td>
                              <Link to={"/cassandraplayers/" + steamId + "/kick/new"}>
                                <span className="badge badge-pill badge-success mr-1">+</span>
                              </Link>
                              <Link to={"/cassandraplayers/" + steamId + "/kick/" + index}>
                                Edit
                            </Link>
                            </td>
                            <td>{kick.kickedServers}</td>
                            <td>{kick.kickDate}</td>
                            <td>{kick.autoKick.toString()}</td>
                            <td>{kick.kickReasonCode}</td>
                            <td>{kick.kickSid}</td>
                            <td>{kick.kickSidTimestamp}</td>
                          </React.Fragment>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
                {/* <td>{steamId}</td>
                      <td></td>
                      <td><span className="badge badge-pill badge-secondary">{classificationLabel}</span></td>
                      <td>{comments}</td>
                      <td>{fullBan && (<span className={fullBanClass}>{fullBan.toString()}</span>)}</td> */}
                {/* <td>{kicks.map((kick, index, arrayObj) => {
                        if (kick.kickReasonCode === "") kick.kickReasonCode = "n/a";
                        return (
                          <div key={index}>
                            <Link to={"/cassandraplayers/" + steamId + "/kick/" + index}>
                              <div className="badge badge-pill badge-secondary mr-1">{kick.kickedServers}</div>
                            </Link>
                            <Link to={"/cassandraplayers/" + steamId + "/kick/" + index}>
                              <div className="badge badge-pill badge-secondary mr-1">{kick.kickDate}</div>
                            </Link>
                            <Link to={"/cassandraplayers/" + steamId + "/kick/" + index}>
                              {kick.autoKick && (<div className="badge badge-pill badge-secondary mr-1">{kick.autoKick.toString()}</div>)}
                            </Link>
                            <Link to={"/cassandraplayers/" + steamId + "/kick/" + index}>
                              <div className="badge badge-pill badge-secondary mr-1">{kick.kickReasonCode}</div>
                            </Link>
                            <div className="badge badge-pill badge-secondary mr-1">{kick.kickSid}</div>
                            <Link to={"/cassandraplayers/" + steamId + "/kick/" + index}>
                              <div className="badge badge-pill badge-secondary mr-1">{kick.kickSidTimestamp}</div>
                            </Link>
                          </div>
                        )
                      })}
                        <Link to={"/cassandraplayers/" + steamId + "/kick/new"}>
                          <span className="badge badge-pill badge-success mr-1">+</span>
                        </Link>
                      </td> */}
                {/* <td>{bans.map((ban, index, arrayObj) => {
                        if (ban.banReasonCode === "") ban.banReasonCode = "n/a";
                        return (
                          <div key={index}>
                            <Link to={"/cassandraplayers/" + steamId + "/ban/" + index}><div className="badge badge-pill badge-secondary mr-1">{ban.bannedServers}</div></Link>
                            <Link to={"/cassandraplayers/" + steamId + "/ban/" + index}><div className="badge badge-pill badge-secondary mr-1">{ban.banDate}</div></Link>
                            <Link to={"/cassandraplayers/" + steamId + "/ban/" + index}><div className="badge badge-pill badge-secondary mr-1">{ban.banReasonCode}</div></Link>
                            <div className="badge badge-pill badge-secondary mr-1">{ban.banSid}</div>
                            <Link to={"/cassandraplayers/" + steamId + "/ban/" + index}><div className="badge badge-pill badge-secondary mr-1">{ban.banSidTimestamp}</div></Link>
                          </div>
                        )
                      })}
                        <Link to={"/cassandraplayers/" + steamId + "/ban/new"}>
                          <span className="badge badge-pill badge-success mr-1">+</span>
                        </Link>
                      </td>
                    </tr> */}

                <table className="table table-sm table-striped">
                  <thead className="table-danger">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Ban Servers</th>
                      <th scope="col">Ban Date</th>
                      <th scope="col">Ban ReasonCode</th>
                      <th scope="col">Ban Sid</th>
                      <th scope="col">Ban SidTimestamp</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <Link to={"/cassandraplayers/" + steamId + "/ban/new"}>
                          <span className="badge badge-pill badge-success mr-1">+</span>
                        </Link>
                      </td>
                      {bans.map((ban, index, arrayObj) => {
                        if (ban.banReasonCode === "") ban.banReasonCode = "n/a";
                        return (
                          <React.Fragment key={index}>
                            <td>{ban.bannedServers}</td>
                            <td>{ban.banDate}</td>
                            <td>{ban.banReasonCode}</td>
                            <td>{ban.banSid}</td>
                            <td>{ban.banSidTimestamp}</td>
                          </React.Fragment>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
                <form onSubmit={this.handleSave}>
                  {this.renderInput("steamId", "Steam ID", steamId, this.handleChange, "text", errors)}
                  {this.renderInput("alias", "Alias", alias, this.handleChange, "text", errors)}
                  {this.renderDropdown()}
                  {this.renderInput("comments", "Comments", comments, this.handleChange, "text", errors)}
                  {this.renderCheckbox("fullBan", "Full Ban", fullBan, this.handleChange)}

                  {/* {kicks.map((k, index) => {
                    return (
                      <React.Fragment>
                        <hr className="mt-5 mb-5" />
                        {this.renderInput("kickDate", "Kick Date", k.kickDate, (e) => this.handleKickChange(e, index), "text", errors)}
                        {this.renderInput("kickedServers", "Kicked Servers", k.kickedServers, (e) => this.handleKickChange(e, index), "text", errors)}
                        {this.renderCheckbox("autoKick", "Auto-kick", k.autoKick, (e) => this.handleKickChange(e, index))}
                        {this.renderInput("kickReasonCode", "Kick Reason Code", k.kickReasonCode, (e) => this.handleKickChange(e, index), "text", errors)}
                        {this.renderInput("kickReason", "Kick Reason", k.kickReason, (e) => this.handleKickChange(e, index), "text", errors)}
                        {this.renderInput("kickSid", "Kick SID", k.kickSid, (e) => this.handleKickChange(e, index), "text", errors)}
                        {this.renderInput("kickSidTimestamp", "Kick SID Timestamp", k.kickSidTimestamp, (e) => this.handleKickChange(e, index), "text", errors)}
                      </React.Fragment>
                    )
                  })}
                  <hr className="mt-5 mb-5" />
                  <div>insertNewKick: {insertNewKick.toString()}</div>
                  {this.renderCheckbox("insertNewKick", "Insert New Kick?", insertNewKick, this.handleNewKickChange2)}
                  {insertNewKick && <React.Fragment>
                    {this.renderInput("newKickDate", "Kick Date", newKick.kickDate, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("newKickedServers", "Kicked Servers", newKick.kickedServers, this.handleNewKickChange, "text", errors)}
                    {this.renderCheckbox("newAutoKick", "Auto-kick", newKick.autoKick, this.handleNewKickChange)}
                    {this.renderInput("newKickReasonCode", "Kick Reason Code", newKick.kickReasonCode, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("newKickReason", "Kick Reason", newKick.kickReason, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("newKickSid", "Kick SID", newKick.kickSid, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("newKickSidTimestamp", "Kick SID Timestamp", newKick.kickSidTimestamp, this.handleNewKickChange, "text", errors)}
                  </React.Fragment>
                  } */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleNewKickChange2 = ({ currentTarget: input }) => {
    let insertNewKick = this.state.insertNewKick;
    insertNewKick = !insertNewKick;

    this.setState({ insertNewKick });
  }

  handleNewKickChange = ({ currentTarget: input }) => {
    let obj = { ...this.state.newKick };
    // console.log(data.kicks[index]);
    obj[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState({ newKick: obj });
  }

  handleKickChange = ({ currentTarget: input }, index) => {
    let data = { ...this.state.data };
    // console.log(data.kicks[index]);
    data.kicks[index][input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState({ data });
  }
}

export default CassandraPlayer;