const fetchUserBalance = async (updateUserBalance, accountAddress) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const url =
    'https://parachain.konomi.tech/indexer/floatingRateLend/balances/' +
    accountAddress;
  await fetch(url, requestOptions)
    .then(response => {
      const asyncHandleResponse = async () => {
        const data = await response.json();
        if (response.status == 200 && response.ok && data) {
          const { totalSupply, totalCollateral, totalBorrow } = data.data;
          updateUserBalance({
            totalSupply: parseInt(totalSupply) / 100000,
            totalDebt: parseInt(totalBorrow) / 100000,
            totalCollateral: parseInt(totalCollateral) / 100000,
          });
        } else {
          // TODO: dispatch failure
          console.log('fetch user balance fail');
        }
      };
      asyncHandleResponse();
    })
    .catch(error => {
      // TODO: dispatch error
      console.log('fetch user balance error');
    });
};

export { fetchUserBalance };
