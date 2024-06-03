const axios = require('axios');
const fs = require('fs');

const getTop100Cryptocurrencies = async () => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets';
    const params = {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        // Save data to a JSON file
        fs.writeFileSync('top_100_cryptocurrencies.json', JSON.stringify(data, null, 2));

        console.log('Top 100 cryptocurrencies data saved to top_100_cryptocurrencies.json');
    } catch (error) {
        console.error(`Error: Unable to fetch data (status code ${error.response.status})`);
    }
};

getTop100Cryptocurrencies();
