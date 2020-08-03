import React, { Component } from 'react';
import { getCurrentPlayers } from '../services/fakeServers';

class CassandraLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      server: {}
    }
  }

  async componentDidMount() {
    const { data: result } = await getCurrentPlayers();
    const server = this.formatRawServerData(result);
    this.setState({ server });
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
    uptime = uptime.substring(uptime.indexOf("Connect:") + 8);

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
    server.uptime = this.getUptime(rawServerData[7]);
    server.ip = this.getIp(rawServerData[7]);
    const rawPlayersData = this.getPlayers(rawServerData[8]);
    server.players = this.formatPlayers(rawPlayersData);

    return server;
  }

  renderCurrentPlayers = players => {
    return (
      players.map((player, index) => {
        return (
          <span
            key={index}
            className="badge badge-pill badge-secondary mr-1"
            onClick={() => this.props.onFillUserForm(player)}
            style={{ cursor: "pointer" }}
          >
            {player.steamName}
          </span>
        );
      })
    );
  }
  
  render() {
    const { players } = this.state.server;

    return (
      <div>{players && this.renderCurrentPlayers(players)}</div>
    );
  }
}
 
export default CassandraLog;