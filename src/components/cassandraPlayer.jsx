import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getCassandraPlayer,
  patchCassandraPlayer,
  deleteCassandraPlayer
} from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import DescriptionList from './common/descriptionList';
import PlayerProfileUtils from './playerProfileUtils';
import Table from './common/table';

class CassandraPlayer extends PlayerProfileUtils {
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
    errors: {}
  };

  async componentDidMount() {
    window.scrollTo(0, 0);

    try {
      let data = await getCassandraPlayer(this.props.match.params.steamId);
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

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    // const errorMsg = this.validateProperty(input);
    // obj.errors[input.name] = errorMsg;
    obj.data[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState(obj);
  }

  handleAddKick = () => {
    const { steamId } = this.state.data;
    this.props.history.push("/cassandraplayers/" + steamId + "/kick/new");
  }

  handleAddBan = () => {
    const { steamId } = this.state.data;
    this.props.history.push("/cassandraplayers/" + steamId + "/ban/new");
  }

  handleBackToMain = () => {
    this.props.history.push("/cassandraplayers");
  }

  handleSave = () => {
    this.doSave();
  }

  handleDelete = async steamId => {
    try {
      const confirmMsg = `Are you sure you want to delete the user with the given Steam ID: ${steamId}?`;
      if (window.confirm(confirmMsg)) {

        // const data = this.state.data.filter(c => c.steamId !== steamId);
        // this.setState({ data });
        this.props.history.replace("/cassandraplayers");
        
        await deleteCassandraPlayer(steamId);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errors = { ...this.state.errors };
        errors.steamId = error.response.data;
        this.setState({ errors });
      }
    }
  }

  doSave = async () => {
    try {
      const obj = this.mapViewToModel(this.state.data);
      const cassandraPlayer = await patchCassandraPlayer(obj);

      this.props.history.replace("/cassandraplayers");
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  render() {
    const { steamId, comments, fullBan, alias, kicks, classification, bans } = this.state.data;
    const { errors } = this.state;

    let classificationLabel = "";
    let classificationId = classification;

    if (classificationId !== "") {
      let classification2 = this.classifications.filter(c => { return c.code === classificationId })[0];
      if (classification2) {
        classificationLabel = classification2.label;
      } else {
        console.log("Classification Error");
      }
    }

    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">

                <h4 id="info">Info</h4>
                <DescriptionList
                  labels={[
                    <span class="text-nowrap">Steam ID {this.renderSteamIconLink(steamId)}</span>,
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
                    this.renderInput("steamId", null, steamId, this.handleChange, "text", errors, null, null, null, "Steam ID"),
                    this.renderInput("alias", null, alias, this.handleChange, "text", errors, null, null, null, "Alias"),
                    this.renderDropdown("classification", "form-control form-control-sm", null, null, null, this.state.data.classification, this.handleChange, this.classifications, "code", "label"),
                    this.renderTextArea("comments", "", comments, this.handleChange, "2", errors, { minHeight: "150px" }),
                    this.renderCheckbox2("fullBan", "", fullBan, this.handleChange)
                  ]}
                />

                {this.renderButton("Cancel to main", "btn-sm btn-secondary mr-2 mb-3", this.handleBackToMain, null, "fa fa-chevron-left")}
                {this.renderButton("Save", "btn-sm btn-success mr-2 mb-3", this.handleSave)}
                {this.renderButton("Delete", "btn-sm btn-danger mb-3", () => this.handleDelete(steamId))}

                <h4>Kicks</h4>
                <Table
                  headerClass="table-warning"
                  colHeaders={["", "Server", "Date", "Auto-kick", "Reason Code", "SID", "Timestamp"]}
                  data={kicks}
                  cells={["kickedServers", "kickDate", "autoKick", "kickReasonCode", "kickSid", "kickSidTimestamp"]}
                  steamId={steamId}
                  addBtn={true}
                  onAddBtn={this.handleAddKick}
                  editPath={"/cassandraplayers/" + steamId + "/kick/"}
                />

                <h4>Bans</h4>
                <Table
                  headerClass="table-danger"
                  colHeaders={["", "Server", "Date", "Reason Code", "SID", "Timestamp"]}
                  data={bans}
                  cells={["bannedServers", "banDate", "banReasonCode", "banSid", "banSidTimestamp"]}
                  steamId={steamId}
                  addBtn={true}
                  onAddBtn={this.handleAddBan}
                  editPath={"/cassandraplayers/" + steamId + "/ban/"}
                />
              </div>
            </div>

          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default CassandraPlayer;