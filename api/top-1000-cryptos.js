const axios = require('axios');

module.exports = async (req, res) => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets';
    const perPage = 250;
    const totalPages = 4; // 1000 / 250 = 4
    const allData = [];

    try {
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
            } catch (innerError) {
                console.error(`Error fetching data on page ${page}:`, innerError);
                res.status(500).json({ error: `Failed to fetch data on page ${page}` });
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

        res.status(200).json(mappedData);
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
