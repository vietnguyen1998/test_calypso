import moment from "moment";
import { LogisticConst } from "../const/Const";

export const getNetworkName = (chainId) => {
  switch (chainId) {
    case Chain.main:
      return "MainNet";
    case Chain.ropsten:
      return "Ropsten";
    case Chain.rinkeby:
      return "Rinkeby";
    case Chain.kovan:
      return "Kovan";
    default:
      return "PrivateNet";
  }
};

export const Chain = {
  main: 1,
  ropsten: 3,
  rinkeby: 4,
  kovan: 42,
};

export const toNumber = (numberString) => {
  return parseFloat(numberString.trim().replace(",", "."));
};

export const timestampToLocalDate = (time, format = "D MMM YYYY H:mm Z") => {
  return moment.unix(time).format(format) || time;
};

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const isAddress = (addr) => {
  return /^(0x)?[0-9a-f]{40}$/i.test(addr);
};

export const shortenAddress = (addr) => {
  const length = addr.length;
  return addr.slice(0, 6) + "..." + addr.slice(length - 4);
};

export const getMaxPoolSize = (calNum) => {
  if (calNum < 1) return 0;
  const poolSize =
    LogisticConst.upperLimit /
    (1 +
      Math.exp(
        -LogisticConst.rateK * (calNum - LogisticConst.inflectionPoint)
      ));
  return Math.round(poolSize / 1e3) * 1e3;
};

export const getCalAmount = (maxSize) => {
  const result = Math.log(LogisticConst.upperLimit / maxSize - 1) / -0.09 + 50;
  return result;
};

export const roundNumber = (num, scale) => {
  var scale = scale || scaleNumber(num);
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
      "e-" +
      scale
    );
  }
};

export const scaleNumber = (num) => {
  if (num == 0) return 0;
  const scale = 4 - Math.floor(Math.log10(Math.abs(num)));
  return scale < 1 ? 1 : scale;
};

export const getOdds = (betAmounts) => {
  let odds;
  if (betAmounts.some((el) => el === 0)) {
    odds = betAmounts.join(" : ");
  } else {
    const minAmount = Math.min(...betAmounts);
    const transformAmount = betAmounts.map((el) =>
      roundNumber(el / minAmount, 2)
    );
    odds = transformAmount.join(" : ");
  }
  return odds;
};
