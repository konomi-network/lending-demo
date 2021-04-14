import { u128StringToNumber } from 'utils/numberUtils';

const fetchUserInfo = async (setAccountBalance, accountAddress) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'lending_getUserInfo',
      params: [accountAddress],
    }),
    redirect: 'follow',
  };
  await fetch('https://konomi.tech/rpc', requestOptions)
    .then(response => {
      const asyncHandleResponse = async () => {
        const data = await response.json();
        console.log('data');
        console.log(data);
        if (response.status == 200 && response.ok && data) {
          const { totalSupply, borrowLimit, totalBorrow } = data.result;
          setAccountBalance({
            supplyBalance: u128StringToNumber(totalSupply),
            borrowLimit: u128StringToNumber(borrowLimit),
            debtBalance: u128StringToNumber(totalBorrow),
          });
        } else {
          // TODO: dispatch failure
          console.log('fetch user info fail');
        }
      };
      asyncHandleResponse();
    })
    .catch(error => {
      // TODO: dispatch error
      console.log('fetch user info error');
    });
};

export { fetchUserInfo };
