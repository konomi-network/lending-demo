const balanceToInt = (balance) => {
  const balanceString = balance.toString();
  const balanceInt = parseInt(balanceString);
  return balanceInt || 0;
};

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

export { balanceToInt, intToReadableString, balanceToReadableString };
