import React, { useState, useEffect } from "react";
import Main from "../Common/Main";
import useInput from "../hook/useInput";
import { getStaking, getCal, getSigner } from "../../utils/Contracts";
import { getEther, getWei } from "../../utils/Web3Utils";
import { connect, useSelector } from "react-redux";
import Addresses from "../../const/Address";
import { toast } from "react-toastify";

const Staking = () => {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [totalPool, setTotalPool] = useState("0");
  const [stakeAmount, setStakeAmount] = useState("0");
  const [stakeIncome, setStakeIncome] = useState("0");
  const [amount, bindAmount, resetAmount] = useInput("0");
  const [approved, setApproved] = useState(false);

  const signer = getSigner();
  const stakingSC = getStaking();
  const calSC = getCal() && getCal().connect(signer);
  const stakingSigner = stakingSC && stakingSC.connect(signer);
  const address = useSelector((state) => state.address);

  useEffect(() => {
    getStakingDetail();
    const interval = setInterval(() => {
      getStakingDetail();
    }, 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [address, stakingSC, reload]);

  const getStakingDetail = () => {
    stakingSC &&
      address &&
      stakingSC.getCurrentState(address).then((res) => {
        setTotalPool(getEther(res._total));
        setStakeAmount(getEther(res._stakeAmount));
        setStakeIncome(getEther(res._stakeIncome));
      });
  };

  const approveCal = () => {
    setLoading(true);
    calSC &&
      address &&
      calSC
        .approve(Addresses.staking, getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(true);
            toast.info("Approved successfully, can stake now.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const stakeCal = () => {
    setLoading(true);
    stakingSigner &&
      address &&
      stakingSigner
        .stake(getWei(amount))
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            setApproved(false);
            resetAmount();
            getStaking();
            setReload(!reload);
            toast.info("You staked successfully.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  const claimStake = () => {
    setLoading(true);
    stakingSigner &&
      address &&
      stakingSigner
        .claimTokens()
        .then((tx) => {
          tx.wait().then(() => {
            setLoading(false);
            getStaking();
            setReload(!reload);
            toast.info("Claim stake successfully.");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };
  return (
    <Main reload={reload} loading={loading} setLoading={setLoading}>
      <div className="container body-section">
        <h3 className="bold black">Earn Rewards</h3>
        <p className="grey">
          Earn Rewards allows you to Stake CAL in Calypso DeFi and be rewarded
          with CAL
        </p>
        <br />
        <span className="bold black">Stake Now</span>
        <div className="row">
          <div className="col-md-6 col-12">
            <form className="grey mt-3">
              <span>Input Amount Of CAL to Stake</span>
              <br />
              <input
                style={{ width: "90%" }}
                className="text-input mr-2"
                type="number"
                placeholder="Enter number"
                {...bindAmount}
              ></input>
              <span className="black">CAL</span>
              <br />
            </form>
            <div>
              <button
                className={`yellow-btn mt-2 mr-3`}
                onClick={approved ? stakeCal : approveCal}
              >
                {approved ? "Stake" : "Approve CAL"}
              </button>
            </div>
            <br />
            <br />
            <hr />
            <span className="grey mr-3">Total Pool:</span>
            <span>{totalPool} CAL</span>
            <br />
            <span className="grey mr-3">Your Current CAL Staked:</span>
            <span>
              {stakeAmount} CAL (
              {(totalPool == 0 ? 0 : (stakeAmount * 100) / totalPool).toFixed(
                2
              )}
              %)
            </span>
            <br />
            <span className="grey mr-3">Your Earned CAL:</span>
            <span>{stakeIncome} CAL</span>
            <br />
            <br />
            {stakeAmount > 0 && (
              <button className={`yellow-btn mt-2`} onClick={claimStake}>
                Claim Stake
              </button>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default connect(null)(Staking);
