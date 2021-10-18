import Address from "../const/Address";
import CalAbi from "../const/Cal";
import UsdtAbi from "../const/Usdt";
import CalSwapAbi from "../const/CalSwap";
import PoolManagerAbi from "../const/PoolManager";
import TestFaucetAbi from "../const/TestFaucet";
import BettingPoolAbi_0 from "../const/BettingPool_0";
import ERC20 from "../const/ERC20";
import OracleAbi from "../const/Oracle";
import StakingAbi from "../const/Staking";
import AffiliateAbi from "../const/Affiliate";
import LotteryAbi from "../const/Lottery";
import LotteryManagerAbi from "../const/LotteryManager";
import { ethers } from "ethers";

const BettingPoolAbi = [BettingPoolAbi_0];

export const getWeb3 = () => {
  if (window.ethereum)
    return new ethers.providers.Web3Provider(window.ethereum);
};

export const getSigner = () => {
  const web3 = getWeb3();
  if (web3) return web3.getSigner();
};

export const getCal = () => {
  const web3 = getWeb3();
  if (!window.cal && web3) {
    window.cal = new ethers.Contract(Address.cal, CalAbi, web3);
  }
  return window.cal;
};

export const getUsdt = () => {
  const web3 = getWeb3();

  if (!window.usdt && web3) {
    window.usdt = new ethers.Contract(Address.usdt, UsdtAbi, web3);
  }
  return window.usdt;
};

export const getErc20 = (address) => {
  const web3 = getWeb3();
  if (web3) return new ethers.Contract(address, ERC20, web3);
  return null;
};

export const getCalSwap = () => {
  const web3 = getWeb3();
  if (!window.calswap && web3) {
    window.calswap = new ethers.Contract(Address.calSwap, CalSwapAbi, web3);
  }
  return window.calswap;
};

export const getPoolManager = () => {
  const web3 = getWeb3();
  if (!window.poolManager && web3) {
    window.poolManager = new ethers.Contract(
      Address.poolManager,
      PoolManagerAbi,
      web3
    );
  }
  return window.poolManager;
};

export const getTestFaucet = () => {
  const web3 = getWeb3();
  if (!window.faucet && web3) {
    window.faucet = new ethers.Contract(
      Address.testFaucet,
      TestFaucetAbi,
      web3
    );
  }
  return window.faucet;
};

export const getBettingPool = (address, version = 0) => {
  const web3 = getWeb3();
  if (web3) return new ethers.Contract(address, BettingPoolAbi[0], web3);
  return null;
};

export const getLotteryManagerSc = () => {
  const web3 = getWeb3();
  if (web3)
    return new ethers.Contract(Address.lotteryManager, LotteryManagerAbi, web3);
  return null;
};

export const getLotterySc = (address) => {
  const web3 = getWeb3();
  if (web3) return new ethers.Contract(address, LotteryAbi, web3);
  return null;
};

export const getOracle = () => {
  const web3 = getWeb3();
  if (!window.oracle && web3) {
    window.oracle = new ethers.Contract(Address.oracle, OracleAbi, web3);
  }
  return window.oracle;
};

export const getStaking = () => {
  const web3 = getWeb3();
  if (!window.staking && web3) {
    window.staking = new ethers.Contract(Address.staking, StakingAbi, web3);
  }
  return window.staking;
};

export const getAffiliate = () => {
  const web3 = getWeb3();
  if (web3) {
    const affiliate = new ethers.Contract(
      Address.affiliate,
      AffiliateAbi,
      web3
    );
    return affiliate;
  }
  return null;
};
