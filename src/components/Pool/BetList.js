import React from "react";
import { connect, useSelector } from "react-redux";
import { timestampToLocalDate } from "../../utils/Utils";
import { BetSides } from "../../const/Const";

const BetList = (props) => {
  const { address, coin, pool } = props;

  const bets = pool.bets || [];
  const game = pool.game || {};
  const items = bets
    .filter((el) => el.bettor.toLowerCase() === address.toLowerCase())
    .map((item, index) => {
      const side =
        item.side == BetSides.team1
          ? { image: game.logo1, name: game.team1 }
          : item.side == BetSides.team2
          ? { image: game.logo2, name: game.team2 }
          : { image: "", name: "Draw" };
      return (
        <div className="col" key={index}>
          <div className="row mt-1 my-bet-table">
            <div className="col-md-4 col-4">
              <span className="black small-text">
                {timestampToLocalDate(item.createdDate)}
              </span>
            </div>
            <div className="col-md-4 col-4">
              <img
                className="team-img my-bet-team-logo mr-2"
                src={side.image}
              />
              <span className="black small-text">{side.name}</span>
            </div>
            <div className="col-md-2 col-2">
              <span className="black small-text">
                {item.amount} {coin}
              </span>
            </div>
            <div className="col-md-2 col-2">
              {item.txId != undefined && (
                <a
                  href={"https://kovan.etherscan.io/tx/" + item.txId}
                  target="_blank"
                >
                  <img src="/images/link.png" style={{ width: "15px" }} />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    });

  return (
    <>
      <p className="bold mt-5">Your Plays</p>
      <div className="col">
        <div className="row mt-3 my-bet-table">
          <div className="col-md-5 col-5">
            <span className="bold grey">Time:</span>
          </div>
          <div className="col-md-3 col-3">
            <span className="bold grey">Team:</span>
          </div>
          <div className="col-md-2 col-2">
            <span className="bold grey">Amount:</span>
          </div>
          <div className="col-md-2 col-2">
            <span className="bold grey">Link:</span>
          </div>
        </div>
      </div>
      {items}
    </>
  );
};

export default connect(null)(BetList);
