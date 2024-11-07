import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';

interface PriceDisplayProps {
  watchList: string[];
}

interface PriceData {
  [key: string]: {
    time: number[];
    price: number[];
  };
}

const intervals = {
  daily: '1d',
  weekly: '1w',
  monthly: '1M',
 
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ watchList }) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({});
  const [selectedInterval, setSelectedInterval] = useState<'daily' | 'weekly' | 'monthly' >('daily');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      const newPrices: PriceData = {};
      for (const pair of watchList) {
        try {
          const interval = intervals[selectedInterval];
          const limit =  selectedInterval === 'monthly' ? 30 : selectedInterval === 'weekly' ? 52 : 365;
          const response = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
              symbol: pair,
              interval: interval,
              limit: limit,
            },
          });
          const data = response.data.map((item: any) => ({
            time: item[0],
            price: parseFloat(item[4]), // Closing price
          }));
          newPrices[pair] = {
            time: data.map((d: any) => d.time),
            price: data.map((d: any) => d.price),
          };
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      setPrices(newPrices);
      setLoading(false);
    };

    if (watchList.length > 0) {
      fetchHistoricalData();
    } else {
      setPrices({});
    }
  }, [watchList, selectedInterval]);

  // Fetch real-time price updates
  useEffect(() => {
    let ws: WebSocket;
    if (watchList.length > 0) {
      const streams = watchList.map((pair) => `${pair.toLowerCase()}@ticker`).join('/');
      ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const symbol = message.data.s;
        const price = parseFloat(message.data.c); // Current price
        setCurrentPrices((prevPrices) => ({ ...prevPrices, [symbol]: price }));
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [watchList]);

  const getOption = (pair: string) => {
    return {
      backgroundColor: 'transparent',
      title: {
        text: pair,
        left: 'center',
        textStyle: {
          color: '#00D4FF',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: '#00D4FF',
        textStyle: {
          color: '#E0E0E0',
        },
      },
      xAxis: {
        type: 'category',
        data: prices[pair]?.time.map((t) => {
          const date = new Date(t);
          switch (selectedInterval) {
            case 'daily':
              return date.toLocaleDateString();
            case 'weekly':
            case 'monthly':
              return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
            default:
              return date.toLocaleDateString();
          }
        }),
        axisLabel: {
          color: '#E0E0E0',
        },
        axisLine: {
          lineStyle: {
            color: '#555555',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#E0E0E0',
        },
        axisLine: {
          lineStyle: {
            color: '#555555',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#222222',
          },
        },
      },
      series: [
        {
          data: prices[pair]?.price,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#FF00FF',
            width: 2,
          },
          areaStyle: {
            color: 'rgba(255, 0, 255, 0.1)',
          },
          showSymbol: false,
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true,
      },
    };
  };
  

  return (
    <div className="section price-display">
      <h2>Real-Time Prices</h2>
      <div className="interval-buttons">
        {(['daily', 'weekly', 'monthly'] as const).map((interval) => (
          <button
            key={interval}
            onClick={() => setSelectedInterval(interval)}
            className={selectedInterval === interval ? 'active' : ''}
          >
            {interval.charAt(0).toUpperCase() + interval.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        watchList.map((pair) => (
          <div key={pair} className="chart-container">
            <ReactEcharts option={getOption(pair)} style={{ height: '300px' }} />
            <div className="current-price">
              Current Price: ${currentPrices[pair] ? currentPrices[pair].toFixed(2) : 'Loading...'}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PriceDisplay;
