import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CryptoListProps {
  onAddPair: (pair: string) => void;
  isAdding: boolean;
}

const CryptoList: React.FC<CryptoListProps> = ({ onAddPair, isAdding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoPairs, setCryptoPairs] = useState<string[]>([]);
  const [filteredPairs, setFilteredPairs] = useState<string[]>([]);

  useEffect(() => {
    // Fetch all available symbols from Binance
    const fetchSymbols = async () => {
      const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
      const symbols = response.data.symbols
        .filter((symbol: any) => symbol.quoteAsset === 'USDT')
        .map((symbol: any) => symbol.symbol);
      setCryptoPairs(symbols);
      setFilteredPairs(symbols);
    };
    fetchSymbols();
  }, []);

  useEffect(() => {
    const filtered = cryptoPairs.filter((pair) =>
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPairs(filtered);
  }, [searchTerm, cryptoPairs]);

  return (
    <div className="section crypto-list">
      <h2>Crypto Pairs</h2>
      <input
        type="text"
        placeholder="Search for a pair..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul>
        {filteredPairs.slice(0, 20).map((pair) => (
          <li key={pair}>
            <span>{pair}</span>
            <button onClick={() => onAddPair(pair)} disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add to Watchlist'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoList;
