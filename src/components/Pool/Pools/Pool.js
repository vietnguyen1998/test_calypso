import React from "react";
import { useHistory } from "react-router";
import { etherscan } from "../../../config";
import { SupportedCoins } from "../../../const/Const";
import {
  roundNumber,
  timestampToLocalDate,
  getOdds,
} from "../../../utils/Utils";
import TutorialPopup from "../../Common/TutorialPopup";

const Pool = (props) => {
  const { pool, delay, address } = props;
  const game = pool.game || {};
  const history = useHistory();
  const currency = SupportedCoins.find((el) => el.value == pool.currency) || {};

  const odds = () => {
    let betAmounts = [];
    if (pool && pool.bets.length != 0) {
      for (let index = 0; index < 3; index++) {
        betAmounts.push(
          pool.bets.reduce(
            (acc, cur) =>
              cur.side == index + 1 ? acc + Number(cur.amount) : acc,
            0
          )
        );
      }
      return (
        <p className="white small-text text-wrap">{`Split ${getOdds(
          betAmounts
        )}`}</p>
      );
    }
  };

  return (
    <div
      className="row pool-list wow fadeInUp"
      data-wow-duration="1s"
      data-wow-delay={`${delay || 0.1}s`}
    >
      <div className="col-md-4">
        <div className="row px-2">
          <div className="col-md-5 col-5" align="center">
            <div className="team-circle" align="center">
              <img
                className="team-img"
                src={game.logo1}
                style={{ maxWidth: "47px" }}
              />
            </div>
            <p className="team-name mt-2">{game.team1}</p>
          </div>
          <div
            className="col-md-2 col-2 mt-3"
            style={{ padding: "0px" }}
            align="center"
          >
            <i style={{ color: "#374862", fontSize: "30px" }} className="bold">
              VS
            </i>
          </div>
          <div className="col-md-5 col-5" align="center">
            <div className="team-circle" align="center">
              <img
                className="team-img"
                src={game.logo2}
                style={{ maxWidth: "47px" }}
              />
            </div>
            <p className="team-name mt-2">{game.team2}</p>
          </div>
        </div>
        {pool.result.side != 0 && (
          <div className="row px-2">
            <div className="col-md-12 col-12" align="center">
              <h3 className="white text">
                {pool.result.g1} - {pool.result.g2}
              </h3>
            </div>
          </div>
        )}
      </div>
      <div className="col-md-8">
        <div className="row">
          <div className="col-md-9">
            <p className="white small-text text-wrap">
              {pool.title}{" "}
              <a href={`${etherscan}${pool._id}`} target="_blank">
                <img src="/images/link.png" style={{ width: "15px" }} />
              </a>
            </p>
            <p className="grey small-text text-wrap">{pool.description}</p>
            {pool.isPrivate &&
              pool.whitelist.some(
                (el) => el.toLowerCase() == address.toLowerCase()
              ) && (
                <p className="green small-text text-wrap">
                  You have access to this Private Pool.
                </p>
              )}
            {pool.bets.length > 0 &&
              pool.bets.some(
                (el) => el.bettor.toLowerCase() == address.toLowerCase()
              ) && (
                <p className="yellow small-text text-wrap">
                  You have made a bet in this Pool!
                </p>
              )}{" "}
            {odds()}
          </div>
          <div className="col-md-3">
            <button
              className="border-btn extra-small-text small-border-btn mb-3"
              onClick={() => history.push("/pools/" + pool._id)}
            >
              <span>
                {" "}
                {Math.floor(Date.now() / 1000) - pool.endDate > 0
                  ? "View"
                  : "Join Pool"}
              </span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">
              {timestampToLocalDate(game.date - 3600, "D MMM YYYY")}{" "}
              <TutorialPopup content="Date and time of match in your local time">
                <span className="green small-text mb-0">(?) </span>
              </TutorialPopup>
            </p>
            <p className="bold small-text yellow">
              {timestampToLocalDate(game.date - 3600, "H:mm Z")}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">
              Pool size{" "}
              <TutorialPopup content="Play size - the total bets currently placed by all players">
                <span className="green small-text mb-0">(?)</span>
              </TutorialPopup>
            </p>
            <p className="bold small-text yellow">
              {roundNumber(pool.total || 0)} {currency.label}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">
              Max pool size{" "}
              <TutorialPopup content="Max cap - the maximum bet size which this pool can accept from all players">
                <span className="green small-text mb-0">(?)</span>
              </TutorialPopup>
            </p>
            <p className="bold small-text yellow">
              {roundNumber(pool.maxCap)} {currency.label}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">
              Pool fee{" "}
              <TutorialPopup content="Pool fee - the percentage of winnings which will go to the Pool Creator">
                <span className="green small-text mb-0">(?)</span>
              </TutorialPopup>
            </p>
            <p className="bold small-text yellow">
              {roundNumber(pool.poolFee)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pool;
