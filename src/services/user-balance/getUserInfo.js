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
  await fetch('https://app.konomi.tech/rpc', requestOptions)
    .then(response => {
      const asyncHandleResponse = async () => {
        const data = await response.json();
        if (response.status == 200 && response.ok && data) {
          const [supplyBalance, borrowLimit, debtBalance] = data.result;
          setAccountBalance({
            supplyBalance: u128StringToNumber(supplyBalance),
            borrowLimit: u128StringToNumber(borrowLimit),
            debtBalance: u128StringToNumber(debtBalance),
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
