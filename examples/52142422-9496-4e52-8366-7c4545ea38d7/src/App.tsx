import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, ArrowRightLeft } from 'lucide-react';

// Common currencies
const currencies = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'
];

function App() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`
        );
        
        if (!response.ok) {
          throw new Error('网络请求失败');
        }
        
        const data = await response.json();
        
        if (!data.rates || !data.rates[toCurrency]) {
          throw new Error('无效的汇率数据');
        }
        
        setExchangeRate(data.rates[toCurrency]);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setError('获取汇率失败，请稍后重试');
        setExchangeRate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getConvertedAmount = () => {
    if (!exchangeRate || !amount || isNaN(parseFloat(amount))) {
      return '0.00';
    }
    return (parseFloat(amount) * exchangeRate).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">货币转换器</h1>
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              金额
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="请输入金额"
              min="0"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                从
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwapCurrencies}
              className="mt-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="交换货币"
            >
              <ArrowRightLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                到
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-gray-600">加载中...</span>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-900">
                  {getConvertedAmount()} {toCurrency}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  1 {fromCurrency} = {exchangeRate?.toFixed(4) || '0.0000'} {toCurrency}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          汇率实时更新
        </div>
      </div>
    </div>
  );
}

export default App;