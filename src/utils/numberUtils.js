/* global BigInt */

const u128Base = 1000000000000;

// Convert balance to BigInt number.
const balanceToBigInt = balance => {
  const balanceString = balance.toString();
  return BigInt(balanceString);
};

// Convert balance to APY number with 2 fixed decimal.
const balanceToAPY = balance => {
  const balanceNumber = balanceToBigInt(balance);
  // APY number is timed by 10000 in the server side
  const apyNumber = Number(balanceNumber) / 10000;
  return apyNumber.toFixed(2);
};

// Convert balance to a unit number, based on money base 10^12.
const balanceToUnitNumber = balance => {
  const balanceString = balance.toString();
  console.log('balanceString, ' + balanceString);
  const balanceBigInt = BigInt(balanceString);
  const tmp = balanceBigInt / 1000000n;
  const tmpNumber = Number(tmp);
  return tmpNumber / 1000000;
};

// Convert a number to readable string.
// Cut the number to a float with at most 2 decimals when it's too large.
const numberToReadableString = (number, isUSD = false) => {
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
  if (isUSD) {
    return Math.floor(number * 100) / 100;
  }
  return Math.floor(number * 10000) / 10000;
};

// Convert the balance to a readable string.
const balanceToReadableString = (balance, base) => {
  const balanceNumber = balanceToUnitNumber(balance);
  return numberToReadableString(balanceNumber);
};

// Convert the FixedU128 number to regular int number. (Divided by 10^18)
const fixed32ToNumber = number => {
  const balanceString = number.toString();
  const balanceBigInt = BigInt(balanceString);
  const tmp = balanceBigInt / 1000000000000n;
  const tmpNumber = Number(tmp);
  return tmpNumber / 1000000;
};

// Convert the FixedU128 number to APY
const fixed32ToAPY = number => {
  // APY number is timed by 10^18 in the server side
  const tmp = balanceToUnitNumber(number);
  const apy = ((tmp * 518400) / 100000) * 100;
  return apy.toFixed(2);
};

// Convert the u128 string to number. Omit the e-7.
const u128StringToNumber = stringNumber => {
  const balanceBigInt = BigInt(stringNumber);
  const tmp = balanceBigInt / 1000000n;
  const tmpNumber = Number(tmp);
  return tmpNumber / 1000000;
};

const priceToNumber = price => {
  const priceString = price.toString();
  const priceBigInt = BigInt(priceString);
  const finalPriceBigInt = priceBigInt / 100000n;
  return Number(finalPriceBigInt) / 1000;
};

const numberToU128String = number => {
  let buffer = 1n;
  while (number > 9000) {
    number = number / 10;
    buffer = buffer * 10n;
  }
  const numberBigInt = BigInt(Math.floor(number * u128Base)) * buffer;
  return numberBigInt.toString();
};

export {
  balanceToBigInt,
  balanceToAPY,
  balanceToUnitNumber,
  numberToReadableString,
  balanceToReadableString,
  fixed32ToNumber,
  fixed32ToAPY,
  u128StringToNumber,
  priceToNumber,
  numberToU128String,
};
