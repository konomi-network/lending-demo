const fetchPools = async updatePools => {
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
          console.log(data.items);
          const payload = {};
          for (const pool of data.items) {
            const abbr = pool.name;
            payload[abbr] = pool;
          }
          console.log('pools');
          console.log(payload);
          updatePools(payload);
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
