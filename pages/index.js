import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const [data, setData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'volumeToMarketCap', direction: 'descending' });

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const coins = urlParams.get('coins') || 10; // Default to 1000 if not provided

            try {
                const result = await axios.get(`/api/top-x-cryptos?coins=${coins}`);
                setData(result.data);
            } catch (e) {
                console.error('Unexpected error:', e);
            }
        };

        fetchData();
    }, []);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
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

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? faArrowUp : faArrowDown;
        }
        return null;
    };

    return (
        <div>
            <h1>Volume/Market Cap Ranking</h1>
            <table>
                <thead>
                <tr>
                    <th>MC Rank</th>
                    <th onClick={() => sortData('ticker')}>
                        Ticker <FontAwesomeIcon icon={getSortIcon('ticker')} />
                    </th>
                    <th onClick={() => sortData('marketCap')}>
                        Market Cap <FontAwesomeIcon icon={getSortIcon('marketCap')} />
                    </th>
                    <th onClick={() => sortData('volume')}>
                        Volume <FontAwesomeIcon icon={getSortIcon('volume')} />
                    </th>
                    <th onClick={() => sortData('volumeToMarketCap')}>
                        Volume/Market Cap <FontAwesomeIcon icon={getSortIcon('volumeToMarketCap')} />
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedData.map((coin, index) => (
                    <tr key={coin.ticker + index}>
                        <td>{coin.rank}</td>
                        <td>{coin.ticker}</td>
                        <td>{coin.marketCap}</td>
                        <td>{coin.volume}</td>
                        <td>{coin.volumeToMarketCap.toFixed(4)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <style jsx>{`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                th {
                    position: sticky;
                    top: 0;
                    background-color: #f9f9f9;
                    cursor: pointer;
                }
                th svg {
                    margin-left: 5px;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
