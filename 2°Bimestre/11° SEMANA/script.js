import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { StrictMode } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { useState } from "https://esm.sh/react";


function Square() {
  const [value, setValue] = useState(null);
  function handleClick() {
    setValue ('X');
  }
  
  return (
    <button className="square" onClick={handleClick}>
      {value}
    </button>
  );
}


function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}


const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Board />
  </StrictMode>
);
