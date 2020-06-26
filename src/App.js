import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 30;
const numCols = 40;
let genNum = 0;
function createGrid(points) {
  const rows = [];
  let i = 0;
  for (i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  var coordinate;
  for (coordinate of points) {
    rows[coordinate[0]][coordinate[1]] = 1
  }

  return rows
}
//( a )Examine state of all eight neighbors 
//(it's up to you whether you want cells to wrap around 
//the grid and consider cells on the other side or not)
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
const clearGrid = () => {
  return createGrid([]);
}

function App() {
  const [grid, setGrid] = useState(() => {
    return clearGrid()
  });
  const [play, setPlay] = useState(false);
  // const [genNum, setGenNum] = useState(0);

  const runningRef = useRef(play);
  runningRef.current = play
  // console.log(play)
  const runGameofLife = useCallback(() => {
    genNum = genNum + 1;
    if (!runningRef.current) {
      return;
    }
    //( b ) simulation code - Apply rules of life to determine if this cell will change states
    setGrid(g => {
      //produce will set a new copy of grid and update new copy to setgrid 
      return produce(g, nextGen => {
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
              nextGen[i][k] = 0;
              //determines if a cell becomes one
            } else if (g[i][k] === 0 && neigbors === 3) {
              nextGen[i][k] = 1;
            }
          }
        }
      }) 
    })
    
    console.log(`genNum is ${genNum}`);
    const dropdown = document.getElementById("set-speed");
    const speedValue = dropdown.options[dropdown.selectedIndex].value;
    let speed;
    switch (speedValue) {
      case "Fast":
        speed = 500;
        break;
      case "Slow":
        speed = 1500;
        break;
      case "Normal":
      default:
        speed = 1000;
        break;
    }
    setTimeout(runGameofLife, speed);
    //send parameter is empty array so that function is only created once.
  }, []);

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <h1>Generation: {genNum}</h1>
      <button
        onClick={() => {
          setPlay(!play);
          if (!play) {
            runningRef.current = true;
            runGameofLife()
          } else {
            runningRef.current = false
          }
        }}
      >
        {play ? "End" : "Begin"}
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.round(Math.random())));
          }
          setGrid(rows)
        }}>
        Random
      </button>

      <select id="first-choice" onChange={() => {
        const dropdown = document.getElementById("first-choice");
        const value = dropdown.options[dropdown.selectedIndex].value;
        const scenarios = {
          "Glider": [[9, 12], [10, 10], [11, 11], [11, 12], [10, 12]],
          "Blinker": [[10, 10], [10, 11], [10, 12]],
          "Toad": [[10, 10], [10, 11], [10, 12], [11, 9], [11, 10], [11, 11]]
        }
        setGrid(createGrid(scenarios[value]));
      }}>
        <option selected value="base">Select Starting Point</option>
        <option value="Glider">
          Glider
   </option>
        <option value="Blinker">
          Blinker
   </option>
        <option value="Toad">
          Toad
   </option>
      </select>

      <select id="set-speed">
        <option selected value="base">Select Speed</option>
        <option value="Slow">
          Slow
   </option>
        <option value="Normal">
          Normal
   </option>
        <option value="Fast">
          Fast
   </option>
      </select>

      <button
        onClick={() => {
          setGrid(clearGrid())
          { genNum = 0 }
        }}
      >
        Clear
      </button>
      <header className="App-header" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 25px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) =>
            <div className="grid"
              key={`${i}-${k}`}

              onClick={() => {
                if (!play) {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;

                  });
                  setGrid(newGrid)
                }
              }}
              style={{
                 backgroundColor: grid[i][k] ? 'pink' : undefined,
                 border: 'solid 1px white', borderRadius:'2px'
              }}
            />))}
      </header>
    </div>
  );
}

export default App;
