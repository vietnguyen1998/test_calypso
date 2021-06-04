import React from "react";
import { roundNumber, timestampToLocalDate } from "../../utils/Utils";
import { Link } from "react-router-dom";
import { SupportedCoins } from "../../const/Const";

const FeaturePool = (props) => {
  const { pool, delay } = props;
  const game = pool.game || {};
  const currency = SupportedCoins.find((el) => el.value == pool.currency) || {};
  return (
    <div className="col-md-4" align="center">
      <div
        className="border-box mb-4 wow fadeInUp"
        data-wow-duration="1s"
        data-wow-delay={`${delay || 0.2}s`}
      >
        <h3 className="white">
          {timestampToLocalDate(game.date - 3600, "D MMM YYYY - H:mm")}
        </h3>
        <div className="row mt-3">
          <div className="col-md-5 col-5" align="center">
            <div className="team-circle" align="center">
              <img className="team-img" src={game.logo1} />
            </div>
            <p style={{ height: "40px" }} className="team-name mt-2">
              {game.team1}
            </p>
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
            <p style={{ height: "40px" }} className="team-name mt-2">
              {game.team2}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-6">
            <p className="grey small-text mb-0">Max cap</p>
            <p className="yellow small-text bold">
              {roundNumber(pool.maxCap)} {currency.label}
            </p>
          </div>
          <div className="col-md-6 col-6">
            <p className="grey small-text mb-0">Play size</p>
            <p className="yellow small-text bold">
              {roundNumber(pool.total) || 0} {currency.label}
            </p>
          </div>
        </div>
        <button
          style={{ width: "100%" }}
          className="rounded-yellow-btn mb-2 black"
        >
          <Link
            to={`/pools/${pool._id}`}
            className="black"
            style={{ textDecoration: "none" }}
          >
            Pool details
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FeaturePool;
