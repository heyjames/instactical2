import React from 'react';
import { Link } from 'react-router-dom';
import Joi from 'joi-browser';
import moment from 'moment';
// import _ from 'lodash';
import { getPlayerProfiles, createPlayerProfile } from '../../services/playerProfileService';
import Banner from '../navigation/banner';
import PlayerProfileUtils from './playerProfileUtils';
import Pagination from '../common/pagination';
import { paginate, getLastPage } from '../../utils/paginate';
import { onKeyPress, sortByOrderArray, sortByOrder } from '../../utils/utils';
import Row from '../common/row';
import TableHead from '../common/tableHead';
import TableBodyRows from '../common/tableBodyRows';
import Container from '../common/container';
import LoadingWrapper from '../common/loadingWrapper';
import CassLog from './cassLog';

class PlayerProfiles extends PlayerProfileUtils {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      filteredData: [],
      search: "",
      customFilter: false,
      filter: {
        admin: false,
        mod: false,
        regular: false,
        moderatelyCompliant: false,
        kickedButReformed: false,
        uncategorized: false,
        concern: false,
        kicked: false,
        unbanned: false,
        banned: false,
        fullBan: false,
        hasComments: false
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
      sortColumnDesc: false,
      sortColumnName: ""
    };
  
    this._isMounted = false;
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    this._isMounted = true;
    document.title = "Player Profiles - insTactical";
    
    try {
      // await pause(2);
      const data = await getPlayerProfiles();
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

  resetSearchCheckboxFilters = filter => {
    Object.keys(filter).forEach(name => {
      filter[name] = false;
    });

    return filter;
  }

  handleResetSearch = () => {
    const { data, pageSize } = this.state;
    let filter = { ...this.state.filter };
    
    const search = "";
    const currentPage = getLastPage(data, pageSize);

    // Set this.state.filter values to false
    filter = this.resetSearchCheckboxFilters(filter);

    this.setState({ filter, search, currentPage });
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
      const newEntry = this.mapToObjectModel({ ...this.state.newEntry });

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
      
      await createPlayerProfile(newEntry);

      const data = await getPlayerProfiles();
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
    let filter = { ...this.state.filter };

    // Set this.state.filter values to false
    filter = this.resetSearchCheckboxFilters(filter);

    this.setState({ search: input.value, filter });
    
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

  handleEdit = steamId => {
    this.props.history.push("/playerprofiles/" + steamId);
  }
  
  handlePageChange = currentPage => {
    this.setState({ currentPage });
  }

  handleNavTabChange = ({ target }) => {
    const { id } = target;
    const { data, pageSize } = this.state;
    let filter = { ...this.state.filter };
    const currentPage = getLastPage(data, pageSize);

    switch (id) {
      case "search-tab":
        this.setState({ tab: "search" });
        break;
      case "adduser-tab":
        filter = this.resetSearchCheckboxFilters(filter);
        this.setState({ tab: "adduser", search: "", currentPage, filter });
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
    const { user } = this.props;
    
    return (
      <ul className="nav nav-tabs col-md-10 offset-md-1" id="myTab" role="tablist">
        <li className="nav-item">
          <button
            className={"nav-link" + this.getNavTabClass("search")}
            style={{ outline: 0 }}
            id="search-tab"
            onClick={this.handleNavTabChange}
          >
            Search
          </button>
        </li>

        {(user && user.isAdmin) && (<li className="nav-item">
          <button
            className={"nav-link" + this.getNavTabClass("adduser")}
            style={{ outline: 0 }}
            id="adduser-tab"
            onClick={this.handleNavTabChange}
          >
            Add User
          </button>
        </li>)}
      </ul>
    );
  }

  renderNavTabSearch = () => {
    const { errors, search } = this.state;
    
    return (
      <Row customColClass="col-md-10 offset-md-1 pt-3">
        {this.renderInput("search", "", search, this.handleSearchChange, "text", errors, false, true, (e) => onKeyPress(e, 27, () => this.handleResetSearch()), "Enter Steam ID or alias")}
        <span>{this.renderButton("Clear", "btn-sm btn-secondary mt-3", this.handleResetSearch)}</span>
        {this.renderFilterButtons()}
      </Row>
    );
  }

  onFilterParams = filterName => {
    let { currentPage, data, pageSize } = this.state;
    const filter = { ...this.state.filter };
    let customFilter = true;

    // Loop through each property in filter and set to false except filterName,
    // which should alternate boolean value. Allows only one filter to be on.
    Object.keys(filter).forEach(name => {
      filter[name] = (name === filterName) ? !filter[name] : false;
    });

    // Go to first page for results from filtering your search.
    if (currentPage !== 1) currentPage = 1;

    // Reset custom filter boolean to false if unchecking current filter
    // checkbox. Then return the current page to the last page of all results.
    if (filter[filterName] === false) {
      customFilter = false;
      currentPage = getLastPage(data, pageSize);
    }

    // Clear search input.
    const search = "";
    
    if (this._isMounted) {
      this.setState({ filter, customFilter, currentPage, search });
    }
  }

  renderFilterButtons = () => {
    const { filter } = this.state;

    return (
      <React.Fragment>
        {this.renderSearchCheckbox("filterAdmin", "Admin", filter.admin, () => this.onFilterParams("admin"))}
        {this.renderSearchCheckbox("filterModerator", "Moderator", filter.mod, () => this.onFilterParams("mod"))}
        {this.renderSearchCheckbox("filterRegular", "Regular", filter.regular, () => this.onFilterParams("regular"))}
        {this.renderSearchCheckbox("filterModCom", "Moderately Compliant", filter.moderatelyCompliant, () => this.onFilterParams("moderatelyCompliant"))}
        {this.renderSearchCheckbox("filterKickedButReformed", "Kicked But Reformed", filter.kickedButReformed, () => this.onFilterParams("kickedButReformed"))}
        {this.renderSearchCheckbox("filterUncategorized", "Uncategorized", filter.uncategorized, () => this.onFilterParams("uncategorized"))}
        {this.renderSearchCheckbox("filterConcern", "Concern", filter.concern, () => this.onFilterParams("concern"))}
        {this.renderSearchCheckbox("filterKicked", "Kicked", filter.kicked, () => this.onFilterParams("kicked"))}
        {this.renderSearchCheckbox("filterUnbanned", "Unbanned", filter.unbanned, () => this.onFilterParams("unbanned"))}
        {this.renderSearchCheckbox("filterBanned", "Banned", filter.banned, () => this.onFilterParams("banned"))}
        {this.renderSearchCheckbox("filterFullBan", "Full Ban", filter.fullBan, () => this.onFilterParams("fullBan"))}
        {this.renderSearchCheckbox("filterHasComments", "Has Comments", filter.hasComments, () => this.onFilterParams("hasComments"))}
      </React.Fragment>
    )
  }

  renderNavTabAddUser = () => {
    const { steamId, comments, alias, classification } = this.state.newEntry;
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
          <span>{this.renderButton("Auto-fill w/ auto-kick, Cass 1, rush, today", "btn-sm btn-primary mt-3 float-right", () => this.handleSave(true))}</span>
        </React.Fragment>)}
      </Row>
    );
  }

  renderNavTabContent = () => {
    const { tab } = this.state;

    switch (tab) {
      case "search":
        return this.renderNavTabSearch();
      case "adduser":
        return this.renderNavTabAddUser();
      default:
        return this.renderNavTabSearch();
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
        <Link to={"/playerprofiles/" + steamId}>
          <span>{emptyAlias}</span>
        </Link>
      );
    }
    
    return (
      <React.Fragment>
      {alias.map((name, index) => {
        return (
          <Link key={index} to={"/playerprofiles/" + steamId}>
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
    let { sortColumnDesc, sortColumnName } = this.state;

    if (data.length < 2) return;

    // Get object property from the array of users.
    const dictionary = {
      "Classification": "classification",
      "Full Ban": "fullBan",
      "Kicks": "kicks",
      "Bans": "bans"
    };

    // Look up object property to sort from the array of users.
    const columnName = dictionary[columnLabel];
    if (!columnName) return;

    // Reset sort order to ascending when switching to a different column.
    // Alternate sort order if the same column is selected.
    sortColumnDesc = (sortColumnName !== columnName) ? false : !sortColumnDesc;

    // Reverse the sort order if user selects the same column.
    const order = (sortColumnDesc) ? -1 : 1;

    // Property type sort.
    if (Array.isArray(data[0][columnName])) {
      data = data.sort(sortByOrderArray(columnName, order));
    } else {
      data = data.sort(sortByOrder(columnName, order));
    }

    if (this._isMounted) {
      this.setState({ data, sortColumnDesc, sortColumnName: columnName });
    }
  }

  renderPlayersTable = (players, count) => {
    return (
      <Row customColClass="col-md-10 offset-md-1 pt-4">
        {this.renderSearchResultInfo(count)}
        <table className="table table-sm table-striped">
          <TableHead
            colHead={{
              "Steam ID": false,
              "Aliases": false,
              "Classification": true,
              "Full Ban": true,
              "Kicks": true,
              "Bans": true
            }}
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
    if (this.state.filter.hasComments === true) {
      players = players.filter(p => (p.comments.length > 0));

      return players;
    }

    if (this.state.filter.fullBan === true) {
      players = players.filter(p => (p.fullBan === true));
      
      return players;
    }

    // Search for types contained in the Classifications array.
    for (const type in this.state.filter) {
      if (this.state.filter[type] === true) {
        players = players.filter(p => (p.classification === this.getCodeFromType(type)));
      }
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
      newEntry.alias = steamName.replace(/[^0-9a-zA-Z_\-().\s[\]=]/g, "").toLowerCase().trim();
      
      this.setState({ newEntry, tab: "adduser", search: "", currentPage });
    }
  }

  renderCassLog = allPlayers => {
    const { user } = this.props;

    return (
      <Row customColClass="col-md-10 offset-md-1 pt-3">
        <Container style={{ backgroundColor: "bg-secondary",
                            marginBottom: "0",
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            borderRadius: "6px"
                          }}>
        <CassLog allPlayers={allPlayers} onFillUserForm={this.handleFillUserForm} user={user} />
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

    // Return a search of the filtered data input in the search bar.
    // Will either return filteredData or data.
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

            {allPlayers.length > 0 && this.renderCassLog(allPlayers)}
          </LoadingWrapper>

        </Container>
      </React.Fragment>
    );
  }
}

export default PlayerProfiles;