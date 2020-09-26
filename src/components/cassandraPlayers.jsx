import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCassandraPlayers, createCassandraPlayer } from '../services/cassandraService';
import { getCurrentPlayers } from '../services/fakeServers';
import parse from 'html-react-parser';
import Form from './form';
import Banner from './banner';
import Joi from 'joi-browser';
import _ from "lodash";
import PlayerProfileUtils from './playerProfileUtils';
import Pagination from './pagination';
import { paginate, getLastPage } from '../utils/paginate';
import { renderLoadingIndicator } from './common/loading';
import Row from './common/row';
import { onKeyPress, pause } from './common/utils';
import TableHead from './common/tableHead';
import TableBodyRows from './common/tableBodyRows';
import Container from './common/container';
import Button from './button';
import moment from 'moment';
import CassandraLog from './cassandraLog';
import LoadingWrapper from './common/loadingWrapper';

class CassandraPlayers extends PlayerProfileUtils {
  constructor(props) {
    super(props);

    this.state = {
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
      tab: "search",
      columnSort: false,
      columnSortColumn: ""
    };
  
    this._isMounted = false;
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    this._isMounted = true;
    document.title = "Player Profiles - insTactical";
    
    try {
      // await pause(2);
      const data = await getCassandraPlayers();
      const loading = false;
      const currentPage = getLastPage(data, this.state.pageSize);
  
      if (this._isMounted) {
        this.setState({ data, loading, currentPage });
      }
    } catch (error) {
      // console.log(error.response);
      if (error.response.status === 403) {
        this.props.history.replace("/unauthorized");
      } else {
        this.props.history.replace("/notFound");
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleResetAddUserForm = () => {
    const newEntry = {
      steamId: "",
      comments: "",
      classification: "",
      fullBan: false,
      alias: "",
      kicks: [],
      bans: []
    }

    this.setState({ newEntry });
  }

  handleResetSearch = () => {
    const { data, pageSize } = this.state;
    
    const search = "";
    const currentPage = getLastPage(data, pageSize);

    this.setState({ search, currentPage });
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

  handleSave = (autoKick = false) => {
    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    this.doSave(autoKick);
  }

  doSave = async autoKick => {
    const { pageSize } = this.state;

    try {
      const newEntry = this.mapViewToModel({ ...this.state.newEntry });

      // If using the auto-kick quick input button, push a new kick object
      if (autoKick) {
        const today = moment().format('YYYY-MM-DD');
        // const today = moment().subtract(1, 'day').format('YYYY-MM-DD');

        newEntry.classification = "07";
        newEntry.kicks.push({
          kickDate: today,
          kickedServers: "1",
          autoKick: true,
          kickReasonCode: "rush",
          kickReason: "",
          kickSid: "",
          kickSidTimestamp: ""
        });
      }
      
      await createCassandraPlayer(newEntry);

      const data = await getCassandraPlayers();
      const newCurrentPage = getLastPage(data, pageSize);

      this.setState(
        { data, currentPage: newCurrentPage },
        () => this.handleResetAddUserForm()
      );
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
        (c.steamId.includes(input.value.trim())) || (c.alias.find(a => a.toLowerCase().includes(input.value.toLowerCase())))
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
    const { data, pageSize } = this.state;
    const currentPage = getLastPage(data, pageSize);

    switch (id) {
      case "search-tab":
        this.setState({ tab: "search" });
        break;
      case "adduser-tab":
        this.setState({ tab: "adduser", search: "", currentPage });
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
    const { user } = this.props;
    
    return (
      <ul className="nav nav-tabs col-md-10 offset-md-1" id="myTab" role="tablist">
        <li className="nav-item">
          <a
            className={"nav-link" + this.getNavTabClass("search")}
            id="search-tab"
            href="#"
            onClick={this.handleNavTabChange}
          >
            Search
          </a>
        </li>

        {(user && user.isAdmin) && (<li className="nav-item">
          <a
            className={"nav-link" + this.getNavTabClass("adduser")}
            style={{ outline: 0 }}
            id="adduser-tab"
            href="#"
            onClick={this.handleNavTabChange}
          >
            Add User
          </a>
        </li>)}
      </ul>
    );
  }

  renderNavTabSearch = () => {
    const { errors, filter, search } = this.state;
    
    return (
      <Row customColClass="col-md-10 offset-md-1 pt-3">
        {this.renderInput("search", "", search, this.handleSearchChange, "text", errors, false, true, (e) => onKeyPress(e, 27, () => this.handleResetSearch()), "Enter Steam ID or alias")}
        {/* {this.renderCheckbox("filterFullBan", "Filter Full Ban", filter.filterFullBan, this.onFilterParams)} */}
        <span>{this.renderButton("Clear", "btn-sm btn-secondary mt-3", this.handleResetSearch)}</span>
      </Row>
    );
  }

  renderNavTabAddUser = () => {
    const { steamId, comments, fullBan, alias, classification } = this.state.newEntry;
    const { errors } = this.state;
    const { user } = this.props;
    
    return (
      <Row addToRowClass="pt-3" customColClass="col-md-10 offset-md-1">
        {(user && user.isAdmin) && (<React.Fragment>
          <span>{this.renderInput("steamId", null, steamId, this.handleChange, "text", errors, false, true, (e) => onKeyPress(e, 13, () => this.handleSave()), "Steam ID", "mb-2")}</span>
          <span>{this.renderInput("alias", null, alias, this.handleChange, "text", errors, false, false, (e) => onKeyPress(e, 13, () => this.handleSave()), "Alias", "mb-2")}</span>
          <span>{this.renderDropdown("classification", "form-control form-control-sm mb-2", { padding: "10px" }, null, null, classification, this.handleChange, this.classifications, "code", "label", "Classification")}</span>
          <span>{this.renderInput("comments", null, comments, this.handleChange, "text", errors, false, false, (e) => onKeyPress(e, 13, () => this.handleSave()), "Comments")}</span>
          {/* <span>{this.renderCheckbox("fullBan", "Full Ban", fullBan, this.handleChange)}</span> */}
          <span>{this.renderButton("Add", "btn-sm btn-primary mr-2 mt-3", () => this.handleSave())}</span>
          <span>{this.renderButton("Clear", "btn-sm btn-secondary mr-2 mt-3", this.handleResetAddUserForm)}</span>
          <span>{this.renderButton("Today's auto-kick, Cass 1, rush", "btn-sm btn-primary mt-3 float-right", () => this.handleSave(true))}</span>
        </React.Fragment>)}
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
          addToClass="justify-content-center"
        />
      </Row>
    );
  }

  renderSearchResultInfo = count => {
    return (
      <small className="text-muted pb-2">
        <span className="float-right">
        <i className="fa fa-comment" aria-hidden="true"></i> - Hover over name to read comments
        </span>
        Found <span className="font-weight-bold">{count}</span> player(s)
      </small>
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
    const classification = this.getClassification(player);
    const label = (classification) ? classification.label : "";

    return (
      <span className="badge badge-pill badge-secondary">{label}</span>
    );
  }

  renderPlayerNameLabel = player => {
    const { alias, steamId } = player;
    let css = {};

    const classification = this.getClassification(player);
    if (classification) css = { ...classification.css };
    css = this.setSingleAutoKickClassification(player, css);

    if (alias[0] === "") {
      const emptyAlias = "Empty Alias";

      return (
        <Link to={"/cassandraplayers" + "/" + steamId}>
          <span>{emptyAlias}</span>
        </Link>
      );
    }
    
    return (
      <React.Fragment>
      {alias.map((name, index) => {
        return (
          <Link key={index} to={"/cassandraplayers" + "/" + steamId}>
            <span className="badge badge-pill badge-secondary mr-1" style={css} title={player.comments}>
              {name}
            </span>
          </Link>
        );
      })}
      {player.comments && <i className="fa fa-comment" aria-hidden="true"></i>}
      </React.Fragment>
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

  handleTableColumnSort = columnLabel => {
    let data = [ ...this.state.data ];
    let columnSort = !this.state.columnSort;
    let columnSortColumn = this.state.columnSortColumn;

    // Get object property from the array of users.
    const dictionary = {
      "Steam ID": "steamId",
      "Classification": "classification",
      "Full Ban": "fullBan",
      "Kicks": "kicks",
      "Bans": "bans"
    };

    // Look up object property to sort from the array of users.
    const columnName = dictionary[columnLabel];

    if (!columnName) return;

    // Reset the reverse sort if switching columns.
    if (columnSortColumn !== columnLabel) columnSort = !columnSort;

    // Reverse the sort.
    const order = (columnSort) ? -1 : 1;

    // Sort.
    data = data.sort((a, b) => (a[columnName] < b[columnName]) ? -1 * order : 1 * order);

    // console.log(columnSortColumn);

    if (this._isMounted) {
      this.setState({ data, columnSort, columnSortColumn: columnLabel });
    }
  }

  renderPlayersTable = (players, count) => {
    return (
      <Row customColClass="col-md-10 offset-md-1 pt-4">
        {this.renderSearchResultInfo(count)}
        <table className="table table-sm table-striped">
          <TableHead
            colHead={[
                "Steam ID",
                "Aliases",
                "Classification",
                "Full Ban",
                "Kicks",
                "Bans"
            ]}
            onColumnSort={this.handleTableColumnSort}
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

  setFilteredSearchInputData = ({ length }) => {
    const { data, filteredData } = this.state;

    return (length > 2) ? filteredData : data;
  }

  setTemporaryCustomFilters = players => {
    // players = players.filter(p => (p.classification !== "00"));
    // players = players.filter(p => (p.classification !== "01"));
    // players = players.filter(p => (p.classification !== "02"));
    // players = players.filter(p => (p.classification === "05"));
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

    return players;
  }

  handleFillUserForm = (player, dbPlayerExists = false) => {
    const { steamId, steamName } = player;
    const { data, pageSize } = this.state;
    const currentPage = getLastPage(data, pageSize);
    window.scrollTo(0, 0);

    if (dbPlayerExists) {
      this.setState({ tab: "search", search: steamId }, () => this.handleSearch({ value: steamId }));
    } else {
      const newEntry = { ...this.state.newEntry };
      newEntry.steamId = steamId;
      newEntry.alias = steamName.replace(/[^0-9a-zA-Z_\-\(\)\.\s\[\]\=]/g, "").toLowerCase().trim();
      
      this.setState({ newEntry, tab: "adduser", search: "", currentPage });
    }
  }

  renderCassandraLog = allPlayers => {
    const { user } = this.props;

    return (
      <Row customColClass="col-md-10 offset-md-1 pt-3">
        <Container style={{ backgroundColor: "bg-secondary",
                            marginBottom: "0",
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            borderRadius: "6px"
                          }}>
        <CassandraLog allPlayers={allPlayers} onFillUserForm={this.handleFillUserForm} user={user} />
      </Container>
      </Row>
    );
  }

  render() {
    const bannerInfo = { title: "Player Profiles" };
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const { search, currentPage, pageSize } = this.state;
    let { data: players, loading } = this.state;
    const allPlayers = this.state.data;

    // Return a search of the filtered data input in the search bar
    players = this.setFilteredSearchInputData(search);

    // Apply temporary filters. Precursor to advanced search bar.
    players = this.setTemporaryCustomFilters(players);

    // Get total player count after filters
    const { length: count } = players;
    
    // Get results for the current page user is viewing
    players = paginate(players, currentPage, pageSize);
    
    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
          
          <LoadingWrapper loading={loading}>
            {this.renderNavTabLinks()}
            {this.renderNavTabContent()}
            {this.renderPlayersTable(players, count)}
            {this.renderPagination(count, currentPage, pageSize)}
      
            {allPlayers.length > 0 && this.renderCassandraLog(allPlayers)}
          </LoadingWrapper>

        </Container>
      </React.Fragment>
    );
  }
}

export default CassandraPlayers;