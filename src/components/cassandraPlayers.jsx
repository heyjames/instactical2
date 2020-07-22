import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayers, createCassandraPlayer } from '../services/cassandraService';
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
import TableHead from './common/tableHead';
import TableBodyRows from './common/tableBodyRows';
import Container from './common/container';

class CassandraPlayers extends PlayerProfileUtils {
  state = {
    loading: true,
    data: [],
    filteredData: [],
    search: "",
    customFilter: false,
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

  handleSearchChange = async ({ currentTarget: input }) => {
    this.setState({ search: input.value });
    
    this.handleSearch(input);
  }

  handleSearch = input => {
    let { currentPage, data, pageSize } = this.state;

    // Return to last page if search input has less than 3 characters
    if (input.value.length <= 2) {
      const currentPage = getLastPage(data, pageSize);
      this.setState({ currentPage });
      return;
    }

    // Filter search results if input has more than 2 characters
    if (input.value.length > 2) {
      if (currentPage !== 1) currentPage = 1;

      const filteredData = data.filter(c => 
        (c.steamId.includes(input.value.trim())) || (c.alias.find(a => a.includes(input.value)))
      );

      this.setState({ filteredData, currentPage });
    }
  }

  onFilterParams = () => {
    let { currentPage, data, pageSize } = this.state;
    let filter = {};
    let customFilter = true;
    filter.filterFullBan = !this.state.filter.filterFullBan;
    
    if (currentPage !== 1) currentPage = 1;

    if (filter.filterFullBan === false) {
      customFilter = false;
      currentPage = getLastPage(data, pageSize);
    }

    this.setState({ filter, customFilter, currentPage });
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

  renderInfractionCountLabel = (player, infractionType) => {
    const { length: count } = player[infractionType];

    if (count < 1) return;

    let badgeClass = "badge badge-pill badge-";
    badgeClass += (count > 1) ? "warning" : "secondary";

    return (
      <span className={badgeClass}>
        {count}
      </span>
    );
  }

  renderNavTabLinks = () => {
    const { tab } = this.state;
    
    return (
      <ul className="nav nav-tabs col-md-10 offset-md-1" id="myTab" role="tablist">
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
    const { errors, filter, search } = this.state;
    
    return (
      <Row addToRowClass="pt-3" customColClass="col-md-10 offset-md-1">
        {this.renderInput("search", "", search, this.handleSearchChange, "text", errors, false, true)}
        {/* {this.renderCheckbox("filterFullBan", "Filter Full Ban", filter.filterFullBan, this.onFilterParams)} */}
      </Row>
    );
  }

  renderNavTabAddUser = () => {
    const { steamId, comments, fullBan, alias } = this.state.newEntry;
    const { errors } = this.state;
    
    return (
      <Row addToRowClass="pt-3" customColClass="col-md-10 offset-md-1">
      <React.Fragment>
        <span>{this.renderButton("Add", "btn-sm btn-success mr-2 mb-3", this.handleSave)}</span>
        <span>{this.renderButton("Clear", "btn-sm btn-secondary mb-3", this.handleResetForm)}</span>
        <span>{this.renderInput("steamId", null, steamId, this.handleChange, "text", errors, false, true, handleKeyPress, "Steam ID")}</span>
        <span>{this.renderInput("alias", null, alias, this.handleChange, "text", errors, false, false, handleKeyPress, "Alias")}</span>
        <span>{this.renderDropdown("classification", "form-control form-control-sm", { padding: "10px" }, null, null, this.state.newEntry.classification, this.handleChange, this.classifications, "code", "label", "a Classification")}</span>
        <span>{this.renderInput("comments", null, comments, this.handleChange, "text", errors, false, false, null, "Comments")}</span>
        {/* <span>{this.renderCheckbox("fullBan", "Full Ban", fullBan, this.handleChange)}</span> */}
      </React.Fragment>
      </Row>
    );
  }

  renderNavTabContent = () => {
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

  renderFullBanLabel = ({ fullBan }) => {
    if (!fullBan) return;

    return (
      <span className="badge badge-pill badge-secondary">
        {fullBan.toString()}
      </span>
    );
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
      <Row customColClass="col-md-10 offset-md-1">
        <h1>Loading...</h1>
      </Row>
    );
  }

  renderSearchResultInfo = count => {
    return (
      <Row customColClass="col-md-10 offset-md-1 pt-4">
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

  renderClassificationLabel = player => {
    const { label } = this.getClassification(player);

    return (
      <span className="badge badge-pill badge-secondary">{label}</span>
    );
  }

  renderPlayerNameLabel = player => {
    const { alias, steamId } = player;
    const { css } = this.getClassification(player);

    if (alias[0] === "") {
      const emptyAlias = "Empty Alias";

      return (
        <Link to={"/cassandraplayers" + "/" + steamId}>
          <span>{emptyAlias}</span>
        </Link>
      );
    }
    
    
    return (
      alias.map((name, index) => {
        return (
          <Link key={index} to={"/cassandraplayers" + "/" + steamId}>
            <span className="badge badge-pill badge-secondary mr-1" style={css}>{name}</span>
          </Link>
        );
      })
    );
  }

  renderSteamIdLabel = ({ steamId }) => {
    const link = "https://steamcommunity.com/profiles/" + steamId;

    return (
      <span>
        <a className="mr-2" target="_blank" rel="noopener noreferrer" href={link}>
          <i className="fa fa-steam-square" aria-hidden="true"></i>
        </a>
        {steamId}
      </span>
    );
  }

  renderPlayersTable = players => {
    return (
      <Row customColClass="col-md-10 offset-md-1">
        <table className="table table-sm table-striped">
          <TableHead colHead={[
              "Steam ID",
              "Aliases",
              "Classification",
              "Full Ban",
              "Kicks",
              "Bans"
            ]}
          />
          <tbody>
            {players.map((player, index) => {
              return (
                <TableBodyRows key={index} cells={[
                    this.renderSteamIdLabel(player),
                    this.renderPlayerNameLabel(player),
                    this.renderClassificationLabel(player),
                    this.renderFullBanLabel(player),
                    this.renderInfractionCountLabel(player, "kicks"),
                    this.renderInfractionCountLabel(player, "bans")
                  ]}
                />
              );
            })}
          </tbody>
        </table>
      </Row>
    );
  }

  getFilteredSearchData = ({ length }) => {
    const { data, filteredData } = this.state;

    return (length > 2) ? filteredData : data;
  }

  render() {
    const bannerInfo = { title: "Player Profiles" };
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const { data, filteredData, search, errors, currentPage, pageSize } = this.state;
    let { data: players } = this.state;

    // Return a search of the filtered data input in the search bar
    players = this.getFilteredSearchData(search);

    // players = players.filter(p => (p.classification !== "00"));
    // players = players.filter(p => (p.classification !== "01"));
    // players = players.filter(p => (p.classification !== "02"));
    // players = players.filter(p => (p.classification === "07"));
    // players = players.filter(p => (p.alias[0] === ""));
    // players = players.filter(p => (p.steamId === "76561197967879837"));
    // players = players.filter(p => (p.kicks.length > 0 || p.bans.length > 0));
    // players = players.slice(players.length - 70);
    // players = players.sort((a, b) => (a.classification > b.classification) ? 1 : -1);

    // Checkbox to filter for players with full bans
    if (this.state.filter.filterFullBan === true) {
      players = players.filter(p => (p.fullBan === true));
    }

    const { length: count } = players;
    
    players = paginate(players, currentPage, pageSize);
    
    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          {this.renderNavTabLinks()}
          {this.renderNavTabContent()}
          {this.renderSearchResultInfo(count)}
          {(this.state.loading) ? this.renderLoadingIndicator() : this.renderPlayersTable(players)}
          {this.renderPagination(count, currentPage, pageSize)}
        </Container>
      </React.Fragment>
    );
  }
}

export default CassandraPlayers;