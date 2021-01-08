/* global BigInt */

const balanceToBigInt = (balance) => {
  const balanceString = balance.toString();
  return BigInt(balanceString);
}

const balanceToAPY = (balance) => {
  const balanceNumber = balanceToBigInt(balance);
  const apyNumber = Number(balanceNumber) / 10000;
  return apyNumber.toFixed(2);
}

// Convert balance to a unit number, based on money base 10^12.
const balanceToUnitNumber = (balance) => {
  const balanceString = balance.toString();
  const balanceBigInt = BigInt(balanceString);
  const mid = balanceBigInt / 1000000n;
  const midNumber = Number(mid);
  return midNumber / 1000000;
}

const numberToReadableString = (number) => {
  if (number > 1000000000) {
    const finalNumber = Math.floor(number / 10000000) / 100;
    return finalNumber + 'B';
  }
  if (number > 1000000) {
    const finalNumber = Math.floor(number / 10000) / 100;
    return finalNumber + 'M';
  }
  if (number > 1000) {
    const finalNumber = Math.floor(number / 10) / 100;
    return finalNumber + 'K';
  }
  if (number > 1) {
    return Math.floor(number * 100) / 100;
  }
  return number;
}

const balanceToReadableString = (balance, base) => {
  const balanceNumber = balanceToUnitNumber(balance);
  return numberToReadableString(balanceNumber);
};

export {
  balanceToAPY,
  balanceToUnitNumber,
  numberToReadableString,
  balanceToReadableString
};
