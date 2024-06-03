import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [data, setData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'ticker', direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/api/top-1000-cryptos');
            setData(result.data);
        };

        fetchData();
    }, []);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [data, sortConfig]);

    return (
        <div>
            <h1>Top 1000 Cryptocurrencies</h1>
            <table>
                <thead>
                <tr>
                    <th onClick={() => sortData('ticker')}>Ticker</th>
                    <th onClick={() => sortData('marketCap')}>Market Cap</th>
                    <th onClick={() => sortData('volume')}>Volume</th>
                    <th onClick={() => sortData('volumeToMarketCap')}>Volume/Market Cap</th>
                </tr>
                </thead>
                <tbody>
                {sortedData.map((coin) => (
                    <tr key={coin.ticker}>
                        <td>{coin.ticker}</td>
                        <td>{coin.marketCap}</td>
                        <td>{coin.volume}</td>
                        <td>{coin.volumeToMarketCap.toFixed(4)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;
