import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getCassandraPlayers,
  createCassandraPlayer,
  deleteCassandraPlayer,
  patchCassandraPlayer
} from '../services/cassandraService';
import parse from 'html-react-parser';
import Form from './form';
import Banner from './banner';
import Joi from 'joi-browser';
import _ from "lodash";
import PlayerProfileUtils from './playerProfileUtils';
import Pagination from './pagination';
import { paginate, getLastPage } from '../utils/paginate';
import Row from './common/row';
import { handleKeyPress } from './common/utils';
import Table from './common/table';
import Container from './common/container';

class CassandraPlayers extends PlayerProfileUtils {
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
      classification: "",
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
      classification: "",
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

  handleSave = (e) => {
    e.preventDefault();

    const errors = this.validate();

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
        <td>{this.renderInput("steamId", "Steam ID", steamId, this.handleChange, "text", errors, false, true, handleKeyPress)}</td>
        <td>{this.renderInput("alias", "Alias", alias, this.handleChange, "text", errors, false, false, handleKeyPress)}</td>
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

  handleSearchChange = async ({ currentTarget: input }) => {
    this.setState({ search: input.value });
    
    this.handleSearch(input);
  }

  handleSearch = async (input) => {
    let { currentPage, data, pageSize } = this.state;

    if (input.value.length <= 2) {
      const currentPage = getLastPage(data, pageSize);
      this.setState({ currentPage });
      return;
    }

    if (input.value.length > 2) {
      if (currentPage !== 1) currentPage = 1;

      const filteredData = data.filter(c => 
        (c.steamId.includes(input.value.trim())) || (c.alias.find(a => a.includes(input.value)))
      );
        
      this.setState({ filteredData, currentPage });
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

  renderKickBanCounter = ({ length: count }) => {
    if (count < 1) return;

    const addToBadgeClass = (count > 1) ? "warning" : "secondary";

    return (
      <span className={"badge badge-pill badge-" + addToBadgeClass}>{count}</span>
    );
  }

  renderNavTabLinks = () => {
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

  renderNavTabSearch = () => {
    return (
      <Row addToRowClass="pt-3" customColClass="col-md-12">
        {this.renderInput("search", "", this.state.search, this.handleSearchChange, "text", this.state.errors)}
        {this.renderCheckbox("filterFullBan", "Filter Full Ban", this.state.filter.filterFullBan, this.onFilterParams)}
      </Row>
    );
  }

  renderNavTabAddUser = () => {
    return (
      <Row customColClass="col-md-12">
        {this.renderNewForm()}
      </Row>
    );
  }

  renderNavTabController = () => {
    const { tab } = this.state;

    switch (tab) {
      case "search":
        return this.renderNavTabSearch();
        break;
      case "adduser":
        return this.renderNavTabAddUser();
        break;
      default:
        return this.renderNavTabSearch();
        break;
    }
  }

  renderPagination = (count, currentPage, pageSize) => {
    if (count < 1) return;

    return (
      <Row customColClass="col-md-4 offset-md-4">
        <Pagination
          itemsCount={count}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
        />
      </Row>
    );
  }

  renderLoadingIndicator = () => {
    return (
      <h1>Loading...</h1>
    );
  }

  renderSearchResultInfo = count => {
    return (
      <Row customColClass="col-md-12">
        <small className="text-muted pb-2">Found <span className="font-weight-bold">{count}</span> player(s)</small>
      </Row>
    );
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
      marginBottom: "0",
      paddingTop: "1rem",
      paddingBottom: "1rem"
    };

    return pageStyles;
  }

  render() {
    const bannerInfo = { title: "Player Profiles" };
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const classifications = this.classifications;
    const { data, filteredData, search, errors, currentPage, pageSize } = this.state;
    let players = data;

    // Return a search of the filtered data input in the search bar
    if (search.length > 2) {
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

    // Checkbox to filter for players with full bans
    if (this.state.filter.filterFullBan === true) {
      players = players.filter(p => (p.fullBan === true));
    }
    
    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          {this.renderNavTabLinks()}
          {this.renderNavTabController()}
          {this.renderSearchResultInfo(count)}

          <Row customColClass="col-md-12">
            {(this.state.loading) ? (this.renderLoadingIndicator()) : (
              <React.Fragment>
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
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
                      const steamId = player.steamId;

                      // Get associated classification object from classification code
                      const classification = this.getClassification(player);

                      return (
                        <tr key={index}>

                          <td style={{ wordBreak: "break-all" }}>
                            <a className="mr-2" target="_blank" rel="noopener noreferrer" href={"https://steamcommunity.com/profiles/" + steamId}>
                              <i className="fa fa-steam-square" aria-hidden="true"></i>
                            </a>
                            {player.steamId}
                          </td>

                          <td>{player.alias.map((name, index) => {
                            return (
                              <Link key={index} to={"/cassandraplayers" + "/" + player.steamId}>
                                <div className="badge badge-pill badge-secondary mr-1" style={classification.css}>{name}</div>
                              </Link>
                            )
                          })}
                          </td>

                          <td><span className="badge badge-pill badge-secondary">{classification.label}</span></td>
                          
                          <td>
                            {player.fullBan && (<span className="badge badge-pill badge-secondary">{player.fullBan.toString()}</span>)}
                          </td>
                          
                          <td>
                            {this.renderKickBanCounter(player.kicks)}
                          </td>
                          
                          <td>
                            {this.renderKickBanCounter(player.bans)}
                          </td>

                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </React.Fragment>
            )}
          </Row>

          {this.renderPagination(count, currentPage, pageSize)}
        </Container>
      </React.Fragment>
    );
  }
}

export default CassandraPlayers;