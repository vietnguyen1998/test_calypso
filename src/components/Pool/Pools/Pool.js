import React from "react";
import { useHistory } from "react-router";
import { etherscan } from "../../../config";
import { SupportedCoins } from "../../../const/Const";
import { roundNumber, timestampToLocalDate } from "../../../utils/Utils";
import TutorialPopup from "../../Common/TutorialPopup";

const Pool = (props) => {
  const { pool, delay } = props;
  const game = pool.game || {};
  const history = useHistory();
  const currency = SupportedCoins.find((el) => el.value == pool.currency) || {};

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
              <img className="team-img" src={game.logo1} />
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
              <img className="team-img" src={game.logo2} />
            </div>
            <p className="team-name mt-2">{game.team2}</p>
          </div>
        </div>
        {pool.result.side != undefined && (
          <>
            <div>
              <h3 className="white text" style={{ marginLeft: "75px" }}>
                {pool.result.g1} - {pool.result.g2}
              </h3>
            </div>
          </>
        )}
      </div>
      <div className="col-md-8">
        <div className="row">
          <div className="col-md-9">
            <a href={`${etherscan}${pool._id}`} target="_blank">
              <p className="grey small-text text-wrap mb-0">{pool._id}</p>
            </a>
            <p className="white small-text text-wrap">{pool.title}</p>
            <p className="grey small-text text-wrap">{pool.description}</p>
          </div>
          <div className="col-md-3">
            <button
              className="border-btn extra-small-text small-border-btn mb-3"
              onClick={() => history.push("/pools/" + pool._id)}
            >
              <span> {pool.result.side > 0 ? "View" : "Join Pool"}</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">
              {timestampToLocalDate(game.date - 3600, "D MMM YYYY")}
            </p>
            <TutorialPopup content="[date] - Date of match">
              <p className="green small-text mb-0">(?)</p>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {timestampToLocalDate(game.date - 3600, "H:mm Z")}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">Max cap</p>

            <TutorialPopup content="Max cap - the maximum bet size which this pool can accept from all players">
              <p className="green small-text mb-0">(?)</p>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.maxCap)} {currency.label}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">Play size</p>
            <TutorialPopup content="Play size - the total bets currently placed by all players">
              <p className="green small-text mb-0">(?)</p>
            </TutorialPopup>
            <p className="bold small-text yellow">
              {roundNumber(pool.total || 0)} {currency.label}
            </p>
          </div>
          <div className="col-md-3 col-6">
            <p className="grey small-text mb-0">Pool fee</p>
            <TutorialPopup content="Pool fee - the percentage of winningswhich will goto the Pool Creator">
              <p className="green small-text mb-0">(?)</p>
            </TutorialPopup>
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
