import React from "react";

export const TabItems = {
  all: "all",
  epl: "epl",
  laliga: "laliga",
  bundesliga: "bundesliga",
  italiaseriea: "italiaseriea",
  lol: "lol",
  dota: "dota 2",
  nba: "nba",
};

export const TabName = {
  all: "All matches",
  epl: "English Premier League",
  laliga: "La Liga",
  bundesliga: "Bundesliga",
  italiaseriea: "Italia Serie A",
  lol: "League of Legends",
  dota: "Dota 2",
  nba: "NBA",
};

const Sidebar = (props) => {
  const { value, setValue } = props;
  return (
    <div
      className="tab wow fadeInUp"
      data-wow-duration="1s"
      data-wow-delay="0s"
    >
      <div className="row ">
        <button
          className={`tablinks ${value === TabItems["all"] ? "active" : ""}`}
          onClick={() => setValue && setValue(TabItems["all"])}
        >
          <span className="tab-list bold">{TabName["all"]}</span>
        </button>
      </div>

      <div className="row ">
        <button
          type="button"
          className={`dropdown-toggle tablinks ${
            value === TabItems["epl"] ||
            value === TabItems["laliga"] ||
            value === TabItems["bundesliga"] ||
            value === TabItems["italiaseriea"]
              ? "active"
              : ""
          }`}
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="tab-list bold">Soccer</span>
        </button>
        <div class="dropdown-menu" style={{ backgroundColor: "#021025" }}>
          <button
            className={`tablinks ${value === TabItems["epl"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["epl"])}
          >
            <span className="tab-list bold">{TabName["epl"]}</span>
          </button>
          <button
            className={`tablinks ${
              value === TabItems["laliga"] ? "active" : ""
            }`}
            onClick={() => setValue && setValue(TabItems["laliga"])}
          >
            <span className="tab-list bold">{TabName["laliga"]}</span>
          </button>
          <button
            className={`tablinks ${
              value === TabItems["bundesliga"] ? "active" : ""
            }`}
            onClick={() => setValue && setValue(TabItems["bundesliga"])}
          >
            <span className="tab-list bold">{TabName["bundesliga"]}</span>
          </button>
          <button
            className={`tablinks ${
              value === TabItems["italiaseriea"] ? "active" : ""
            }`}
            onClick={() => setValue && setValue(TabItems["italiaseriea"])}
          >
            <span className="tab-list bold">{TabName["italiaseriea"]}</span>
          </button>
        </div>
      </div>

      <div className="row">
        <button
          type="button"
          className={`dropdown-toggle tablinks ${
            value === TabItems["lol"] || value === TabItems["dota"]
              ? "active"
              : ""
          }`}
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="tab-list bold">Esprots</span>
        </button>
        <div class="dropdown-menu" style={{ backgroundColor: "#021025" }}>
          <button
            className={`tablinks ${value === TabItems["lol"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["lol"])}
          >
            <span className="tab-list bold">{TabName["lol"]}</span>
          </button>
          <button
            className={`tablinks ${value === TabItems["dota"] ? "active" : ""}`}
            onClick={() => setValue && setValue(TabItems["dota"])}
          >
            <span className="tab-list bold">{TabName["dota"]}</span>
          </button>
        </div>
      </div>

      <div className="row ">
        <button
          className={`tablinks ${value === TabItems["nba"] ? "active" : ""}`}
          onClick={() => setValue && setValue(TabItems["nba"])}
        >
          <span className="tab-list bold">{TabName["nba"]}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
