import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 30;
const numCols = 50;
const opperations = [
  [0, 1],
  [0, -1],
  [-1, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [1, 0],
  [-1, 0]
]
function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runGameofLife = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    //simulation code
    setGrid(g => {
      //produce will set a new copy of grid and update new copy to setgrid 
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neigbors = 0;
            opperations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 < numCols) {
                neigbors += g[newI][newK]
              }
            })
            //determines if a cell becomes zero
            if (neigbors < 2 || neigbors > 3) {
              gridCopy[i][k] = 0;
              //determines if a cell becomes one
            } else if (g[i][k] === 0 && neigbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    })
    setTimeout(runGameofLife, 1000);
    //send parameter is empty array so that function is only created once.
  }, []);

  return (
    <div className="App">
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runGameofLife()
          }
        }}
      >
        {running ? "End" : "Begin"}
      </button>
      <header className="App-header" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) =>
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;

                });
                setGrid(newGrid)
              }}
              style={{
                width: 20,
                height: 20, backgroundColor: grid[i][k] ? 'pink' : undefined,
                border: 'solid 1px white'
              }}
            />))}
      </header>
    </div>
  );
}

export default App;
