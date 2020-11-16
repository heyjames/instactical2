import React from 'react';
import { Link } from 'react-router-dom';
import { getPlayerProfile, patchPlayerProfile } from '../../services/playerProfileService';
import Banner from '../navigation/banner';
// import _ from 'lodash';
import PlayerProfileUtils from './playerProfileUtils';
import Container from '../common/container';
import Row from '../common/row';
import { onKeyPress } from '../../utils/utils';
// import { pause } from '../../utils/utils';
import LoadingWrapper from '../common/loadingWrapper';
import Joi from 'joi-browser';

class PlayerProfileKickForm extends PlayerProfileUtils {
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
        kickReasonCode: ""
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
      let data = await getPlayerProfile(steamId);
      data = this.mapToViewModel(data);
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

  validate = () => {
    const options = { abortEarly: false };

    const { error } = Joi.validate(this.state.newKick, this.schemaKicks, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schemaKicks[name] };
    const { error } = Joi.validate(obj, schema);

    return error && error.details[0].message;
  }

  handleNewKickChange = ({ currentTarget: input }) => {
    const { newKick } = this.state;
    let obj = { ...this.state.newKick };
    let errors = { ...this.state.errors };

    const errorMsg = this.validateProperty(input);
    errors[input.name] = errorMsg;

    if (input.type === "checkbox") {
      obj[input.name] = input.checked;

      obj.kickReasonCode = (newKick.kickReasonCode === "") ? "rush" : "";
    } else {
      obj[input.name] = input.value;
    }

    this.setState({ newKick: obj, errors });
  }

  handleKickChange = ({ currentTarget: input }, index) => {
    let data = { ...this.state.data };
    let errors = { ...this.state.errors };

    const errorMsg = this.validateProperty(input);
    errors[input.name] = errorMsg;

    data.kicks[index][input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState({ data, errors });
  }

  handleDelete = async () => {
    const { data } = this.state;
    const obj = this.mapToObjectModel(data);
    const { index } = this.props.match.params;
    let { kicks } = obj;

    if (index > -1 && index < kicks.length) {
      kicks.splice(index, 1);
    } else {
      console.log("Failed to delete an item from array: Out of bounds.");
    }
    
    try {
      await patchPlayerProfile(obj);
      this.props.history.push("/playerprofiles/" + data.steamId);
    } catch (ex) {
      if (ex.response.status === 403) {
        this.props.history.replace("/unauthorized");
      }

      this.props.history.replace("/unauthorized");
    }
  }
  
  handleSave = () => {
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    
    if (errors) return;

    this.doSave();
  }

  doSave = async () => {
    const { data } = this.state;
    const { newKick } = this.state;

    try {
      // Move to function addNewKick
      if (Object.values(newKick).filter(value => (value !== "") && (value !== false)).length > 0) {
        data.kicks.push(newKick);
      }

      const obj = this.mapToObjectModel({ ...data });
      await patchPlayerProfile(obj);
      
      this.props.history.push("/playerprofiles/" + data.steamId);
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
        <Link to={"/playerprofiles/" + this.state.data.steamId}>
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
                {this.renderInput("kickDate", "Kick Date", kicks[index].kickDate, (e) => this.handleKickChange(e, index), "text", errors, false, true, (e) => onKeyPress(e, 13, this.handleSave), "YYYY-MM-DD")}
                {this.renderInput("kickedServers", "Kicked Servers", kicks[index].kickedServers, (e) => this.handleKickChange(e, index), "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave), "#")}
                {this.renderCheckbox("autoKick", "Auto-kick", kicks[index].autoKick, (e) => this.handleKickChange(e, index))}
                {this.renderInput("kickReasonCode", "Kick Reason Code", kicks[index].kickReasonCode, (e) => this.handleKickChange(e, index), "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave), "tk/rush/sex/race/attack/tac")}
              </div>}

              {user && user.isAdmin && formState === "create" && <div className="form-group">
                {this.renderInput("kickDate", "Kick Date", newKick.kickDate, this.handleNewKickChange, "text", errors, false, true, (e) => onKeyPress(e, 13, this.handleSave), "YYYY-MM-DD")}
                {this.renderInput("kickedServers", "Kicked Servers", newKick.kickedServers, this.handleNewKickChange, "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave), "#")}
                {this.renderCheckbox("autoKick", "Auto-kick", newKick.autoKick, this.handleNewKickChange)}
                {this.renderInput("kickReasonCode", "Kick Reason Code", newKick.kickReasonCode, this.handleNewKickChange, "text", errors, false, false, (e) => onKeyPress(e, 13, this.handleSave), "tk/rush/sex/race/attack/tac")}
              </div>}
            </Row>
          </LoadingWrapper>
        </Container>
      </React.Fragment>
    );
  }
}

export default PlayerProfileKickForm;