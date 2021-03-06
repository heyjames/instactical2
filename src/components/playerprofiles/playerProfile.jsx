import React from 'react';
// import { Link } from 'react-router-dom';
import {
  getPlayerProfile,
  patchPlayerProfile,
  deletePlayerProfile
} from '../../services/playerProfileService';
// import parse from 'html-react-parser';
import DescriptionList from '../common/descriptionList';
import PlayerProfileUtils from './playerProfileUtils';
import Table from '../common/table';
import Container from '../common/container';
import Row from '../common/row';
// import { pause } from './common/utils';
// import moment from 'moment';
import Banner from '../navigation/banner';
import Time from '../common/time';
import LoadingWrapper from '../common/loadingWrapper';
import Joi from 'joi-browser';

class PlayerProfile extends PlayerProfileUtils {
  state = {
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
    errors: {},
    serverResponse: ""
  };

  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    const { steamId } = this.props.match.params;
    window.scrollTo(0, 0);

    try {
      // await pause(2);
      let data = await getPlayerProfile(steamId);
      data = this.mapToViewModel(data);
      const loading = false;
      document.title = data.alias + " - insTactical";

      if (this._isMounted) {
        this.setState({ data, loading });
      }
    } catch (ex) {
      const loading = false;

      if (ex.response.status === 403) {
        this.props.history.replace("/unauthorized");
      }

      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        
        if (this._isMounted) {
          this.setState({ errors, loading });
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  validate = () => {
    const options = { abortEarly: false };
    // console.log(this.state.data);
    const { error } = Joi.validate(this.state.data, this.schema, options);
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

  // handleChange = ({ currentTarget: input }) => {
  //   let obj = { ...this.state }
  //   const errorMsg = this.validateProperty(input);
  //   obj.errors[input.name] = errorMsg;
  //   obj.newEntry[input.name] = (input.type === "checkbox") ? input.checked : input.value;

  //   this.setState(obj);
  // }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    const errorMsg = this.validateProperty(input);
    obj.errors[input.name] = errorMsg;
    obj.data[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState(obj);
  }

  handleAddKick = () => {
    const { steamId } = this.state.data;
    this.props.history.push("/playerprofiles/" + steamId + "/kick/new");
  }

  handleAddBan = () => {
    const { steamId } = this.state.data;
    this.props.history.push("/playerprofiles/" + steamId + "/ban/new");
  }

  handleBackToMain = () => {
    this.props.history.push("/playerprofiles");
  }

  handleSaveResponse = serverResponse => {
    if (this._isMounted) {
      this.setState({ serverResponse }, () => this.handleRemoveSaveResponse(serverResponse));
    }
  }

  handleRemoveSaveResponse = serverResponse => {
    if (serverResponse === "Success") {
      setTimeout(() => this._isMounted && this.setState({ serverResponse: "" }), 1200)
    }
  }

  handleSave = () => {
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    
    if (errors) return;

    this.doSave();
  }

  doSave = async () => {
    try {
        const obj = this.mapToObjectModel({ ...this.state.data });
        // await pause(3);

        if (this._isMounted) {
          await patchPlayerProfile(obj);

          // this.props.history.replace("/playerprofiles");
          this.handleSaveResponse("Success");
        }
    } catch (ex) {
      this.handleSaveResponse("Failed");

      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  handleDelete = async steamId => {
    try {
      const confirmMsg = `Are you sure you want to delete the user with the given Steam ID: ${steamId}?`;
      if (window.confirm(confirmMsg)) {
        this.props.history.replace("/playerprofiles");
        
        if (this._isMounted) {
          await deletePlayerProfile(steamId);
        } else {
          return;
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errors = { ...this.state.errors };
        errors.steamId = error.response.data;
        this.setState({ errors });
      } else {
        this.props.history.replace("/unauthorized");
      }
    }
  }

  renderSubmitResponse = () => {
    const { serverResponse } = this.state;

    if (serverResponse === "") return;
    let customClass = (serverResponse === "Success")
                    ? "success"
                    : "danger";

    return (
      <div className={`alert alert-${customClass}`} role="alert">
        {serverResponse}
      </div>
    );
  }

  getPageStyles = () => {
    const pageStyles = {};

    pageStyles.bannerStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    pageStyles.backgroundStyle = {
      backgroundColor: "#f5f5f5",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    return pageStyles;
  }

  getUserCreateDate = _id => {
    const data = {};
    let userCreateDate = new Date(parseInt(_id.toString().substring(0,8), 16) * 1000);
    data.createdAt = userCreateDate;
    // return moment(userCreateDate).format("MMMM D, YYYY"); 

    // const iso8601 = "YYYY-MM-DD hh:mm:ss Z";
    // return moment(userCreateDate, iso8601).fromNow();
    
    return (<Time data={data} />);
  }

  render() {
    const { _id, steamId, comments, fullBan, alias, kicks, classification, bans } = this.state.data;
    const { errors, loading } = this.state;
    const { user } = this.props;
    const disableForm = (user && user.isAdmin) ? false : true;
    const { backgroundStyle, bannerStyle } = this.getPageStyles();
    const bannerInfo = { title: alias, subtitle: this.getUserCreateDate(_id) };
    
    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <LoadingWrapper loading={loading}>
            <Row customColClass="col-md-12">
              <h4 id="info">Info</h4>
              <DescriptionList
                labels={[
                  <span className="text-nowrap">Steam ID {this.renderSteamIconLink(steamId)}</span>,
                  "Alias",
                  "Classification",
                  "Comments",
                  "Full Ban"
                ]}
                names={[
                  "steamid",
                  "alias",
                  "classification",
                  "comments",
                  "fullBan"
                ]}
                content={[
                  this.renderInput("steamId", null, steamId, this.handleChange, "text", errors, disableForm, null, null, "Steam ID"),
                  this.renderInput("alias", null, alias, this.handleChange, "text", errors, disableForm, null, null, "Alias"),
                  this.renderDropdown("classification", "form-control form-control-sm", null, null, null, classification, this.handleChange, this.classifications, "code", "label", null, disableForm),
                  this.renderTextArea("comments", "", comments, this.handleChange, "2", errors, { minHeight: "150px" }, null, disableForm),
                  this.renderCheckbox2("fullBan", "", fullBan, this.handleChange, disableForm)
                ]}
              />

              {this.renderButton("Back", "btn-sm btn-secondary mr-2 mb-3", this.handleBackToMain, null, "fa fa-chevron-left")}
              {(user && user.isAdmin) && (
                <React.Fragment>
                  {this.renderButton("Save", "btn-sm btn-success mr-2 mb-3", this.handleSave)}
                  {this.renderButton("Delete", "btn-sm btn-danger mb-3", () => this.handleDelete(steamId))}
                </React.Fragment>
              )}
              {this.renderSubmitResponse()}

              <h4>Kicks</h4>
              <Table
                headerClass="table-warning"
                colHeaders={["", "Server", "Date", "Auto-kick", "Reason Code"]}
                data={kicks}
                cells={["kickedServers", "kickDate", "autoKick", "kickReasonCode"]}
                steamId={steamId}
                addBtn={true}
                onAddBtn={this.handleAddKick}
                editPath={(user && user.isAdmin) && ("/playerprofiles/" + steamId + "/kick/")}
                user={user}
              />

              <h4>Bans</h4>
              <Table
                headerClass="table-danger"
                colHeaders={["", "Server", "Date", "Reason Code"]}
                data={bans}
                cells={["bannedServers", "banDate", "banReasonCode"]}
                steamId={steamId}
                addBtn={true}
                onAddBtn={this.handleAddBan}
                editPath={(user && user.isAdmin) && ("/playerprofiles/" + steamId + "/ban/")}
                user={user}
              />
            </Row>
          </LoadingWrapper> 
        </Container>
      </React.Fragment >
    );
  }
}

export default PlayerProfile;