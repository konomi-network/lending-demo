import { sortBy } from 'lodash';
const DEFAULT_COIN_ORDER = { KONO: 0, BTC: 1, ETH: 2, DOT: 3, DORA: 4, LIT: 5 };

const fetchPools = async (updatePools, updateAssets = () => {}) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  await fetch(
    'https://parachain.konomi.tech/indexer/floatingRateLend/pools',
    requestOptions
  )
    .then(response => {
      const asyncHandleResponse = async () => {
        const data = await response.json();
        if (response.status == 200 && response.ok && data) {
          console.log(
            '🚀 ~ file: poolServices.js ~ line 17 ~ asyncHandleResponse ~ data',
            data
          );
          const payload = {};
          for (const pool of data.items) {
            const abbr = pool.name;
            payload[abbr] = pool;
            payload[abbr]['order'] = DEFAULT_COIN_ORDER[abbr];
          }
          updatePools(payload);
          // ensure list is sorted in DEFAULT_COIN_ORDER
          updateAssets({
            assets: sortBy(Object.values(payload), 'order'),
            decimals: data.decimals,
          });
        } else {
          // TODO: dispatch failure
          console.log('fetch pools fail');
        }
      };
      asyncHandleResponse();
    })
    .catch(error => {
      // TODO: dispatch error
      console.log('fetch pools error');
    });
};

export { fetchPools };
