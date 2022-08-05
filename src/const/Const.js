import Addresses from "./Address";

export const ZeroAddress = "0x0000000000000000000000000000000000000000";

export const SupportedCoins = [
  { label: "ETH", value: ZeroAddress },
  { label: "USDT", value: Addresses.usdt },
  { label: "CAL", value: Addresses.cal },
  { label: "USDC", value: Addresses.usdc },
  { label: "WBTC", value: Addresses.wbtc },
];

export const BetSides = {
  team1: 1,
  team2: 2,
  draw: 3,
};

export const LogisticConst = {
  upperLimit: 1000000,
  rateK: 0.09,
  inflectionPoint: 50,
};
