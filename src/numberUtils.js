/* global BigInt */

const balanceToInt = (balance) => {
  const balanceString = balance.toString();
  const balanceInt = parseInt(balanceString);
  return balanceInt || 0;
};

const balanceToBigInt = (balance) => {
  const balanceString = balance.toString();
  return BigInt(balanceString);
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
  return Math.floor(number * 100) / 100;
}

const intToReadableString = (number, base) => {
  const intNumber = number / base;
  if (intNumber > 1000000000) {
    const finalNumber = intNumber / 1000000000;
    return finalNumber.toFixed(2) + 'b';
  }
  if (intNumber > 1000000) {
    const finalNumber = intNumber / 1000000;
    return finalNumber.toFixed(2) + 'm';
  }
  if (intNumber > 1000) {
    const finalNumber = intNumber / 1000;
    return finalNumber.toFixed(2) + 'k';
  }
  return intNumber.toFixed(2);
};

const balanceToReadableString = (balance, base) => {
  const balanceInt = balanceToInt(balance, 1);
  return intToReadableString(balanceInt / base);
};

export { balanceToInt, balanceToUnitNumber, numberToReadableString,
  intToReadableString, balanceToReadableString };
