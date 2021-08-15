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

export const formatTimezone = (time) => {
  let tz = timestampToLocalDate(time - 3600, "Z").slice(0, -3);
  if (tz.charAt(1) == 0) {
    return tz.replace("0", "");
  } else {
    return tz;
  }
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
    if (betAmounts.some((el) => (el / minAmount) % 1 != 0)) {
      while (
        betAmounts.every((el, i) => {
          if ((el / 10) % 1 == 0) {
            return true;
          } else {
            odds = betAmounts.join(" : ");
            return false;
          }
        })
      ) {
        betAmounts = betAmounts.map((el) => el / 10);
        odds = betAmounts.join(" : ");
      }
    } else {
      const transformAmount = betAmounts.map((el) =>
        roundNumber(el / minAmount, 2)
      );
      odds = transformAmount.join(" : ");
    }
  }
  return odds;
};

export const swapBetAmounts = (_betAmounts) => {
  let tmp = _betAmounts[1];
  _betAmounts[1] = _betAmounts[2];
  _betAmounts[2] = tmp;
  return _betAmounts;
};

export const secondsToHms = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  return (
    (h >= 10 ? h : "0" + h) +
    ":" +
    (m >= 10 ? m : "0" + m) +
    ":" +
    (s >= 10 ? s : "0" + s)
  );
};
