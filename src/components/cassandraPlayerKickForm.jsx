import React from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Joi from 'joi-browser';
import Banner from './banner';
import _ from "lodash";
import PlayerProfileUtils from './playerProfileUtils';
import Container from './common/container';
import Row from './common/row';
// import { HashLink } from 'react-router-hash-link';

class CassandraPlayerKickForm extends PlayerProfileUtils {
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
    newKick: {
      kickDate: "",
      kickedServers: "",
      autoKick: false,
      kickReasonCode: "",
      kickReason: "",
      kickSid: "",
      kickSidTimestamp: ""
    },
    formState: "",
    pageTitle: { title: "", subtitle: "" },
    errors: {}
  };

  async componentDidMount() {
    // console.log(this.props.match);
    try {
      let data = await getCassandraPlayer(this.props.match.params.steamId);
      data.alias = data.alias.join();
      // console.log(data);
      this.setState({ data });
      this.setFormState();
      this.initializeBannerTitle();
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
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

  // Does this splice really work? Try doing it to the second one (index = 1) when there are three.
  handleDelete = async e => {
    e.preventDefault();
    console.log("Delete button pressed.");

    const obj = this.mapViewToModel(this.state.data);
    const { index } = this.props.match.params;
    let { kicks } = obj;

    if (index > -1 && index < kicks.length) {
      kicks.splice(index, 1);
    } else {
      console.log("Failed to delete an item from array: Out of bounds.");
    }
    const cassandraPlayer = await patchCassandraPlayer(obj);

    this.props.history.push("/cassandraplayers/" + this.state.data.steamId);
  }

  handleCancel = e => {
    e.preventDefault();

    console.log("Cancel button pressed.");
    this.props.history.push("/cassandraplayers/" + this.state.data.steamId + "#info");
  }

  handleSave = e => {
    e.preventDefault();

    console.log("Save button pressed.");
    this.doSave();
  }

  mapViewToModel = (data) => {
    const alias = (data.alias.includes(","))
      ? data.alias.split(",")
      : [data.alias];
    // console.log(_.isEmpty(this.state.newKick));
    if (Object.values(this.state.newKick).filter(value => (value !== "") && (value !== false)).length > 0) {
      data.kicks.push(this.state.newKick);
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

  createBannerInfo = () => {
    const subtitle = this.state.data.alias;
    const index = this.props.match.params.index;
    
    let pageTitle = { title: "Edit Kick", subtitle };

    if (index === "new") {
      pageTitle.title = "Create a new kick violation";
      pageTitle.subtitle = subtitle;
    }

    return {
      title: pageTitle.title,
      subtitle: pageTitle.subtitle
    };
  }

  renderButtons = () => {
    return (
      <React.Fragment>
        <Link to={"/cassandraplayers/" + this.state.data.steamId}>
          {this.renderButton("Back", "btn-sm btn-secondary mr-2 mb-3")}
        </Link>
    
        {this.state.formState === "edit" && this.renderButton("Delete", "btn-sm btn-danger mr-2 mb-3", this.handleDelete)}
    
        {this.renderButton("Save", "btn-sm btn-success mb-3", this.handleSave)}
      </React.Fragment>
    );
  }

  render() {
    const { kicks } = this.state.data;
    const { errors, newKick, formState } = this.state;
    const { index } = this.props.match.params;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const bannerInfo = this.createBannerInfo();
    
    // console.log(this.props.match.params.index);
    // console.log(kicks[0] && kicks[0].kickDate);
    // console.log(formState);
    
    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <Row>
            {this.renderButtons()}
            {formState !== "create" && kicks[index] && <div className="form-group">
              {this.renderInput("kickDate", "Kick Date", kicks[index].kickDate, (e) => this.handleKickChange(e, index), "text", errors)}
              {this.renderInput("kickedServers", "Kicked Servers", kicks[index].kickedServers, (e) => this.handleKickChange(e, index), "text", errors)}
              {this.renderCheckbox("autoKick", "Auto-kick", kicks[index].autoKick, (e) => this.handleKickChange(e, index))}
              {this.renderInput("kickReasonCode", "Kick Reason Code", kicks[index].kickReasonCode, (e) => this.handleKickChange(e, index), "text", errors)}
              {/* {this.renderInput("kickReason", "Kick Reason", kicks[index].kickReason, (e) => this.handleKickChange(e, index), "text", errors)} */}
              {this.renderInput("kickSid", "Kick SID", kicks[index].kickSid, (e) => this.handleKickChange(e, index), "text", errors)}
              {this.renderInput("kickSidTimestamp", "Kick SID Timestamp", kicks[index].kickSidTimestamp, (e) => this.handleKickChange(e, index), "text", errors)}
            </div>}

            {formState === "create" && <div className="form-group">
              {this.renderInput("kickDate", "Kick Date", newKick.kickDate, this.handleNewKickChange, "text", errors)}
              {this.renderInput("kickedServers", "Kicked Servers", newKick.kickedServers, this.handleNewKickChange, "text", errors)}
              {this.renderCheckbox("autoKick", "Auto-kick", newKick.autoKick, this.handleNewKickChange)}
              {this.renderInput("kickReasonCode", "Kick Reason Code", newKick.kickReasonCode, this.handleNewKickChange, "text", errors)}
              {/* {this.renderInput("kickReason", "Kick Reason", newKick.kickReason, this.handleNewKickChange, "text", errors)} */}
              {this.renderInput("kickSid", "Kick SID", newKick.kickSid, this.handleNewKickChange, "text", errors)}
              {this.renderInput("kickSidTimestamp", "Kick SID Timestamp", newKick.kickSidTimestamp, this.handleNewKickChange, "text", errors)}
            </div>}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default CassandraPlayerKickForm;