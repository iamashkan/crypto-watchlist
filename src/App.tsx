import React, { useState } from 'react';
import CryptoList from './components/CryptoList';
import WatchList from './components/WatchList';
import PriceDisplay from './components/PriceDisplay';
import { addPairToWatchlist } from './api/backend';

const App: React.FC = () => {
  const [watchList, setWatchList] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAddPair = async (pair: string) => {
    setIsAdding(true);
    try {
      await addPairToWatchlist(pair);
      if (!watchList.includes(pair)) {
        setWatchList([...watchList, pair]);
      }
      setError('');
    } catch (err) {
      setError("Error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePair = (pair: string) => {
    setWatchList(watchList.filter((item) => item !== pair));
  };

  return (
    <div className="app">
      <h1>Crypto Watchlist</h1>
      {error && <p className="error">{error}</p>}
      <div className="container">
        <CryptoList onAddPair={handleAddPair} isAdding={isAdding} />
        <WatchList watchList={watchList} onRemovePair={handleRemovePair} />
      </div>
      <PriceDisplay watchList={watchList} />
    </div>
  );
};

export default App;
