import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Main from "../Common/Main";
import { getLottery } from "../../redux/actions";
import { connect, useSelector } from "react-redux";
import { getLotterySc, getSigner, getCal } from "../../utils/Contracts";
import { getWei } from "../../utils/Web3Utils";
import { toast } from "react-toastify";
import useInput from "../hook/useInput";
import TutorialPopup from "../Common/TutorialPopup";
import { secondsToHms } from "../../utils/Utils";
import { useHistory } from "react-router";
import { getTickets } from "../../redux/actions";
import $ from "jquery";
import "./LotteryDetails.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const LotteryDetials = (props) => {
  const { getLottery, getTickets } = props;
  const lotteryAddress = useParams().lotteryId;
  const lottery = useSelector((state) => state.lottery) || {};
  const address = useSelector((state) => state.address);
  const endDate = (lottery && lottery.endDate) || 0;
  const [loading, setLoading] = useState(false);
  const signer = getSigner();
  const LotterySc = getLotterySc(lotteryAddress).connect(signer);
  const CalSigner = getCal() && getCal().connect(getSigner());
  const [approvedTicketNumber, setApprovedTicketNumber] = useState(false);
  const [approvedTicketBatch, setApprovedTicketBatch] = useState(false);
  const [approvedStake, setApprovedStake] = useState(false);
  const [calAmount, setCalAmount] = useState("1");
  const [ticketNumber, bindTicketNumber] = useInput("Enter 7-digit number");
  const [ticketsAmount, setTicketsAmount] = useState("1");
  const [stakeAmount, bindStakeAmount] = useInput("0");
  const [counter, setCounter] = useState(0);
  const history = useHistory();
  const tickets = useSelector((state) => state.tickets.tickets) || [];
  const [isRandomBatch, setIsRandomBatch] = useState(true);
  const winNumber = lottery && lottery.winNumber;
  const hasDrawn = lottery && lottery.hasDrawn;

  useEffect(() => {
    if (address != "") getTickets(lotteryAddress, address);
  }, [address]);

  useEffect(() => {
    let val = endDate - Math.floor(Date.now() / 1000);
    setCounter(val > 0 ? val : 0);
  }, [endDate]);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  useEffect(() => {
    setCalAmount("1");
  }, [ticketNumber]);

  useEffect(() => {
    setCalAmount(ticketsAmount);
  }, [ticketsAmount]);

  useEffect(() => {
    setCalAmount(stakeAmount);
  }, [stakeAmount]);

  useEffect(() => {
    updateLottery();
  }, [lotteryAddress]);

  const updateLottery = () => {
    lotteryAddress && getLottery(lotteryAddress);
  };

  const approveGetTicketBatch = () => {
    setLoading(true);
    CalSigner &&
      CalSigner.approve(lotteryAddress, getWei(ticketsAmount.toString()))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApprovedTicketBatch(true);
            toast.success(
              <div>
                Approved Successfully!
                <br />
                Please click the Purchase batch button
              </div>
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const approveStake = () => {
    setLoading(true);
    CalSigner &&
      CalSigner.approve(lotteryAddress, getWei(calAmount.toString()))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApprovedStake(true);
            toast.success(
              <div>
                Approved Successfully!
                <br />
                Please click the Stake button
              </div>
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const purchaseTicketBatch = () => {
    setLoading(true);
    if (ticketsAmount == 0) {
      setLoading(false);
      return toast.error("Tickets amount should be higher than 0.");
    }
    let ticketNumbers = [];
    if (!isRandomBatch) {
      for (let i = 0; i < ticketsAmount; i++) {
        let numberStr = $("#ticketId-" + i).val();
        if (numberStr.length != 7) {
          setLoading(false);
          return toast.error("All Ticket number length should be equal to 7.");
        }

        let number = parseInt(numberStr);
        if (isNaN(number)) {
          setLoading(false);
          return toast.error(
            "All Ticket numbers length should contain numbers only."
          );
        }
        ticketNumbers.push(number);
      }
    }

    LotterySc &&
      LotterySc.getTicketBatch(ticketsAmount, ticketNumbers)
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApprovedTicketBatch(false);
            toast.success("Succsess!");
            history.go(0);
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const stake = () => {
    setLoading(true);
    if (stakeAmount == 0) {
      setLoading(false);
      return toast.error("Stake amount should be higher than 0.");
    }
    LotterySc &&
      LotterySc.stake(stakeAmount)
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApprovedStake(false);
            toast.success("Succsess!");
            history.go(0);
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const claimReward = () => {
    setLoading(true);
    LotterySc &&
      LotterySc.claimPrize()
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            toast.success("Succsess!");
            history.go(0);
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const unstake = () => {
    setLoading(true);
    LotterySc &&
      LotterySc.unstake()
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            toast.success("Succsess!");
            history.go(0);
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const getUserPrize = () => {
    const firstPrizeTotal = (lottery.totalPrize * 40) / 100;
    const secondPrizeTotal = (lottery.totalPrize * 25) / 100;
    const thirdPrizeTotal = (lottery.totalPrize * 15) / 100;
    const match4Total = (lottery.totalPrize * 10) / 100;
    const match3Total = (lottery.totalPrize * 5) / 100;
    const match2Total = (lottery.totalPrize * 3) / 100;
    const match1Total = (lottery.totalPrize * 2) / 100;

    const totals = [
      firstPrizeTotal,
      secondPrizeTotal,
      thirdPrizeTotal,
      match4Total,
      match3Total,
      match2Total,
      match1Total,
    ];

    const allPrizes = [
      lottery.firstPrize,
      lottery.secondPrize,
      lottery.thirdPrize,
      lottery.match4,
      lottery.match3,
      lottery.match2,
      lottery.match1,
    ];

    let winAmount = 0;

    allPrizes.forEach((el, i) => {
      let winTicketsAmount = 0;
      if (el.length > 0) {
        el.forEach((adr) => {
          if (adr.toLowerCase() == address.toLowerCase()) {
            winTicketsAmount += 1;
          }
        });

        winAmount += (winTicketsAmount * totals[i]) / el.length;
      }
    });

    return winAmount;
  };

  const getWinningTickets = () => {
    var winningTickets = [];

    for (let i = 0; i < tickets.length; i++) {
      const ticket = parseInt(tickets[i]);
      const winNumber1 = parseInt(winNumber) + 10000000;
      if (ticket == winNumber1) {
        winningTickets.push({
          number: ticket.toString(),
          place: 1,
          prize: (lottery.totalPrize * 0.4) / lottery.firstPrize.length,
        });
      } else if (Math.floor(ticket / 10) == Math.floor(winNumber1 / 10)) {
        winningTickets.push({
          number: ticket.toString(),
          place: 2,
          prize: (lottery.totalPrize * 0.25) / lottery.secondPrize.length,
        });
      } else if (Math.floor(ticket / 100) == Math.floor(winNumber1 / 100)) {
        winningTickets.push({
          number: ticket.toString(),
          place: 3,
          prize: (lottery.totalPrize * 0.15) / lottery.third.length,
        });
      } else if (Math.floor(ticket / 1000) == Math.floor(winNumber1 / 1000)) {
        winningTickets.push({
          number: ticket.toString(),
          place: 4,
          prize: (lottery.totalPrize * 0.1) / lottery.match4.length,
        });
      } else if (Math.floor(ticket / 10000) == Math.floor(winNumber1 / 10000)) {
        winningTickets.push({
          number: ticket.toString(),
          place: 5,
          prize: (lottery.totalPrize * 0.05) / lottery.match3.length,
        });
      } else if (
        Math.floor(ticket / 100000) == Math.floor(winNumber1 / 100000) ||
        ticket % 100 == winNumber1 % 100
      ) {
        winningTickets.push({
          number: ticket.toString(),
          place: 6,
          prize: (lottery.totalPrize * 0.03) / lottery.match2.length,
        });
        if (
          Math.floor(ticket / 100000) == Math.floor(winNumber1 / 100000) &&
          ticket % 100 == winNumber1 % 100
        ) {
          winningTickets.push({
            number: ticket.toString(),
            place: 6,
            prize: (lottery.totalPrize * 0.03) / lottery.match2.length,
          });
        }
      } else if (
        Math.floor(ticket / 1000000) == Math.floor(winNumber1 / 1000000) ||
        ticket % 10 == winNumber1 % 10
      ) {
        winningTickets.push({
          number: ticket.toString(),
          place: 7,
          prize: (lottery.totalPrize * 0.02) / lottery.match1.length,
        });
        if (
          Math.floor(ticket / 1000000) == Math.floor(winNumber1 / 1000000) &&
          ticket % 10 == winNumber1 % 10
        ) {
          winningTickets.push({
            number: ticket.toString(),
            place: 7,
            prize: (lottery.totalPrize * 0.02) / lottery.match1.length,
          });
        }
      }
    }
    return winningTickets.sort((a, b) =>
      a.place > b.place ? 1 : b.place > a.place ? -1 : 0
    );
  };

  const getStakingReward = () => {
    let amount = 0;
    let usersStake = 0;
    let totalTickets = 0;
    totalTickets = lottery.totalTickets / 1e18;

    for (let i = 0; i < lottery.stakersAddresses.length; i++) {
      if (lottery.stakersAddresses[i].toLowerCase() == address.toLowerCase())
        usersStake = lottery.stakingAmounts[i];
    }

    let percentStake = (usersStake * 100) / lottery.originalTotalStaked;
    if (lottery.totalStaked > 0) {
      let usersStakeToReturn = (lottery.totalStaked * percentStake) / 100;
      amount = usersStakeToReturn + (totalTickets * percentStake) / 100;
    } else {
      amount = (totalTickets * percentStake) / 100;
    }
    return amount;
  };

  const canClaim =
    lottery &&
    lottery.usersClaimedPrize &&
    !lottery.usersClaimedPrize.some(
      (el) => el.toLowerCase() == address.toLowerCase()
    );

  const canUnstake =
    lottery &&
    lottery.usersClaimedStake &&
    !lottery.usersClaimedStake.some(
      (el) => el.toLowerCase() == address.toLowerCase()
    );

  const ticketItems = tickets.map((el, i) => {
    return (
      <div className="row ml-3">
        <div className="col-1">
          <span className="white">{i + 1}</span>
        </div>
        <div className="col-2">
          <p
            class="text-center"
            style={{
              backgroundColor: "#747272",
              color: "white",
              borderRadius: "5px",
            }}
          >
            {el.substring(1)}
          </p>
        </div>
      </div>
    );
  });

  const stringifyNumber = (n) => {
    var special = ["st", "nd", "rd"];
    return n > 3 ? "th" : special[n - 1];
  };

  const winTicketItems = getWinningTickets().map((el, i) => {
    return (
      <div className="row d-flex justify-content-center">
        <div className="col-3 ">
          <p className="px-2 winning-ticket">
            {el.number.substring(1).split("").join("\xa0\xa0\xa0")}
          </p>
        </div>
        <div className="col-3">
          <p className="white">
            {el.place}
            {stringifyNumber(el.place)} Prize, {el.prize}CAL
          </p>
        </div>
      </div>
    );
  });

  const getTicketsArray = () => {
    let array = [];
    for (let i = 0; i < ticketsAmount; i++) {
      array.push(i + 1);
    }
    return array;
  };

  const batch = getTicketsArray().map((el, i) => {
    return (
      <input
        style={{
          backgroundColor: "#747272",
          color: "white",
          letterSpacing: "25px",
          border: "0",
          color: "yellow",
          maxWidth: "260px",
        }}
        className="form-control input-sm mt-1"
        type="text"
        id={"ticketId-" + i}
        maxlength="7"
      />
    );
  });

  const winNumberLogo =
    winNumber != undefined
      ? winNumber
          .toString()
          .split("")
          .map((el, i) => {
            return <div className="ticket-number mx-3">{el}</div>;
          })
      : 0;

  return (
    <Main loading={loading} setLoading={setLoading}>
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container body-section">
          <div
            className="mt-5 px-3 py-3"
            style={{ backgroundColor: "#0f1f38", borderRadius: "15px" }}
          >
            <div className="row ">
              <div className="col-12 text-center">
                <h1 style={{ color: "white" }}>LUCKY DAY</h1>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col"></div>
              <div className="col text-center">
                <p className="white">Time Remaining</p>
                <p className="yellow">{secondsToHms(counter)}</p>
              </div>
              <div className="col text-center">
                <p className="white">Prize Pool</p>
                <p className="yellow">{lottery.totalPrize} CAL</p>
              </div>
              <div className="col text-center">
                <p className="white">Pool Size</p>
                <p className="yellow">{lottery.originalTotalStaked} CAL</p>
              </div>
              <div className="col text-center">
                <p className="white">Est. APY</p>
                <p className="yellow">2100.84%</p>
              </div>
              <div className="col"></div>
            </div>
            <div className="row mt-2">
              <div className="col">
                <h4 className="white">
                  Do you have what it takes to be a winner?
                </h4>
                <p className="grey">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                  amet sint. Velit officia consequat duis enim velit mollit.
                  Exercitation veniam consequat sunt nostrud amet.
                </p>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col">
                {lottery._id != undefined && (
                  <Tabs defaultIndex={hasDrawn ? 3 : 0}>
                    <TabList>
                      <Tab disabled={hasDrawn}>Purchase tickets</Tab>
                      <Tab>View My Tickets</Tab>
                      <Tab>Stake and Withdraw</Tab>
                      <Tab disabled={!hasDrawn}>Claim Winnings</Tab>
                      <Tab disabled>Past Results</Tab>
                    </TabList>

                    <TabPanel>
                      <div className="row mx-2">
                        <div className="col-4">
                          <div className="ml-4">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e) => setIsRandomBatch(!isRandomBatch)}
                              disabled={approvedTicketBatch}
                            ></input>
                            <TutorialPopup content="Select this option to enter ticket numbers manually">
                              <label className="form-check-label white">
                                Enter numbers manually
                              </label>
                            </TutorialPopup>
                          </div>
                          <TutorialPopup content="Purchasing an amount of tickets. Numbets of tickets shall be randomized by default">
                            <label style={{ color: "white" }}>
                              Purchase tickets:
                            </label>
                          </TutorialPopup>
                          <div className="row  align-items-center">
                            <button
                              className="btn-sub-add mr-1"
                              onClick={() =>
                                setTicketsAmount(parseInt(ticketsAmount) - 1)
                              }
                            >
                              -
                            </button>
                            <input
                              className="text-input noarrows mt-3"
                              type="number"
                              disabled={approvedTicketBatch}
                              style={{ WebkitAppearance: "none", margin: "0" }}
                              onChange={(e) => setTicketsAmount(e.target.value)}
                              style={{ width: "30%", textAlign: "center" }}
                              value={ticketsAmount}
                            />
                            <button
                              className="btn-sub-add ml-1"
                              onClick={() =>
                                setTicketsAmount(parseInt(ticketsAmount) + 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          {!isRandomBatch && batch}

                          <button
                            className="yellow-btn mt-3 mr-3"
                            onClick={
                              approvedTicketBatch
                                ? purchaseTicketBatch
                                : approveGetTicketBatch
                            }
                          >
                            {approvedTicketBatch
                              ? "Purchase batch"
                              : "Approve CAL"}
                          </button>
                        </div>
                        <div className="col-8"></div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      {(tickets.length > 0 && (
                        <div className="row">
                          <div className="col">
                            <span className="white">
                              Total tickets purchased:{" "}
                            </span>
                            <span className="yellow">{ticketItems.length}</span>
                            <h3 style={{ color: "white" }}>Your tickets:</h3>
                            {ticketItems}
                          </div>
                        </div>
                      )) || (
                        <>
                          <h4 className="white">
                            You have not purchased any ticket yet
                          </h4>
                          <br />
                          <br />
                        </>
                      )}
                    </TabPanel>
                    <TabPanel>
                      <div className="row">
                        <div className="col">
                          <label style={{ color: "white" }}>
                            I want to stake:
                          </label>
                        </div>
                        <div className="col">
                          <label style={{ color: "white" }}>
                            I want to withdraw:
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-3">
                          <input type="number" {...bindStakeAmount} />
                        </div>
                        <div className="col-3">
                          <button
                            className="stake-btn"
                            onClick={approvedStake ? stake : approveStake}
                          >
                            {approvedStake ? "Stake" : "Approve CAL"}
                          </button>
                        </div>
                        {/*Допилить частичный виздро или спросить сюда ли его пихать */}
                        <div className="col-3">
                          <input type="number" />
                        </div>
                        <div className="col-3">
                          <button className="stake-btn">Withdraw</button>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div className="row d-flex justify-content-center">
                        <b style={{ fontSize: "30px" }} className="red">
                          Winning Number
                        </b>
                      </div>
                      <div className="row d-flex justify-content-center mt-3">
                        {winNumberLogo}
                      </div>
                      <div className="mt-5">{winTicketItems}</div>

                      {getUserPrize() > 0 && (
                        <div className="row">
                          <div className="col">
                            <p style={{ color: "white" }}>
                              You win: {getUserPrize()} CAL
                            </p>
                            {canClaim && (
                              <button
                                className="yellow-btn mt-2"
                                onClick={claimReward}
                              >
                                Claim
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      {/*getStakingReward() > 0 && (
                          <div className="row ml-5">
                            <div className="col">
                              <p style={{ color: "white" }}>
                                Your total staking reward: {getStakingReward()}{" "}
                                CAL
                              </p>
                              {canUnstake && (
                                <button
                                  className="yellow-btn mt-2"
                                  onClick={unstake}
                                >
                                  Unstake
                                </button>
                              )}
                            </div>
                          </div>
                              )*/}
                    </TabPanel>
                    <TabPanel>
                      <h4>hehehehehehehehehe</h4>
                    </TabPanel>
                  </Tabs>
                )}{" "}
              </div>
            </div>
            {(!lottery.hasDrawn && (
              <>
                {/*<div className="row">
                  <div className="col">
                    {" "}
                    <label style={{ color: "white" }}>
                      Enter Ticket Number:
                    </label>
                  </div>
                  <div className="col">
                    <input
                      className="text-input"
                      type="text"
                      {...bindTicketNumber}
                    />
                  </div>
                  <div className="col">
                    <button
                      className="yellow-btn mt-3 mr-3"
                      onClick={
                        approvedTicketNumber ? purchaseTicket : approveGetTicket
                      }
                    >
                      {approvedTicketNumber ? "Purchase ticket" : "Approve CAL"}
                    </button>
                  </div>
                </div>
              */}
              </>
            )) || <></>}
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </Main>
  );
};
export default connect(null, { getLottery, getTickets })(LotteryDetials);
