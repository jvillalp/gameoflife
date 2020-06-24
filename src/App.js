import React, { useState } from 'react';
import './App.css';

const numRows = 50;
const numCols = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows
  });

  console.log(grid)
  return (
    <div className="App">
      <header className="App-header" style={{
        display:'grid',
        gridTemplateColumns:`repeat(${numCols}, 20px)`
    }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => 
          <div 
            key = {`${i}-${k}`}
            onClick={()=> {
              grid[i][k] = 1
            }}
            style={{ width: 20, 
            height: 20, backgroundColor:[i][k] ? 'pink' : undefined,
            border: 'solid 1px white'}} 
            />) )}
      </header>
    </div>
  );
}

export default App;
