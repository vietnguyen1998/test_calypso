import React from "react";
import { toast } from "react-toastify";

const WithdrawDeposit = (props) => {
  const { pool, coin, PoolSc, onReload, setLoading } = props;
  const depositedCal = pool && pool.depositedCal;
  const poolFeeAmount = pool && pool.result.poolFeeAmount;
  const claimedDepositAndFee = pool && pool.result.claimedDepositAndFee;

  const withdraw = () => {
    setLoading(true);
    PoolSc &&
      PoolSc.withdrawDepositAndFee()
        .then((tx) => {
          tx.wait().then(() => {
            onReload();
            setLoading(false);
            toast.success("You withdrawed successfully!");
          });
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        });
  };

  return (
    <div>
      <br />
      <h5>Deposit and pool fee</h5>
      <p className="mb-1">
        <span className="grey mr-2 mb-1">Deposit amount: </span> {depositedCal}{" "}
        CAL
      </p>
      <p className="mb-1">
        <span className="grey mr-2 mb-1">Pool Fee: </span> {poolFeeAmount}{" "}
        {coin}
      </p>
      {!claimedDepositAndFee && (
        <button className="yellow-btn mt-2" onClick={withdraw}>
          Withdraw
        </button>
      )}
    </div>
  );
};

export default WithdrawDeposit;
