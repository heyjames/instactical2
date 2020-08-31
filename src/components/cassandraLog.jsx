import React, { Component } from 'react';
import { getCurrentPlayers } from '../services/fakeServers';
import { pause } from './common/utils';
import PlayerProfileUtils from './playerProfileUtils';
import _ from 'lodash';
import { renderLoadingIndicator } from './common/loading';

class CassandraLog extends PlayerProfileUtils {
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
    // this.handleShowCurrentPlayers(); // Uncomment to auto load Current Players
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  startPopulatingCurrentPlayers = () => {
    this._isMounted = true;

    if (this._isMounted) {
      this.setState({ refreshSpinner: true }, () => this.populateCurrentPlayers());
    }
  }

  populateCurrentPlayers = async () => {
    // await pause(2);
    const { data } = await getCurrentPlayers();
    const servers = [];
    let emptyServerMessage = "";

    for (let i = 0; i < data.length; i++) {
      const formattedServer = this.formatRawServerData(data[i]);
      servers.push(formattedServer);
    }

    const loading = false;
    const refreshSpinner = false;

    if (servers.length < 1) {
      emptyServerMessage = "No servers found.";
    }
    
    this.setState({ servers, loading, refreshSpinner, emptyServerMessage });
  }

  removeNonBreakingSpace = data => {
    data = data.replace(/&nbsp;/g, "");
    data = data.replace(/&nbsp/g, "");
    return data;
  }

  removeHtmlLineBreakTag = data => {
    return data.replace(/<br>/g, "");
  }

  removeHtmlBoldTag = data => {
    data = data.replace(/<b>/g, "");
    data = data.replace(/<\/b>/g, "");
    return data;
  }

  removeDoubleSpace = data => {
    return data.replace(/\s\s/g, "");
  }

  getTitle = title => {
    return this.removeHtmlBoldTag(title).trim();
  }

  getSubtitle = subtitle => {
    return this.removeHtmlLineBreakTag(subtitle).trim();
  }

  getSid = sid => {
    return sid.substring(8).trim();
  }

  getMap = map => {
    map = this.removeNonBreakingSpace(map);
    map = this.removeHtmlLineBreakTag(map);
    map = this.removeDoubleSpace(map);
    map = map.substring(map.indexOf("Map:") + 4);
    
    return map.trim();
  }

  getPlayerCount = playerCount => {
    playerCount = this.removeNonBreakingSpace(playerCount);
    playerCount = this.removeHtmlLineBreakTag(playerCount);
    playerCount = this.removeDoubleSpace(playerCount);
    playerCount = playerCount.substring(playerCount.indexOf("Players:") + 8);
    playerCount = playerCount.substring(0, 2).trim();

    return parseInt(playerCount);
  }

  getCurrentObjective = currentObjective => {
    currentObjective = this.removeNonBreakingSpace(currentObjective);
    currentObjective = this.removeHtmlLineBreakTag(currentObjective);
    currentObjective = this.removeDoubleSpace(currentObjective);
    currentObjective = currentObjective.substring(currentObjective.indexOf("Status:") + 7);

    return currentObjective.trim();
  }

  getUptime = uptime => {
    uptime = this.removeHtmlLineBreakTag(uptime);
    uptime = this.removeNonBreakingSpace(uptime);
    uptime = uptime.substring(uptime.indexOf("Connect:") + 8);
    uptime = uptime.substring(0, uptime.indexOf("since"));

    return uptime.trim();
  }

  getIp = ip => {
    ip = this.removeHtmlLineBreakTag(ip);
    ip = ip.substring(ip.indexOf("Connect:") + 8);

    return ip.trim();
  }

  // Create an array from the long string of players
  getPlayers = players => {
    const identifier = "<a href=\"http://steamcommunity.com/profiles/";
    players = players.split(identifier);

    return players.filter(item => /765611/g.test(item));
  }

  getSteamId = steamId => {
    steamId = steamId.substring(0, 17).trim();
    
    return steamId;
  }

  getSteamName = steamName => {
    steamName = steamName.substring(36);
    steamName = steamName.substring(0, steamName.length - 5);
    
    return steamName.trim();
  }

  // Extract Steam ID and and Steam Name into a player object and push to 
  // server.players array
  formatPlayers = rawPlayersData => {
    if (rawPlayersData.length === 0) return rawPlayersData;
    
    const myArray = [];
    for (let i = 0; i < rawPlayersData.length; i++) {
      let player = {};
      player.steamId = this.getSteamId(rawPlayersData[i]);
      player.steamName = this.getSteamName(rawPlayersData[i]);
      myArray.push(player);
    }

    return myArray;
  }

  formatRawServerData = data => {
    const rawServerData = data.split("\n");
    const server = {};
    server.title = this.getTitle(rawServerData[1]);
    server.subtitle = this.getSubtitle(rawServerData[2]);
    server.sid = this.getSid(rawServerData[3]);
    server.map = this.getMap(rawServerData[4]);
    server.playerCount = this.getPlayerCount(rawServerData[5]);
    server.currentObjective = this.getCurrentObjective(rawServerData[5]);
    server.uptime = this.getUptime(rawServerData[6]);
    server.ip = this.getIp(rawServerData[7]);
    
    const playersIndex = rawServerData.findIndex(item => item.includes("<br>Names:"));
    const rawPlayersData = this.getPlayers(rawServerData[playersIndex]);
    const formattedPlayers = this.formatPlayers(rawPlayersData);
    const players = this.setPlayerClassification(formattedPlayers);
    server.players = this.sortPlayersByClassification(players);
    
    return server;
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

  getDbPlayer = steamId => {
    const { allPlayers } = this.props;
    
    const player = allPlayers.find(player => player.steamId === steamId);

    return player;
  }

  setPlayerClassification = players => {
    for (let i = 0; i < players.length; i++) {
      const dbPlayer = this.getDbPlayer(players[i].steamId);

      players[i].classification = !(_.isEmpty(dbPlayer))
                                ? dbPlayer.classification
                                : "99"; // 99 will sort last
    }

    return players;
  }

  renderServer = ({ title, playerCount, players, uptime }) => {
    const customClass = "badge badge-pill badge-secondary mr-2";
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
          let css = classification.css;

          if (css === undefined) css = {};

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
const value = "0 / 50%";
const css = {
  background: "#6c757d",
  width: "150px",
  height: "75px",
  borderTopLeftRadius: "0",
  borderTopRightRadius: "100%",
  borderBottomRightRadius: "100%",
  borderBottomLeftRadius: value
};
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

    return (
      <div>
        <small className="text-muted pb-2">
          Select an existing user to auto-fill the search bar or a new user (gray bubble) to auto-fill the new user form
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

    if (this._isMounted) {
      this.setState({ hasShownCurrentPlayers: true, loading: true }, () => this.populateCurrentPlayers());
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
        <h4>Current Players</h4>

        {loading && renderLoadingIndicator()}
        {!loading && hasShownCurrentPlayers && this.renderServerMain()}
        {emptyServerMessage}
      </React.Fragment>
    );
  }
}
 
export default CassandraLog;