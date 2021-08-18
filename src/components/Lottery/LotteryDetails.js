import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Main from "../Common/Main";
import { getLottery } from "../../redux/actions";
import { connect, useSelector } from "react-redux";
import { getLotterySc, getSigner, getCal } from "../../utils/Contracts";
import { getWei } from "../../utils/Web3Utils";
import { toast } from "react-toastify";
import useInput from "../hook/useInput";
import { secondsToHms } from "../../utils/Utils";
import { useHistory } from "react-router";
import { getTickets } from "../../redux/actions";

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
  const [calAmount, setCalAmount] = useState("0");
  const [ticketNumber, bindTicketNumber] = useInput("Enter 7-digit number");
  const [ticketsAmount, bindTicketsAmount] = useInput("0");
  const [stakeAmount, bindStakeAmount] = useInput("0");
  const [counter, setCounter] = useState(0);
  const history = useHistory();
  const tickets = useSelector((state) => state.tickets.tickets) || [];

  useEffect(() => {
    getTickets(lotteryAddress, address);
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

  const approveGetTicket = () => {
    setLoading(true);
    CalSigner &&
      CalSigner.approve(lotteryAddress, getWei(calAmount.toString()))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApprovedTicketNumber(true);
            toast.success(
              <div>
                Approved Successfully!
                <br />
                Please click the Purchase ticket button
              </div>
            );
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const approveGetTicketBatch = () => {
    setLoading(true);
    CalSigner &&
      CalSigner.approve(lotteryAddress, getWei(calAmount.toString()))
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

  const purchaseTicket = () => {
    setLoading(true);
    if (ticketNumber.length != 7) {
      setLoading(false);
      return toast.error("Ticket number length should be equal to 7.");
    }
    let number = parseInt(ticketNumber);
    if (isNaN(number)) {
      setLoading(false);
      return toast.error("Ticket number length should contain umbers only.");
    }
    LotterySc &&
      LotterySc.getTicket(number)
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApprovedTicketNumber(false);
            toast.success("Succsess!");
            history.go(0);
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
    LotterySc &&
      LotterySc.getTicketBatch(ticketsAmount)
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
        <p style={{ color: "white" }}>
          {i + 1}: {el.substring(1)}
        </p>
      </div>
    );
  });

  return (
    <Main loading={loading} setLoading={setLoading}>
      <div style={{ backgroundColor: "#021025" }}>
        <div className="container body-section">
          <div className="row ">
            <div className="col" style={{ backgroundColor: "#0f1f38" }}>
              <p style={{ color: "white" }}>Time Remaining</p>
              <p style={{ color: "yellow" }}>{secondsToHms(counter)}</p>
            </div>
            <div className="col"></div>
            <div className="col" style={{ backgroundColor: "#0f1f38" }}>
              <p style={{ color: "white" }}>Prize Pool</p>
              <p style={{ color: "yellow" }}>{lottery.totalPrize} CAL</p>
            </div>
            <div className="col"></div>
            <div className="col" style={{ backgroundColor: "#0f1f38" }}>
              <p style={{ color: "white" }}>Pool Size</p>
              <p style={{ color: "yellow" }}>
                {lottery.originalTotalStaked} CAL
              </p>
            </div>
            <div className="col"></div>
            <div className="col" style={{ backgroundColor: "#0f1f38" }}>
              <p style={{ color: "white" }}>Est. APY</p>
              <p style={{ color: "yellow" }}>2100.84%</p>
            </div>
          </div>

          <div className="mt-5" style={{ backgroundColor: "#0f1f38" }}>
            <h1 style={{ color: "white" }}>LUCKY DAY</h1>
            <p style={{ color: "yellow" }}>7 Digit Lottery</p>
            {(!lottery.hasDrawn && (
              <>
                <div className="row">
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
                <div className="row">
                  <div className="col">
                    <label style={{ color: "white" }}>I’m feeling lucky:</label>
                  </div>
                  <div className="col">
                    <input
                      className="text-input"
                      type="number"
                      {...bindTicketsAmount}
                    />
                  </div>
                  <div className="col">
                    <button
                      className="yellow-btn mt-3 mr-3"
                      onClick={
                        approvedTicketBatch
                          ? purchaseTicketBatch
                          : approveGetTicketBatch
                      }
                    >
                      {approvedTicketBatch ? "Purchase batch" : "Approve CAL"}
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label style={{ color: "white" }}>I want to stake:</label>
                  </div>
                  <div className="col">
                    <input
                      className="text-input"
                      type="number"
                      {...bindStakeAmount}
                    />
                  </div>
                  <div className="col">
                    <button
                      className="yellow-btn mt-3 mr-3"
                      onClick={approvedStake ? stake : approveStake}
                    >
                      {approvedStake ? "Stake" : "Approve CAL"}
                    </button>
                  </div>
                </div>
              </>
            )) || (
              <>
                {getUserPrize() > 0 && (
                  <div className="row ml-5">
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
                {getStakingReward() > 0 && (
                  <div className="row ml-5">
                    <div className="col">
                      <p style={{ color: "white" }}>
                        Your total staking reward: {getStakingReward()} CAL
                      </p>
                      {canUnstake && (
                        <button className="yellow-btn mt-2" onClick={unstake}>
                          Unstake
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {tickets.length > 0 && (
            <div className="mt-5" style={{ backgroundColor: "#0f1f38" }}>
              <h3 style={{ color: "white" }}>Your tickets:</h3>
              {ticketItems}
            </div>
          )}
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
