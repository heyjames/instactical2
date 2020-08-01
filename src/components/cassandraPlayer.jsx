import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getCassandraPlayer,
  patchCassandraPlayer,
  deleteCassandraPlayer
} from '../services/cassandraService';
import parse from 'html-react-parser';
import DescriptionList from './common/descriptionList';
import PlayerProfileUtils from './playerProfileUtils';
import Table from './common/table';
import Container from './common/container';
import Row from './common/row';

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
    errors: {},
    serverResponse: ""
  };

  async componentDidMount() {
    const { steamId } = this.props.match.params;
    window.scrollTo(0, 0);

    try {
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

  handleSaveResponse = serverResponse => {
    this.setState({ serverResponse });

    this.handleRemoveSaveResponse(serverResponse);
  }

  handleRemoveSaveResponse = serverResponse => {
    if (serverResponse === "Success") {
      setTimeout(() => this.setState({ serverResponse: "" }), 1200);
    }
  }

  handleSave = async () => {
    try {
      const obj = this.mapViewToModel({ ...this.state.data });
      await patchCassandraPlayer(obj);

      // this.props.history.replace("/cassandraplayers");
      this.handleSaveResponse("Success");
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

  render() {
    const { steamId, comments, fullBan, alias, kicks, classification, bans } = this.state.data;
    const { errors } = this.state;

    return (
      <React.Fragment>
        <Container>
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
                this.renderInput("steamId", null, steamId, this.handleChange, "text", errors, null, null, null, "Steam ID"),
                this.renderInput("alias", null, alias, this.handleChange, "text", errors, null, null, null, "Alias"),
                this.renderDropdown("classification", "form-control form-control-sm", null, null, null, classification, this.handleChange, this.classifications, "code", "label"),
                this.renderTextArea("comments", "", comments, this.handleChange, "2", errors, { minHeight: "150px" }),
                this.renderCheckbox2("fullBan", "", fullBan, this.handleChange)
              ]}
            />

            {this.renderButton("Back", "btn-sm btn-secondary mr-2 mb-3", this.handleBackToMain, null, "fa fa-chevron-left")}
            {this.renderButton("Save", "btn-sm btn-success mr-2 mb-3", this.handleSave)}
            {this.renderButton("Delete", "btn-sm btn-danger mb-3", () => this.handleDelete(steamId))}
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
              editPath={"/cassandraplayers/" + steamId + "/kick/"}
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
              editPath={"/cassandraplayers/" + steamId + "/ban/"}
            />
          </Row>
        </Container>
      </React.Fragment >
    );
  }
}

export default CassandraPlayer;