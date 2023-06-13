import { useEffect, useState } from "react";
import "./App.css";

import Nav from "./components/Nav";
import axios from "axios";

function App() {
  const [currency, setCurrency] = useState([]);
  const [input, setInput] = useState({
    input1: 0,
    input2: 0,
    select1: "USD",
    select2: "INR",
  });
  const [rate, setRate] = useState(0);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/currency")
      .then((res) => {
        setCurrency(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchRate = () => {
    axios
      .get(`http://localhost:3000/rates/${input.select2}`)
      .then((res) => {
        setRate(res.data.value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConvert = () => {
    axios
      .post(`http://localhost:3000/convert/${input.select1}/${input.select2}`, {
        input: input.input1,
      })
      .then((res) => {
        setInput({ ...input, input2: res.data.result.toFixed(2) });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRate();
  }, [input.select2]);

  useEffect(() => {
    if (input.input1) {
      handleConvert();
    }
  }, [input.select2]);

  return (
    <div>
      <Nav />
      <div className="master">
        <div className="user-input">
          <div className="title">
            From:
            <select
              className="select"
              value={input.select1}
              onChange={(e) => {
                setInput({ ...input, select1: e.target.value });
              }}
            >
              {currency?.map((item, i) => {
                return <option key={i}>{item}</option>;
              })}
            </select>
          </div>
          <>
            <input
              className="input"
              value={input.input1}
              onChange={(e) => {
                setInput({ ...input, input1: e.target.value });
              }}
              type="number"
            />
          </>
          <div>
            Conversion Rate for {input.select2}: {rate}
          </div>
        </div>
        <div className="user-input">
          <div className="title">
            To:
            <select
              className="select"
              value={input.select2}
              onChange={(e) => {
                setInput({ ...input, select2: e.target.value });
              }}
            >
              {currency?.map((item, i) => {
                return <option key={i}>{item}</option>;
              })}
            </select>
          </div>
          <input
            className="input"
            value={input.input2}
            disabled
            onChange={(e) => {
              setInput({ ...input, input2: e.target.value });
            }}
            type="number"
          />
        </div>
      </div>
      <div className="button-container">
        <button onClick={handleConvert}>Convert</button>
      </div>
    </div>
  );
}

export default App;
