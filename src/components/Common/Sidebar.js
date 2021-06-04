import React from "react";

export const TabItems = {
  all: "all",
  epl: "epl",
  lol: "lol",
  dota: "dota 2",
};
export const TabName = {
  all: "All matches",
  epl: "English Premier League",
  lol: "LOL",
  dota: "Dota 2",
};

const Sidebar = (props) => {
  const { value, setValue } = props;
  const tabItems = Object.keys(TabItems).map((el, id) => (
    <button
      key={id}
      className={`tablinks ${value === TabItems[el] ? "active" : ""}`}
      onClick={() => setValue && setValue(TabItems[el])}
    >
      <span className="tab-list bold">{TabName[el]}</span>
    </button>
  ));
  return (
    <div
      className="tab wow fadeInUp"
      data-wow-duration="1s"
      data-wow-delay="0s"
    >
      {tabItems}
    </div>
  );
};

export default Sidebar;
