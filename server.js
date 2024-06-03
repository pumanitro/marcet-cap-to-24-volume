const axios = require('axios');
const fs = require('fs');

const getTop1000Cryptocurrencies = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets';
    const perPage = 250;
    const totalPages = 4; // 1000 / 250 = 4
    const allData = [];

    for (let page = 1; page <= totalPages; page++) {
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: perPage,
            page: page,
            sparkline: false
        };

        try {
            const response = await axios.get(url, { params });
            const data = response.data;
            allData.push(...data);
        } catch (error) {
            console.error(`Error on page ${page}: Unable to fetch data (status code ${error.response ? error.response.status : 'unknown'})`);
            return;
        }
    }

    // Map to get data: ticker, market cap, 24h volume, 24h volume/market cap
    const mappedData = allData.map((coin) => {
        return {
            ticker: coin.symbol.toUpperCase(),
            marketCap: coin.market_cap,
            volume: coin.total_volume,
            volumeToMarketCap: coin.total_volume / coin.market_cap
        };
    });

    // Save data to a JSON file
    fs.writeFileSync('top_1000_cryptocurrencies.json', JSON.stringify(mappedData, null, 2));

    console.log('Top 1000 cryptocurrencies data saved to top_1000_cryptocurrencies.json');
};

getTop1000Cryptocurrencies();
