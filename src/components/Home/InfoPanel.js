import React from "react";

const InfoPanel = () => {
  return (
    <>
      <div
        className="bg-img"
        style={{
          backgroundImage: "url(/images/bg-3.jpg)",
          backgroundPosition: "bottom",
        }}
      >
        <div className="container" align="center">
          <br />
          <br />
          <br />
          <br />
          <h2
            className="white bold wow fadeInUp"
            data-wow-duration="1.5s"
            data-wow-delay="0s"
          >
            WHAT IS CALYPSO.BET?
          </h2>
          <br />
          <img
            className="wow fadeInUp"
            data-wow-duration="1.5s"
            data-wow-delay="0s"
            style={{ width: "350px" }}
            src="/images/logo.png"
          />
          <br />
          <br />
          <p
            className="white wow fadeInUp"
            data-wow-duration="1.5s"
            data-wow-delay="0s"
          >
            Calypso.Bet is the world’s first smart contract-based, sports
            betting pool creator. <br />
            <br />
            Unlike traditional sports betting platforms, where odds are
            determined by opaque and centralized betting organizations or
            individual bookmakers putting out odds that ultimately favor
            bookmakers, Calypso.Bet taps into the wisdom of the crowds to
            determine more fair betting odds that favor a larger number of
            winners. <br />
            <br />
            Every betting pool is its own smart contract and users can bet in an
            existing pool or create their own pools.
          </p>
          <br />
          <br />
          <br />
        </div>
      </div>

      {/* <!-- WHY BET WITH CALYPSO.BET? -->  */}

      <div style={{ backgroundColor: "#021025" }}>
        <div className="container">
          <br />
          <br />
          <br />
          <br />
          <div className="accordion" id="accordionExample">
            <div
              className="card wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay="0s"
            >
              <div className="card-header" id="headingOne">
                <h3>
                  <button
                    className="btn btn-link white bold title"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Why bet with Calypso.bet?
                  </button>
                </h3>
              </div>

              <div
                id="collapseOne"
                className="collapse show"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <span>
                    Calypso.Bet was designed to tap on the wisdom of the crowds.
                    <br />
                    <br />
                    By enabling variable odds for all sports betting pools, odds
                    are automatically sorted and probabilities based on the odds
                    that users ultimately help to determine.
                    <br />
                    <br />
                    <br />
                  </span>
                </div>
              </div>
            </div>
            <div
              className="card wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay="0.2s"
            >
              <div className="card-header" id="headingTwo">
                <h3>
                  <button
                    className="white bold title btn btn-link collapsed"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    How to Bet?
                  </button>
                </h3>
              </div>
              <div
                id="collapseTwo"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <span>
                    Calypso.Bet supports any ERC-20 digital token, and users can
                    bet or create pools using their existing Metamask address on
                    a variety of sporting events.
                    <br />
                    <br />
                    <br />
                  </span>
                </div>
              </div>
            </div>
            <div
              className="card wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay="0.4s"
            >
              <div className="card-header" id="headingThree">
                <h3>
                  <button
                    className="white bold title btn btn-link collapsed"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    How to create a Pool?
                  </button>
                </h3>
              </div>
              <div
                id="collapseThree"
                className="collapse"
                aria-labelledby="headingThree"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <span>
                    Betting pool creators will need to stake CAL tokens to
                    create a betting pool using any ERC-20 token. The amount of
                    CAL tokens staked determines the maximum size of the betting
                    pool.
                    <br />
                    <br />
                    Betting pools are limited according to a formula that
                    ensures that the maximum amount of CAL tokens staked to
                    create a betting pool never exceeds a predetermined amount.
                    <br />
                    <br />
                    The ultimate goal of using CAL tokens to create betting
                    pools is to ensure that the amount of CAL staked for smaller
                    betting pools is kept to a minimum, whereas betting pool
                    creators who seek to create betting pools with no upper
                    limit in size never have to stake more than a fixed amount
                    of CAL tokens.
                    <br />
                    <br />
                    <br />
                  </span>
                </div>
              </div>
            </div>
            <div
              className="card wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay="0.6s"
            >
              <div className="card-header" id="headingFour">
                <h3>
                  <button
                    className="white bold title btn btn-link collapsed"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    How to earn Betting Pool creation fees?
                  </button>
                </h3>
              </div>
              <div
                id="collapseFour"
                className="collapse"
                aria-labelledby="headingFour"
                data-parent="#accordionExample"
              >
                <div className="card-body">
                  <span>
                    Betting pool creators are entitled to receive a portion of
                    the winnings of the pools which they create and are free to
                    set that percentage of winnings they derive from their
                    pools.
                    <br />
                    <br />
                    <br />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
      <div style={{ backgroundColor: "#07172F" }}>
        <div className="container" align="center">
          <br />
          <br />
          <br />
          <h2 className="white bold">CALYPSO.BET FEES</h2>
          <br />
          <p className="white">
            Calypso.Bet will receive{" "}
            <span className="bold yellow" style={{ fontSize: "50px" }}>
              1%
            </span>{" "}
            of all winnings from every betting pool and will use these proceeds
            to:
          </p>
          <br />
          <div className="col-md-9">
            <div
              className="fees-box wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay="0s"
            >
              <span className="black">
                Purchase CAL tokens on decentralized exchanges, to better manage
                the supply of CAL tokens; for payout to affiliates who have
                brought players to betting pools; and as rewards CAL tokens
                which have been staked.
              </span>
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container">
          <br />
          <div className="row">
            <div
              className="col-md-12 wow fadeInUp"
              data-wow-duration="1.5s"
              data-wow-delay="0.2s"
            >
              <br />
              <br />
              <span
                style={{
                  fontSize: "26px",
                  textTransform: "uppercase",
                  marginTop: "100px",
                }}
                className="white bold"
              >
                PRIVATE POOLS
              </span>
              <br />
              <br />
              <div className="col">
                <div
                  className="row border-box"
                  style={{ backgroundColor: "#2A3E5C" }}
                >
                  <div className="col-md-3 my-auto">
                    <img width="100" src="/images/icon.png" />
                  </div>
                  <div className="col-md-9 my-auto">
                    <br />
                    <span className="white">
                      Betting pool creators can create their own private betting
                      pools by specifying a list of whitelisted Ethereum
                      addresses that can participate in their own “private”
                      betting pools.{" "}
                    </span>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
            {/* 
           <div
              className="col-md-6 wow fadeInUp"
              data-wow-duration="1.5s"
              data-wow-delay="0.4s"
            >
              <br />
              <br />
              <span className="white bold affiliate-symtem">
                AFFILIATE SYSTEM
              </span>
              <br />
              <br />
              <div className="col">
                <div
                  className="row border-box"
                  style={{ backgroundColor: "#2A3E5C" }}
                >
                  <div className="col-md-3 my-auto">
                    <img style={{ width: "100px" }} src="/images/icon.png" />
                  </div>
                  <div className="col-md-9 my-auto">
                    <br />
                    <span className="white">
                      Affiliates can bring users to participate in existing
                      betting pools and receive 50% of Calypso.Bet’s fees from
                      the rolling bets of such users.{" "}
                    </span>
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          */}{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPanel;
