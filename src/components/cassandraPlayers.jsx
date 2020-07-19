import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayers, createCassandraPlayer, deleteCassandraPlayer, patchCassandraPlayer } from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Banner from './banner';
import Joi from 'joi-browser';
import _ from "lodash";
import PlayerProfileUtils from './playerProfileUtils';
import Pagination from './pagination';
import { paginate, getLastPage } from '../utils/paginate';
import Row from './common/row';

class CassandraPlayers extends PlayerProfileUtils {

  defaultClassificationCode = "";

  state = {
    loading: true,
    data: [],
    filteredData: [],
    search: "",
    filter: {
      filterFullBan: false
    },
    newEntry: {
      steamId: "",
      comments: "",
      classification: this.defaultClassificationCode,
      fullBan: false,
      alias: "",
      kicks: [],
      bans: []
    },
    errors: {},
    currentPage: 1,
    pageSize: 9,
    tab: "search"
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    
    const data = await getCassandraPlayers();
    const loading = false;
    const currentPage = getLastPage(data, this.state.pageSize);

    this.setState({ data, loading, currentPage });
  }

  handleResetForm = () => {
    const newEntry = {
      steamId: "",
      comments: "",
      classification: this.defaultClassificationCode,
      fullBan: false,
      alias: ""
    }

    this.setState({ newEntry });
  }

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.newEntry, this.schema, options);
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

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    const errorMsg = this.validateProperty(input);
    obj.errors[input.name] = errorMsg;
    obj.newEntry[input.name] = (input.type === "checkbox") ? input.checked : input.value;

    this.setState(obj);
  }

  handleDelete = async (steamId) => {
    try {
      if (window.confirm(`Are you sure you want to delete the user with the given Steam ID: ${steamId}?`)) {
        await deleteCassandraPlayer(steamId);

        const data = this.state.data.filter(c => c.steamId !== steamId);
        this.setState({ data });
        this.props.history.push("/cassandraplayers");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  handleSave = (e) => {
    e.preventDefault();

    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSave();
  }

  doSave = async () => {
    try {
      const newEntry = this.mapViewToModel(this.state.newEntry);
      await createCassandraPlayer(newEntry);

      const data = await getCassandraPlayers();
      this.setState({ data });
      this.handleResetForm();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.steamId = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  renderNewForm = () => {
    const { steamId, comments, fullBan, alias } = this.state.newEntry;
    const { errors } = this.state;

    return (
      <tr>
        <td className="align-bottom">
          {this.renderButton("Add", "btn-sm btn-success mr-2 mb-3", this.handleSave)}
          {this.renderButton("Clear", "btn-sm btn-secondary mb-3", this.handleResetForm)}
        </td>
        <td>{this.renderInput("steamId", "Steam ID", steamId, this.handleChange, "text", errors, false, true, this.handleKeyPress)}</td>
        <td>{this.renderInput("alias", "Alias", alias, this.handleChange, "text", errors, false, false, this.handleKeyPress)}</td>
        <td>
          <div className="form-group">
            <label>Classification</label>
            {this.renderDropdown("classification", "form-control form-control-sm", { padding: "10px" }, null, null, this.state.newEntry.classification, this.handleChange, this.classifications, "code", "label")}
          </div>
        </td>
        <td>{this.renderCheckbox("fullBan", "Full Ban", fullBan, this.handleChange)}</td>
        <td>{this.renderInput("comments", "Comments", comments, this.handleChange, "text", errors)}</td>
        <td></td>
      </tr>
    );
  }

  handleSearch = async ({ currentTarget: input }) => {
    this.setState({ search: input.value });

    if (input.value.length >= 1) {
      const filteredData = this.state.data.filter(c => (c.steamId.includes(input.value.trim())) || (c.alias.find(a => a.includes(input.value))));
      this.setState({ filteredData });
    }
  }

  onFilterParams = () => {
    let filter = {};
    filter.filterFullBan = !this.state.filter.filterFullBan;

    this.setState({ filter });
  }

  handleEdit = steamId => {
    this.props.history.push("/cassandraplayers/" + steamId);
  }
  
  handlePageChange = currentPage => {
    this.setState({ currentPage });
  }

  handleNavTabChange = ({ target }) => {
    const { id } = target;

    switch (id) {
      case "search-tab":
        this.setState({ tab: "search" });
        break;
      case "adduser-tab":
        this.setState({ tab: "adduser" });
        break;
      default:
        this.setState({ tab: "search" });
        break;
    }
  }

  getNavTabClass = (element) => {
    return (element === this.state.tab) ? " active" : "";
  }

  renderNavTab = () => {
    const { tab } = this.state;
    
    return (
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item">
          <a className={"nav-link" + this.getNavTabClass("search")} id="search-tab" href="#" onClick={this.handleNavTabChange}>Search</a>
        </li>
        <li className="nav-item">
          <a className={"nav-link" + this.getNavTabClass("adduser")} id="adduser-tab" href="#" onClick={this.handleNavTabChange}>Add User</a>
        </li>
      </ul>
    );
  }

  render() {
    const pageTitle = { title: "Player Profiles", subtitle: "" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };
    const classifications = this.classifications;
    const { data, filteredData, search, errors, currentPage, pageSize } = this.state;

    let players = data;
    if (search) {
      players = filteredData;
    } else {
      players = data;
    }

    // players = players.filter(p => (p.classification !== "00"));
    // players = players.filter(p => (p.classification !== "01"));
    // players = players.filter(p => (p.classification !== "02"));
    // players = players.filter(p => (p.classification === "07"));
    // players = players.filter(p => (p.alias[0] === ""));
    // players = players.filter(p => (p.steamId === "76561197967879837"));
    // players = players.filter(p => (p.kicks.length > 0 || p.bans.length > 0));
    // players = players.slice(players.length - 70);
    // players = players.sort((a, b) => (a.classification > b.classification) ? 1 : -1);
    const { length: count } = players;
    players = paginate(players, currentPage, pageSize);

    if (this.state.filter.filterFullBan === true) {
      players = players.filter(p => (p.fullBan === true));
    }
    
    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0", paddingTop: "1rem", paddingBottom: "1rem" }}>
          <div className="container">

              {this.renderNavTab()}
              {(this.state.tab === "search") && (
                <Row customColClass="col-md-12">
                  {this.renderInput("search", "", this.state.search, (e) => this.handleSearch(e), "text", errors)}
                  {this.renderCheckbox("filterFullBan", "Filter Full Ban", this.state.filter.filterFullBan, this.onFilterParams)}
                </Row>
              )}
              {(this.state.tab === "adduser") && (
                <Row customColClass="col-md-12">
                  <table className="table table-sm table-striped">
                    <tbody>
                      {this.renderNewForm()}
                    </tbody>
                  </table>
                </Row>
              )}
            
            <Row customColClass="col-md-12">
              <small className="text-muted pb-2">Found <span className="font-weight-bold">{players.length}</span> player(s)</small>
            </Row>

            <Row customColClass="col-md-12">
                {(this.state.loading) 
                  ? (<h1>Loading...</h1>)
                  : (<React.Fragment>
                    <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Edit</th>
                        <th scope="col">Steam ID</th>
                        <th scope="col">Aliases</th>
                        <th scope="col">Classification</th>
                        <th scope="col">Full Ban</th>
                        <th scope="col">Kicks</th>
                        <th scope="col">Bans</th>
                      </tr>
                    </thead>

                    <tbody>
                      {players.map((player, index) => {
                        let fullBanClass = "badge badge-pill";
                        fullBanClass += (player.fullBan) ? " badge-secondary" : " badge-secondary";

                        const steamId = player.steamId;

                        let classificationLabel = "";
                        let classificationId = player.classification;
                        let classificationCss = {};

                        if (player.classification !== "") {
                          let classification = classifications.filter((c) => { return c.code === player.classification })[0];
                          if (classification) {
                            classificationLabel = classification.label;
                            classificationCss = classification.css;
                          } else {
                            console.log("Classification Error");
                          }
                        }

                        return (
                          <tr key={index}>
                            <td style={{ whiteSpace: "nowrap" }}>
                              <form onSubmit={(e) => e.preventDefault()}>

                                {this.renderButton("X", "btn-sm btn-secondary mr-2", () => this.handleDelete(steamId))}

                                <Link to={"/cassandraplayers/" + player.steamId + "/kick/new"}>
                                  {this.renderButton("+K", "btn-sm btn-secondary mr-2")}
                                </Link>

                                <Link to={"/cassandraplayers/" + player.steamId + "/ban/new"}>
                                  {this.renderButton("+B", "btn-sm btn-secondary mr-2")}
                                </Link>

                                {this.renderButton("Edit", "btn-sm btn-secondary mr-2", () => this.handleEdit(steamId))}

                                <a target="_blank" rel="noopener noreferrer" href={"https://steamcommunity.com/profiles/" + steamId}>
                                  <i className="fa fa-steam-square" aria-hidden="true"></i>
                                </a>

                              </form>
                            </td>
                            <td style={{ wordBreak: "break-all" }}>{player.steamId}</td>
                            <td>{player.alias.map((name, index) => {
                              return (
                                <Link key={index} to={"/cassandraplayers" + "/" + player.steamId}>
                                  <div className="badge badge-pill badge-secondary mr-1" style={classificationCss}>{name}</div>
                                </Link>
                              )
                            })}
                            </td>
                            <td><span className="badge badge-pill badge-secondary">{classificationLabel}</span></td>
                            <td>{player.fullBan && (<span className={fullBanClass}>{player.fullBan.toString()}</span>)}</td>
                            <td>
                              {player.kicks.map((kick, index, arrayObj) => {
                                let kickReasonCodeLabel = "";
                                if (kick && (kick.kickReasonCode === "" || kick.kickReasonCode === "n/a")) {
                                  kickReasonCodeLabel = "Unknown";
                                } else {
                                  kickReasonCodeLabel = kick.kickReasonCode;
                                }

                                return (
                                  <div key={index}>
                                    <Link to={"/cassandraplayers/" + player.steamId + "/kick/" + index}>
                                      <div className="badge badge-pill badge-secondary mr-1">{kickReasonCodeLabel}</div>
                                    </Link>
                                  </div>
                                )
                              })}
                            </td>
                            <td>
                              {player.bans.map((ban, index, arrayObj) => {
                                if (ban && ban.banReasonCode === "") ban.banReasonCode = "Unknown";

                                return (
                                  <div key={index}>
                                    <Link to={"/cassandraplayers/" + player.steamId + "/ban/" + index}><div className="badge badge-pill badge-secondary mr-1">{ban.banReasonCode}</div></Link>
                                  </div>
                                )
                              })}
                            </td>
                          </tr>
                        )
                      }
                      )}
                    </tbody>
                  </table>
                  </React.Fragment>
                )}
              </Row>

              <Row customColClass="col-md-4 offset-md-4">
                <Pagination
                  itemsCount={count}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={this.handlePageChange}
                />
              </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CassandraPlayers;