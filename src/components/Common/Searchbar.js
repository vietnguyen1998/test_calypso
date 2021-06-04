import React from "react";

export const searchPool = (pool, searchText) => {
  if (searchText === "") return true;
  const game = pool.game;
  const text = [pool.title, pool.description, game.team1, game.team2, pool._id]
    .join("")
    .toLowerCase();
  return text.includes(searchText.toLowerCase());
};

const Searchbar = (props) => {
  const { value, setValue } = props;
  return (
    <>
      <input
        className="search-input"
        type="search"
        placeholder="Search for Pool"
        value={value}
        onChange={(e) => setValue && setValue(e.target.value)}
      />
      <button className="search-btn yellow-btn">
        <i className="fa fa-search"></i>
      </button>
    </>
  );
};

export default Searchbar;
