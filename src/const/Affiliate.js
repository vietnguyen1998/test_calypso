export default [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract Oracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "getAffiliateOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_numberAddress",
        type: "uint256",
      },
    ],
    name: "increaseNumberAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_affiliates",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_awards",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_currency",
        type: "address",
      },
    ],
    name: "sendTokenAward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_affiliates",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_awards",
        type: "uint256[]",
      },
    ],
    name: "sendEthAward",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "unStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_currency",
        type: "address",
      },
    ],
    name: "getReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_addAddrs",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_removeAddrs",
        type: "address[]",
      },
    ],
    name: "saveMultiAddrs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_currencies",
        type: "address[]",
      },
    ],
    name: "getAffiliateStatus",
    outputs: [
      {
        internalType: "uint256",
        name: "_maxNumber",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_referrals",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_affiliate",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_awards",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "addAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "removeAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeAffiliate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newAddress",
        type: "address",
      },
    ],
    name: "changeOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
