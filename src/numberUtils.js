/* global BigInt */

// Convert balance to BigInt number.
const balanceToBigInt = (balance) => {
  const balanceString = balance.toString();
  return BigInt(balanceString);
}

// Convert balance to APY number with 2 fixed decimal.
const balanceToAPY = (balance) => {
  const balanceNumber = balanceToBigInt(balance);
  // APY number is timed by 10000 in the server side
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

// Convert a number to readable string.
// Cut the number to a float with 2 decimals when it's too large.
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
  return Math.floor(number * 10000) / 10000;
}

// Convert the balance to a readable string.
const balanceToReadableString = (balance, base) => {
  const balanceNumber = balanceToUnitNumber(balance);
  return numberToReadableString(balanceNumber);
};

export {
  balanceToBigInt,
  balanceToAPY,
  balanceToUnitNumber,
  numberToReadableString,
  balanceToReadableString
};
