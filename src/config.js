export const etherscan = "https://rinkeby.etherscan.io/address/";
//== Dev
// export const host = "http://localhost:4000/api/";
// export const addresses = {
//   usdc: "0x7A2bbbAe421Cd178a906dF372C33D37510851EE5",
//   usdt: "0xa7da1d0237FF435d15e2880fdCb80D950Ac029E1",
//   wbtc: "0x7610b6F11223C1a098E63A050F2fBfaeE52a44B2",
//   cal: "0xF2C78487826604D6C67Cf047EDbafF086AD514c8",
//   calSwap: "0x60D5789666dcad8C039FAe53727DED93ede8Cf51",
//   poolManager: "0xA9731FAD0eA3f17A682B96e4CE4bBfc86c92330C",
//   testFaucet: "0x313d962D5F385A81C562CC0eB3445aE92ddEa4c2",
//   oracle: "0xC30587fcA21B472F2c330C96102F15Ff3335888B",
//   staking: "0x35a15Eea058800049B94CfeEAd5E1970F190afa3",
//   affiliate: "0x377bBb7f924cB389fA64DD23739e5947B0650447",
// };
// export const CHAIN_ID = 1337;
//== Prod
export const host = "https://calypso.bet/api/";
// local api host: "http://localhost:4000/api/"

//All contracts are using proxies now. NEVER change the addresses here.
//To upgrade any SC we should use upgradeProxy in Truffle.
export const addresses = {
  cal: "0x36DF4070E048A752C5abD7eFD22178ce8ef92535",
  usdt: "0x896C84068fa31Af023f7A12170e78c42A07C6dD6",
  usdc: "0x4a47cAeC2f0Ae39584A706B42424a911Ec730fc1",
  wbtc: "0x66A8b5B5ec306b09f830efba14E2B1AA150b4976",
  calSwap: "0x702AD4Cf93Dd3a6FBD8dF64679e280F7F4eEFE95",
  poolManager: "0x6c3D4978cF4b37A250271183d0121d1f60dA4c92",
  testFaucet: "0x6a63Cf2AEB160429bd75c625C9a33b43068dB85f",
  oracle: "0xfFB0E212B568133fEf49d60f8d52b4aE4A2fdB72",
  staking: "0x266235aA627CB076c7607D2bE0672854f114503d",
  affiliate: "0x2752Fbff6C1289b90fbbCD8db9E8aDFb7c459Ed0",
  lotteryManager: "0xF22BD3583c22845aBbeD4ce537fdDf5126fF6159",
};
export const CHAIN_ID = 4;
