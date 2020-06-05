import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
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

  handleCancel = e => {
    e.preventDefault();

    this.props.history.push("/cassandraplayers");
  }

  handleBackToMain = e => {
    e.preventDefault();

    this.props.history.push("/cassandraplayers");
  }

  handleSave = e => {
    e.preventDefault();

    this.doSave();
  }

  mapViewToModel = (data) => {
    data.alias = data.alias.trim().toLowerCase();

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

  handleAddKick = () => {
    this.props.history.push("/cassandraplayers/" + this.state.data.steamId + "/kick/new");
  }

  handleAddBan = () => {
    this.props.history.push("/cassandraplayers/" + this.state.data.steamId + "/ban/new");
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
    const { errors } = this.state;

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

    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-12">
                <h4 id="info">Info</h4>
                <DescriptionList
                  labels={[
                    <React.Fragment>Steam ID<a className="ml-2" target="_blank" rel="noopener noreferrer" href={"https://steamcommunity.com/profiles/" + steamId}><i className="fa fa-steam-square" aria-hidden="true"></i></a></React.Fragment>,
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
                    <input type="text" class="form-control form-control-sm" name="steamId" id="steamId" placeholder="Steam ID" value={steamId} onChange={this.handleChange} />,
                    <input type="text" class="form-control form-control-sm" name="alias" id="alias" placeholder="Alias" value={alias} onChange={this.handleChange} />,
                    this.renderDropdown("classification", "form-control form-control-sm", null, null, null, this.state.data.classification, this.handleChange, this.classifications, "code", "label"),
                    this.renderTextArea("comments", "", comments, this.handleChange, "2", errors, { minHeight: "60px" }),
                    this.renderCheckbox2("fullBan", "", fullBan, this.handleChange)
                  ]}
                />

                {this.renderButton("Cancel to main", "btn-sm btn-secondary mr-2 mb-3", this.handleBackToMain, null, "fa fa-chevron-left")}
                {this.renderButton("Save", "btn-sm btn-success mb-3", this.handleSave)}

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
              </div >
            </div >
          </div >
        </div >
      </React.Fragment >
    );
  }
}

export default CassandraPlayer;