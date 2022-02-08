import React, { useEffect, useState } from "react";

export const getWinningTickets = (tickets, lottery) => {
  var winningTickets = [];
  for (let i = 0; i < tickets.length; i++) {
    const ticket = parseInt(tickets[i]);
    const strTicket = ticket.toString().substring(1);
    const winNumber = parseInt(lottery.winNumber) + 10000000;
    if (ticket == winNumber) {
      winningTickets.push({
        number: strTicket,
        place: 1,
        amountOfWinners: lottery.firstPrize.length,
        prize: (lottery.totalPrize * 0.4) / lottery.firstPrize.length,
      });
    } else if (Math.floor(ticket / 10) == Math.floor(winNumber / 10)) {
      winningTickets.push({
        number: strTicket,
        place: 2,
        amountOfWinners: lottery.secondPrize.length,
        prize: (lottery.totalPrize * 0.25) / lottery.secondPrize.length,
      });
    } else if (Math.floor(ticket / 100) == Math.floor(winNumber / 100)) {
      winningTickets.push({
        number: strTicket,
        place: 3,
        amountOfWinners: lottery.thirdPrize.length,
        prize: (lottery.totalPrize * 0.15) / lottery.thirdPrize.length,
      });
    } else if (Math.floor(ticket / 1000) == Math.floor(winNumber / 1000)) {
      winningTickets.push({
        number: strTicket,
        place: 4,
        amountOfWinners: lottery.match4.length,
        prize: (lottery.totalPrize * 0.1) / lottery.match4.length,
      });
    } else if (Math.floor(ticket / 10000) == Math.floor(winNumber / 10000)) {
      winningTickets.push({
        number: strTicket,
        place: 5,
        amountOfWinners: lottery.match3.length,
        prize: (lottery.totalPrize * 0.05) / lottery.match3.length,
      });
    } else if (
      Math.floor(ticket / 100000) == Math.floor(winNumber / 100000) ||
      ticket % 100 == winNumber % 100
    ) {
      winningTickets.push({
        number: strTicket,
        place: 6,
        amountOfWinners: lottery.match2.length,
        prize: (lottery.totalPrize * 0.03) / lottery.match2.length,
      });
      if (
        Math.floor(ticket / 100000) == Math.floor(winNumber / 100000) &&
        ticket % 100 == winNumber % 100
      ) {
        winningTickets.push({
          number: strTicket,
          place: 6,
          amountOfWinners: lottery.match2.length,
          prize: (lottery.totalPrize * 0.03) / lottery.match2.length,
        });
      }
    } else if (
      Math.floor(ticket / 1000000) == Math.floor(winNumber / 1000000) ||
      ticket % 10 == winNumber % 10
    ) {
      winningTickets.push({
        number: strTicket,
        place: 7,
        amountOfWinners: lottery.match1.length,
        prize: (lottery.totalPrize * 0.02) / lottery.match1.length,
      });
      if (
        Math.floor(ticket / 1000000) == Math.floor(winNumber / 1000000) &&
        ticket % 10 == winNumber % 10
      ) {
        winningTickets.push({
          number: strTicket,
          place: 7,
          amountOfWinners: lottery.match1.length,
          prize: (lottery.totalPrize * 0.02) / lottery.match1.length,
        });
      }
    }
  }

  return winningTickets.sort((a, b) =>
    a.place > b.place ? 1 : b.place > a.place ? -1 : 0
  );
};

export const stringifyNumber = (n) => {
  var special = ["st", "nd", "rd"];
  return n > 3 ? n + "th" : n + special[n - 1];
};

export const getPrizesArray = (lottery) => {
  return [
    [lottery.firstPrize, 40],
    [lottery.secondPrize, 25],
    [lottery.thirdPrize, 15],
    [lottery.match4, 10],
    [lottery.match3, 5],
    [lottery.match2, 3],
    [lottery.match1, 2],
  ];
};

export const getLotteryWinners = (lottery) => {
  if (lottery._id == undefined) {
    return;
  }
  const prizes = getPrizesArray(lottery);
  let hasWinners = false;

  prizes.forEach((el) => {
    if (el[0].length > 0) {
      hasWinners = true;
    }
  });

  if (!hasWinners) {
    return (
      <div className="row d-flex justify-content-center">
        <div>
          <p className="white">No winners in this lottery...</p>
        </div>
      </div>
    );
  }
  return prizes.map((el, i) => {
    const winners = el[0];
    if (winners.length > 0) {
      const winningPart = (lottery.totalPrize * el[1]) / 100 / winners.length;
      return (
        <div className="row d-flex justify-content-center">
          <div>
            <p className="white">
              {stringifyNumber(i + 1)} Prize - {winners.length}{" "}
              {winners.length > 1 ? "Winners" : "Winner"}, {winningPart} CAL
              each
            </p>
          </div>
        </div>
      );
    }
  });
};

export const reverseIndex = (array) => {
  const indexes = [];
  array.forEach((el, i) => {
    indexes.push(i + 1);
  });
  return indexes.reverse();
};

export const getStakerEarnings = (lottery) => {
  let amount = getTotalPrizesWon(lottery);

  if (lottery.totalTickets - amount <= 0) {
    amount = lottery.totalTickets - amount;
  } else {
    amount = (lottery.totalTickets - amount) * 0.95;
  }
  return amount;
};

export const getTotalPrizesWon = (lottery) => {
  let amount = 0;
  if (Object.keys(lottery).length) {
    const prizes = getPrizesArray(lottery);
    prizes.forEach((el) => {
      if (el[0].length > 0) {
        const winningPart = (lottery.totalPrize * el[1]) / 100;
        amount += (winningPart * el[0].length) / el[0].length;
      }
    });
  }

  return amount;
};
