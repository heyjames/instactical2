import React from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
import Banner from './banner';
import _ from "lodash";
import PlayerProfileUtils from './playerProfileUtils';
import Container from './common/container';
import Row from './common/row';
import { onKeyPress } from './common/utils';

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

  async componentDidMount() {
    const { steamId } = this.props.match.params;

    try {
      this.setFormState();
      
      let data = await getCassandraPlayer(steamId);
      data.alias = data.alias.join();
      
      this.setState({ data });
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
    const { index } = this.props.match.params;

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

  handleDelete = async () => {
    const { data } = this.state;
    const { index } = this.props.match.params;
    const obj = this.mapViewToModel(data);
    let { bans } = obj;

    if (index > -1 && index < bans.length) {
      bans.splice(index, 1);
    } else {
      console.log("Failed to delete an item from array: Out of bounds.");
    }
    await patchCassandraPlayer(obj);

    this.props.history.push("/cassandraplayers/" + data.steamId);
  }

  handleSave = async () => {
    const { data } = this.state;
    
    try {
      const obj = this.mapViewToModel({ ...this.state.data });
      await patchCassandraPlayer(obj);

      this.props.history.push("/cassandraplayers/" + data.steamId);
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  mapViewToModel = data => {
    const { newBan } = this.state;
    const alias = (data.alias.includes(","))
      ? data.alias.split(",")
      : [data.alias];
      
    if (Object.values(newBan).filter(value => (value !== "") && (value !== false)).length > 0) {
      data.bans.push(newBan);
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

  handleNewKickChange = ({ currentTarget: input }) => {
    let obj = { ...this.state.newBan };
    obj[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState({ newBan: obj });
  }

  handleKickChange = ({ currentTarget: input }, index) => {
    let data = { ...this.state.data };
    data.bans[index][input.name] = (input.type === "checkbox") ? input.checked : input.value;

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
    
    let pageTitle = { title: "Edit Ban", subtitle };

    if (index === "new") {
      pageTitle.title = "Create a new ban violation";
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
    const { bans } = this.state.data;
    const { errors, newBan, formState } = this.state;
    const { index } = this.props.match.params;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const bannerInfo = this.createBannerInfo();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <Row>
            {this.renderButtons()}
            {formState !== "create" && bans[index] && <div>
              {this.renderInput("banDate", "Ban Date", bans[index].banDate, (e) => this.handleKickChange(e, index), "text", errors, false, true, (e) => onKeyPress(e, 13, this.handleSave))}
              {this.renderInput("bannedServers", "Banned Servers", bans[index].bannedServers, (e) => this.handleKickChange(e, index), "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
              {this.renderInput("banReasonCode", "Ban Reason Code", bans[index].banReasonCode, (e) => this.handleKickChange(e, index), "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
            </div>}

            {formState === "create" && <div>
              {this.renderInput("banDate", "Ban Date", newBan.kickDate, this.handleNewKickChange, "text", errors, false, true, (e) => onKeyPress(e, 13, this.handleSave))}
              {this.renderInput("bannedServers", "Banned Servers", newBan.kickedServers, this.handleNewKickChange, "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
              {this.renderInput("banReasonCode", "Ban Reason Code", newBan.kickReasonCode, this.handleNewKickChange, "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
            </div>}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default CassandraPlayerKickForm;