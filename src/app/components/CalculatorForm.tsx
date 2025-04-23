// components/CalculatorForm.tsx
"use client";
import { useState, useMemo } from "react";

interface computation {
  key: number;
  leverage: number;
  margin: number;
  stopLoss: number;
  takeProfit: number;
  profit: number;
}

export default function CalculatorForm() {
  const leverages = [2, 3, 5, 10, 15, 20, 30, 50, 100, 125];
  const [initialCapital, setInitialCapital] = useState<number>(0);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(0);
  const [numberOfTrades, setNumberOfTrades] = useState<number>(0);
  const [stopLossPercent, setStopLossPercent] = useState<number>(0);
  const [takeProfitPercent, setTakeProfitPercent] = useState<number>(0);

  const lossPerTrade = useMemo(() => {
    if (!initialCapital || !riskPerTrade || !numberOfTrades) return 0;
    return (initialCapital * (riskPerTrade * 0.01)) / numberOfTrades;
  }, [initialCapital, riskPerTrade, numberOfTrades]);

  const positionSize = useMemo(() => {
    if (!lossPerTrade || !stopLossPercent) return 0;
    return lossPerTrade / (stopLossPercent * 0.01);
  }, [lossPerTrade, stopLossPercent]);

  const calculatedTable = useMemo<computation[]>(() => {
    if (!positionSize || !stopLossPercent || !takeProfitPercent) return [];

    return leverages.map((lev, i) => {
      const margin = positionSize / lev;
      const stopLoss = stopLossPercent * lev;
      const takeProfit = takeProfitPercent * lev;
      const profit = takeProfit * 0.01 * margin;

      return {
        key: i,
        leverage: lev,
        margin,
        stopLoss,
        takeProfit,
        profit,
      };
    });
  }, [leverages, positionSize, stopLossPercent, takeProfitPercent]);

  return (
    <div className="max-w-xl mx-auto my-10 p-4 bg-white rounded-2xl shadow-md space-y-6">
      <div className="flex justify-center items-center">
        <h1 className="text-xl font-bold">Trading Calculator</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label>
          Initial Capital ($)
          <input
            type="number"
            value={initialCapital}
            onChange={(e) => setInitialCapital(+e.target.value)}
            className="w-full p-2 border rounded"
            step="any"
          />
        </label>

        <label>
          Risk per Trade (%)
          <input
            type="number"
            value={riskPerTrade}
            onChange={(e) => setRiskPerTrade(+e.target.value)}
            className="w-full p-2 border rounded"
            step="any"
          />
        </label>

        <label>
          Number of Trades
          <input
            type="number"
            value={numberOfTrades}
            onChange={(e) => setNumberOfTrades(+e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label>
          Loss per Trade ($)
          <input
            disabled
            type="number"
            value={lossPerTrade.toFixed(2)}
            className="w-full p-2 border rounded bg-yellow-100"
          />
        </label>

        <label>
          Stop Loss (%)
          <input
            type="number"
            value={stopLossPercent}
            onChange={(e) => setStopLossPercent(+e.target.value)}
            className="w-full p-2 border rounded"
            step="any"
          />
        </label>

        <label>
          Take Profit (%)
          <input
            type="number"
            value={takeProfitPercent}
            onChange={(e) => setTakeProfitPercent(+e.target.value)}
            className="w-full p-2 border rounded"
            step="any"
          />
        </label>

        <label>
          Position Size ($)
          <input
            disabled
            type="number"
            value={positionSize.toFixed(2)}
            className="w-136 p-2 border rounded bg-yellow-100"
          />
        </label>
      </div>

      <table className="w-full border-collapse border border-gray-400 text-center">
        <thead className="bg-blue-100 text-gray-800 font-semibold">
          <tr>
            <th className="border border-gray-300 p-2">Leverage</th>
            <th className="border border-gray-300 p-2">Margin</th>
            <th className="border border-gray-300 p-2">Stop Loss (%)</th>
            <th className="border border-gray-300 p-2">Take Profit (%)</th>
            <th className="border border-gray-300 p-2">Profit ($)</th>
          </tr>
        </thead>
        <tbody>
          {calculatedTable.length > 0 ? (
            calculatedTable.map((data) => {
              let rowColor = "bg-white";
              if (data.leverage <= 20) rowColor = "bg-green-100";
              else if (data.leverage <= 50) rowColor = "bg-yellow-100";
              else rowColor = "bg-red-100";

              const isMarginTooHigh = data.margin > initialCapital;

              return (
                <tr key={data.key} className={rowColor}>
                  <td className="border border-gray-300 p-2">
                    {data.leverage}
                  </td>
                  <td
                    className={`border border-gray-300 p-2  ${
                      isMarginTooHigh ? "text-red-700 line-through" : ""
                    }`}
                  >
                    ${data.margin.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {data.stopLoss.toFixed(2)}%
                  </td>
                  <td className="border border-gray-300 p-2">
                    {data.takeProfit.toFixed(2)}%
                  </td>
                  <td className="border border-gray-300 p-2 text-green-700 font-bold">
                    ${data.profit.toFixed(2)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-2">
                Enter values to see results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
