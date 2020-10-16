import React, { Component } from 'react';
import { getCurrentPlayers } from '../services/serverInfoService';
// import { pause } from './common/utils';
import PlayerProfileUtils from './playerProfileUtils';
import _ from 'lodash';
import { renderLoadingIndicator } from './common/loading';
import LoadingWrapper from './common/loadingWrapper';

class CassLog extends PlayerProfileUtils {
  constructor(props) {
    super(props);

    this.state = {
      emptyServerMessage: "",
      hasShownCurrentPlayers: false,
      loading: false,
      refreshSpinner: false,
      servers: []
    }
  
    this._isMounted = false;
  }

  componentDidMount() {
    // Uncomment to auto load Current Players
    // this.handleShowCurrentPlayers();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  startPopulatingCurrentPlayers = () => {
    this._isMounted = true;
    const refreshSpinner = true;

    if (this._isMounted) {
      this.setState(
        { refreshSpinner },
        () => this.populateCurrentPlayers()
      );
    }
  }

  populateCurrentPlayers = async () => {
    // await pause(2);
    const { data: servers } = await getCurrentPlayers();
    let emptyServerMessage = "";

    const loading = false;
    const refreshSpinner = false;

    if (servers.length < 1) emptyServerMessage = "No servers found.";
    
    for (let i = 0; i < servers.length; i++) {
      try {
        servers[i].players = this.setPlayerClassification(servers[i].players);
        if (servers[i].players.length < 2) continue;
        servers[i].players = this.sortPlayersByClassification(servers[i].players);
      } catch (ex) {
        console.error(`Invalid server data. Server: ${i}`);
      }
    }
    
    this.setState({ servers, loading, refreshSpinner, emptyServerMessage });
  }

  getPlayerFromDb = steamId => {
    const { allPlayers } = this.props;
    
    const player = allPlayers.find(player => player.steamId === steamId);

    return player;
  }

  setPlayerClassification = players => {
    for (let i = 0; i < players.length; i++) {
      const dbPlayer = this.getPlayerFromDb(players[i].steamId);

      players[i].classification = !(_.isEmpty(dbPlayer))
                                ? dbPlayer.classification
                                : "99"; // 99 will sort last
    }

    return players;
  }

  sortPlayersByClassification = players => {
    return players.sort((a, b) => (a.classification > b.classification) ? 1 : -1);
  }

  renderRefreshSpinnerButton = (loading, refreshSpinner) => {
    if (loading) return;
    if (!refreshSpinner) return;

    return (
      <button className="btn-sm btn-primary mb-2 float-right" type="button" disabled>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span className="sr-only">Loading...</span>
      </button>
    )
  }

  renderServer = ({ title, playerCount, players, uptime }) => {
    const customClass = "badge badge-pill badge-secondary mr-2 mb-1";
    const { user } = this.props;

    return (
      <React.Fragment>
        <div>
          <span>{title}</span>
          <span> Players: <span className="font-weight-bold">{playerCount}</span></span>
          <span> Uptime: <span className="font-weight-bold">{uptime}</span></span>
        </div>

        {players.length > 0 && players.map((player, index) => {
          const classification = this.getClassification(player);
          let css = {};
          if (classification) css = classification.css;

          if (user && user.isAdmin) {
            _.set(css, ["cursor"], "pointer");
          } else {
            if (!_.isEmpty(classification)) {
              _.set(css, ["cursor"], "pointer");
            }
          }
          
          // Help distinguish between "L" and "I".
          _.set(css, ["fontFamily"], "monospace");
          _.set(css, ["fontSize"], "14px");

          if (!(_.isEmpty(classification))) {
            return (
              <span
                key={index}
                className={customClass}
                onClick={() => this.props.onFillUserForm(player, true)}
                style={css}
                title="Click to find user"
              >
                <i className="fa fa-search" aria-hidden="true"></i>
                &nbsp;{player.steamName}
              </span>
            );
          }

          return (
            <span key={index}
            className={customClass}
            >
              <span
                onClick={() => (user && user.isAdmin) && (this.props.onFillUserForm(player))}
                style={css}
                title="Click to auto-fill new user or click the Steam icon to view Steam profile"
              >
                {(user && user.isAdmin) && (<i className="fa fa-plus" aria-hidden="true"></i>)}
                <span> {player.steamName}</span>
              </span>
              {this.renderSteamIdLabel(player)}
            </span>
          );
        })}
        
      </React.Fragment>
    );
  }

  renderSteamIdLabel = ({ steamId }) => {
    const link = "https://steamcommunity.com/profiles/" + steamId;

    return (
      <span>
        <a className="ml-2" target="_blank" rel="noopener noreferrer" href={link}>
          <i className="fa fa-steam-square" style={{ color: "black" }} aria-hidden="true"></i>
        </a>
      </span>
    );
  }

  renderServerMain = () => {
    const { servers } = this.state;
    const { user } = this.props;
    const adminNote = (user && user.isAdmin)
                    ? " or a gray pill to auto-fill the new user form"
                    : "";
                    
    const note = `Select an non-gray pill to auto-fill the search 
                bar${adminNote}. Select the Steam icon to open the player's 
                Steam profile in a new tab.
               `;

    return (
      <div>
        <small className="text-muted pb-2">
          {note}
        </small>
        <hr/>
        {servers.length > 0 && servers.map((server, index) => {
          return (
            <span key={index}>{this.renderServer(server)}</span>
          );
        })}
      </div>
    );
  }

  handleShowCurrentPlayers = () => {
    this._isMounted = true;
    const hasShownCurrentPlayers = true;
    const loading = true;

    if (this._isMounted) {
      this.setState(
        { hasShownCurrentPlayers, loading },
        () => this.populateCurrentPlayers()
      );
    }
  }
  
  render() {
    const {
      loading,
      refreshSpinner,
      hasShownCurrentPlayers,
      emptyServerMessage
    } = this.state;
    
    return (
      <React.Fragment>
        {this.renderRefreshSpinnerButton(loading, refreshSpinner)}

        {!loading
          && hasShownCurrentPlayers
          && !refreshSpinner
          && this.renderButton("", "btn-sm btn-primary mb-2 float-right", this.startPopulatingCurrentPlayers, null, "fa-refresh")
        }

        {!hasShownCurrentPlayers && this.renderButton("Show", "btn-sm btn-primary mb-2 float-right", this.handleShowCurrentPlayers)}
        <h4>Server Player List - Cassandra Confluvium</h4>

        {loading && renderLoadingIndicator()}
        {!loading && hasShownCurrentPlayers && this.renderServerMain()}
        {emptyServerMessage}
      </React.Fragment>
    );
  }
}
 
export default CassLog;