import React from 'react';

interface WatchListProps {
  watchList: string[];
  onRemovePair: (pair: string) => void;
}

const WatchList: React.FC<WatchListProps> = ({ watchList, onRemovePair }) => {
  return (
    <div className="section watch-list">
      <h2>Watchlist</h2>
      <ul>
        {watchList.map((pair) => (
          <li key={pair}>
            <span>{pair}</span>
            <button onClick={() => onRemovePair(pair)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WatchList;
