import { useEffect, useState } from "react";

export default function App() {
  const [formCurrency, setFormCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");

  function handleAmount(value) {
    setAmount(!isNaN(Number(value)) ? Number(value) : "");
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchExchangeRate() {
        try {
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${formCurrency}&to=${toCurrency}`,
            { signal: ReadableByteStreamController.signal }
          );

          if (!res.ok) throw new Error("Fetch fail");
          const exchangeRate = await res.json();
          setConvertedAmount(exchangeRate.rates[toCurrency]);
        } catch (err) {
          if (err.name === "AbortError") {
            console.error(err.message);
          }
        }
      }

      if (
        formCurrency !== toCurrency &&
        typeof amount === "number" &&
        amount !== 0
      )
        fetchExchangeRate();
      else setConvertedAmount("");
    },
    [formCurrency, toCurrency, amount]
  );
  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleAmount(e.target.value)}
        value={amount}
      />
      <select
        onChange={(e) => setFormCurrency(e.target.value)}
        value={formCurrency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="THB">THB</option>
        <option value="NZD">NZD</option>
      </select>
      <select
        onChange={(e) => setToCurrency(e.target.value)}
        value={toCurrency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="THB">THB</option>
        <option value="NZD">NZD</option>
      </select>
      <p>{`${convertedAmount} ${toCurrency}`}</p>
    </div>
  );
}
