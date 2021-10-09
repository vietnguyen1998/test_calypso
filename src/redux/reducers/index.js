import ActionType from "../type";

const initialState = {
  calBalance: 0,
  ethBalance: 0,
  usdtBalance: 0,
  address: "",
  chainId: 0,
  pools: [],
  pool: {},
  ownPools: [],
  bets: [],
  matches: [],
  whitelist: [],
  affiliate: {},
  username: "",
  useraddress: "",
  lotteries: [],
  lottery: {},
  tickets: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionType.calBalance:
      return {
        ...state,
        calBalance: payload,
      };
    case ActionType.usdtBalance:
      return {
        ...state,
        usdtBalance: payload,
      };
    case ActionType.ethBalance:
      return {
        ...state,
        ethBalance: payload,
      };
    case ActionType.chainId:
      return {
        ...state,
        chainId: payload,
      };
    case ActionType.currentAddress:
      return {
        ...state,
        address: payload,
      };
    case ActionType.getPools:
      return {
        ...state,
        pools: payload,
      };
    case ActionType.getLotteries:
      return {
        ...state,
        lotteries: payload,
      };
    case ActionType.getLottery:
      return {
        ...state,
        lottery: payload,
      };
    case ActionType.getPool:
      return {
        ...state,
        pool: {
          ...state.pool,
          g1: null,
          g2: null,
          ...payload,
        },
      };
    case ActionType.getUserName:
      return {
        ...state,
        username: payload,
      };
    case ActionType.getUserAddress:
      return {
        ...state,
        useraddress: payload,
      };
    case ActionType.updatePool:
      const pools = [...state.pools];
      const index = state.pools.findIndex((el) => el._id === payload._id);
      pools[index] = { ...pools[index], ...payload };
      return {
        ...state,
        pools,
      };
    case ActionType.resetPool:
      return {
        ...state,
        pool: {},
      };
    case ActionType.getOwnPool:
      return {
        ...state,
        ownPools: payload,
      };
    case ActionType.getBets:
      return {
        ...state,
        bets: payload,
      };
    case ActionType.getMatches:
      return {
        ...state,
        ...payload,
      };
    case ActionType.getAffiliateStatus:
      return {
        ...state,
        affiliate: payload,
      };
    case ActionType.getTickets:
      return {
        ...state,
        tickets: payload,
      };
    default:
      return state;
  }
};
