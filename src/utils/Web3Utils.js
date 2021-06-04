import { ethers } from "ethers";

export const stringToBytes32 = (src) => {
  return ethers.utils.formatBytes32String(src);
};

export const byte32ToString = (src) => {
  return ethers.utils.parseBytes32String(src);
};

export const getEther = (bn) => {
  return ethers.utils.formatEther(bn);
};

export const getWei = (eth) => {
  return ethers.utils.parseEther(eth);
};

export const hexlify = (src) => {
  return ethers.utils.hexlify(src);
};

export const getNumber = (num) => {
  return ethers.utils.getNumber(num);
};
