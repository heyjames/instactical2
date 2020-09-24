import React from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
import Banner from './banner';
import _ from "lodash";
import PlayerProfileUtils from './playerProfileUtils';
import Container from './common/container';
import Row from './common/row';
import { onKeyPress } from './common/utils';
import { pause } from './common/utils';
import LoadingWrapper from './common/loadingWrapper';

class CassandraPlayerKickForm extends PlayerProfileUtils {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
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
  
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    const { steamId } = this.props.match.params;

    try {
      this.setFormState();

      // await pause(0.8);
      let data = await getCassandraPlayer(steamId);
      data.alias = data.alias.join();
      const loading = false;

      if (this._isMounted) {
        this.setState({ data, loading });
      }
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        if (this._isMounted) {
          this.setState({ errors });
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setFormState() {
    let formState = "edit";
    const { index } = this.props.match.params;

    if (index === "new") formState = "create";

    if (this._isMounted) {
      return this.setState({ formState });
    }
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
    const obj = this.mapViewToModel(data);
    const { index } = this.props.match.params;
    let { kicks } = obj;

    if (index > -1 && index < kicks.length) {
      kicks.splice(index, 1);
    } else {
      console.log("Failed to delete an item from array: Out of bounds.");
    }
    
    try {
      this.props.history.push("/cassandraplayers/" + data.steamId);
      await patchCassandraPlayer(obj);
    } catch (ex) {
      if (ex.response.status === 403) {
        this.props.history.replace("/unauthorized");
      }

      this.props.history.replace("/unauthorized");
    }
  }

  handleSave = async () => {
    const { data } = this.state;
    try {
      const obj = this.mapViewToModel({ ...this.state.data });
      await patchCassandraPlayer(obj);
      
      this.props.history.push("/cassandraplayers/" + data.steamId);
    } catch (ex) {
      if (ex.response.status === 403) {
        this.props.history.replace("/unauthorized");
      }

      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  mapViewToModel = data => {
    const { newKick, formState } = this.state;
    let { index } = this.props.match.params;
    index = parseInt(index);
    let obj = {};

    const alias = (data.alias.includes(","))
      ? data.alias.split(",")
      : [data.alias];
    
    if (Object.values(newKick).filter(value => (value !== "") && (value !== false)).length > 0) {
      data.kicks.push(newKick);
    }

    if (formState === "edit") {
      obj.index = index;
    }

    obj._id = data._id;
    obj.steamId = data.steamId;
    obj.comments = data.comments;
    obj.classification = data.classification;
    obj.fullBan = data.fullBan;
    obj.alias = alias;
    obj.kicks = data.kicks;
    obj.bans = data.bans;

    return obj;
  }

  handleNewKickChange = ({ currentTarget: input }) => {
    const { newKick } = this.state;
    let obj = { ...this.state.newKick };

    if (input.type === "checkbox") {
      obj[input.name] = input.checked;

      if (newKick.kickReasonCode === "rush") obj.kickReasonCode = "";
      if (newKick.kickReasonCode === "") obj.kickReasonCode = "rush";
    } else {
      obj[input.name] = input.value;
    }

    this.setState({ newKick: obj });
  }

  handleKickChange = ({ currentTarget: input }, index) => {
    let data = { ...this.state.data };
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
    const { errors, newKick, formState, loading } = this.state;
    const { user } = this.props;
    const { index } = this.props.match.params;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const bannerInfo = this.createBannerInfo();
    
    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>
            <Row>
              {user && user.isAdmin && this.renderButtons()}
              {user && user.isAdmin && formState !== "create" && kicks[index] && <div className="form-group">
                {this.renderInput("kickDate", "Kick Date", kicks[index].kickDate, (e) => this.handleKickChange(e, index), "text", errors, false, true, (e) => onKeyPress(e, 13, this.handleSave))}
                {this.renderInput("kickedServers", "Kicked Servers", kicks[index].kickedServers, (e) => this.handleKickChange(e, index), "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
                {this.renderCheckbox("autoKick", "Auto-kick", kicks[index].autoKick, (e) => this.handleKickChange(e, index))}
                {this.renderInput("kickReasonCode", "Kick Reason Code", kicks[index].kickReasonCode, (e) => this.handleKickChange(e, index), "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
              </div>}

              {user && user.isAdmin && formState === "create" && <div className="form-group">
                {this.renderInput("kickDate", "Kick Date", newKick.kickDate, this.handleNewKickChange, "text", errors, false, true, (e) => onKeyPress(e, 13, this.handleSave))}
                {this.renderInput("kickedServers", "Kicked Servers", newKick.kickedServers, this.handleNewKickChange, "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
                {this.renderCheckbox("autoKick", "Auto-kick", newKick.autoKick, this.handleNewKickChange)}
                {this.renderInput("kickReasonCode", "Kick Reason Code", newKick.kickReasonCode, this.handleNewKickChange, "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave))}
              </div>}
            </Row>
          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default CassandraPlayerKickForm;