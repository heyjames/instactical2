import React from 'react';
import _ from 'lodash';

const Server = ({ data }) => {
  return (
    <div className="card shadow-sm rounded" style={{ marginBottom: "4px" }}>
      <div className="card-body">

        <h5>{renderServerStatus(data.status)} - {data.title}</h5>

        {data.status && 
          <React.Fragment>
            <div>
              <span>{data.ip}</span>
              <span className="small text-info noselect"> Copy</span>
            </div>

            <div>
              <span>{data.sid}</span>
              <span className="small text-info noselect"> Copy</span>
            </div>

            <div>
              <span>{data.map} - {data.currentObjective}</span>
            </div>

            <div>
              <span>{data.uptime}</span>
            </div>

            <div>
              <span className="display-4">{data.playerCount}</span>
              <span className="h5"> / {data.maxOccupancy}</span>
            </div>
          </React.Fragment>
        }

        {renderPlayers(data.players)}
      </div>
    </div>
  );
}

const renderPlayers = players => {
  return (
    <div>
      {players.map((player, index) => {
        return (
          <span
            className="badge badge-pill badge-secondary mr-1"
            key={player.steamName + index}
          >
            <a 
              style={{ textDecoration: "none", color: "white", fontSize: "16px" }}
              target="_blank"
              rel="noopener noreferrer"
              href={"https://steamcommunity.com/profiles/" + player.steamId}
            >
              {player.steamName}
            </a>
          </span>
        )
      })}
    </div>
  )
};

const renderServerStatus = status => {
  let renderClass = "font-weight-bold text-";
  let label = ""

  if (status) {
    renderClass += "success";
    label = "Online";
  } else {
    renderClass += "danger";
    label = "Offline";
  }

  return <span className={renderClass}>{label}</span>
};
 
export default Server;