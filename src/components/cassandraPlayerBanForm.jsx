import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Joi from 'joi-browser';
import Banner from './banner';
import _ from "lodash";

class CassandraPlayerKickForm extends Form {
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
    insertNewKick: false,
    newBan: {
      banDate: "",
      bannedServers: "",
      autoBan: false,
      banReasonCode: "",
      banReason: "",
      banSid: "",
      banSidTimestamp: ""
    },
    formState: "",
    pageTitle: { title: "", subtitle: "" },
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
      this.setFormState();
      let data = await getCassandraPlayer(this.props.match.params.steamId);
      data.alias = data.alias.join();
      // console.log(data);
      this.setState({ data });
      this.renderBannerTitle();
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  renderBannerTitle() {
    const subtitle = this.state.data.alias.split(",").map((name, index, arrayObj) => {
      return (
        <span key={index} className="badge badge-pill badge-secondary mr-1">{name}</span>
      )
    });
    let pageTitle = { title: "Edit Ban", subtitle };
    const index = this.props.match.params.index;
    if (index === "new") {
      pageTitle.title = "Create a new ban violation";
      pageTitle.subtitle = null;
    }

    this.setState({ pageTitle });




    // const title = (formState !== "create") ? "Edit" : "Create";
    // const pageTitle = { title, subtitle };
  }

  setFormState() {
    let formState = "edit";

    const index = this.props.match.params.index;
    if (index === "new") formState = "create";

    return this.setState({ formState });
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    // const errorMsg = this.validateProperty(input);
    // obj.errors[input.name] = errorMsg;
    obj.data[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState(obj);
  }

  handleDelete = async e => {
    e.preventDefault();
    console.log("Delete button pressed.");

    const obj = this.mapViewToModel(this.state.data);
    const { index } = this.props.match.params;
    let { bans } = obj;

    if (index > -1 && index < bans.length) {
      bans.splice(index, 1);
    } else {
      console.log("Failed to delete an item from array: Out of bounds.");
    }
    const cassandraPlayer = await patchCassandraPlayer(obj);


    this.props.history.push("/cassandraplayers/" + this.state.data.steamId);
  }

  handleCancel = e => {
    e.preventDefault();

    console.log("Cancel button pressed.");
    this.props.history.push("/cassandraplayers/" + this.state.data.steamId);
  }

  handleMain = e => {
    e.preventDefault();

    // console.log("Cancel button pressed.");
    this.props.history.push("/cassandraplayers");
  }

  handleSave = e => {
    e.preventDefault();

    this.doSave();
  }

  mapViewToModel = (data) => {
    const alias = (data.alias.includes(","))
      ? data.alias.split(",")
      : [data.alias];
    // console.log(_.isEmpty(this.state.newKick));
    if (Object.values(this.state.newBan).filter(value => (value !== "") && (value !== false)).length > 0) {
      data.bans.push(this.state.newBan);
    }


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

      // console.log(this.state.data);
      // return;
      // Works
      const obj = this.mapViewToModel(this.state.data);
      // console.log(obj);
      const cassandraPlayer = await patchCassandraPlayer(obj);
      // this.setState({ data: cassandraPlayer });
      // console.log(cassandraPlayer.data);
      // console.log(this.state.data.kicks.length);
      this.props.history.push("/cassandraplayers/" + this.state.data.steamId);
    } catch (ex) {
      if (ex.response) {
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
    const { errors, newBan, insertNewKick, formState } = this.state;
    // console.log(this.props.match.params.index);
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    let fullBanClass = "badge badge-pill";
    fullBanClass += (fullBan) ? " badge-danger" : " badge-secondary";

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
    const { index } = this.props.match.params;
    // console.log(kicks[0] && kicks[0].kickDate);
    // console.log(formState);

    return (
      <React.Fragment>
        <Banner info={this.state.pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">
                {this.renderButton("Back to main", "btn-sm btn-secondary ml-2 mr-2", this.handleMain)}
                {this.renderButton("Cancel", "btn-sm btn-secondary ml-2 mr-2", this.handleCancel)}
                {formState === "edit" && this.renderButton("Delete", "btn-sm btn-danger ml-2 mr-2", this.handleDelete)}
                {this.renderButton("Save", "btn-sm btn-success ml-2 mr-2", this.handleSave)}
                <form onSubmit={this.handleSave}>
                  {formState !== "create" && bans[index] && <React.Fragment>
                    {this.renderInput("banDate", "Ban Date", bans[index].banDate, (e) => this.handleKickChange(e, index), "text", errors)}
                    {this.renderInput("bannedServers", "Banned Servers", bans[index].bannedServers, (e) => this.handleKickChange(e, index), "text", errors)}
                    {this.renderInput("banReasonCode", "Ban Reason Code", bans[index].banReasonCode, (e) => this.handleKickChange(e, index), "text", errors)}
                    {this.renderInput("banReason", "Ban Reason", bans[index].banReason, (e) => this.handleKickChange(e, index), "text", errors)}
                    {this.renderInput("banSid", "Ban SID", bans[index].banSid, (e) => this.handleKickChange(e, index), "text", errors)}
                    {this.renderInput("banSidTimestamp", "Ban SID Timestamp", bans[index].banSidTimestamp, (e) => this.handleKickChange(e, index), "text", errors)}
                  </React.Fragment>}
                  {formState === "create" && <React.Fragment>
                    {this.renderInput("banDate", "Ban Date", newBan.kickDate, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("bannedServers", "Banned Servers", newBan.kickedServers, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("banReasonCode", "Ban Reason Code", newBan.kickReasonCode, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("banReason", "Ban Reason", newBan.kickReason, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("banSid", "Ban SID", newBan.kickSid, this.handleNewKickChange, "text", errors)}
                    {this.renderInput("banSidTimestamp", "Ban SID Timestamp", newBan.kickSidTimestamp, this.handleNewKickChange, "text", errors)}
                  </React.Fragment>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }

  handleNewKickChange2 = ({ currentTarget: input }) => {
    let insertNewKick = this.state.insertNewKick;
    insertNewKick = !insertNewKick;

    this.setState({ insertNewKick });
  }

  handleNewKickChange = ({ currentTarget: input }) => {
    let obj = { ...this.state.newBan };
    // console.log(data.kicks[index]);
    obj[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState({ newBan: obj });
  }

  handleKickChange = ({ currentTarget: input }, index) => {
    let data = { ...this.state.data };
    // console.log(data.kicks[index]);
    data.bans[index][input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState({ data });
  }
}

export default CassandraPlayerKickForm;