import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 30;
const numCols = 40;
let genNum = 0;
//( a )Examine state of all eight neighbors 
//(it's up to you whether you want cells to wrap around 
//the grid and consider cells on the other side or not)
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

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
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running
  // console.log(running)
  const runGameofLife = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    //( b ) simulation code - Apply rules of life to determine if this cell will change states
    setGrid(g => {
      genNum = genNum +1;
      console.log(genNum)
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
    setTimeout(runGameofLife, 1000);
    //send parameter is empty array so that function is only created once.
  }, []);

  return (
    <div className="App">
      
      <h1>Generation: {genNum}</h1>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runGameofLife()
          }else{
            runningRef.current = false
          }
        }}
      >
        {running ? "End" : "Begin"}
      </button>
      <button
        onClick={()=> {
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
          "Glider" : [[9, 12], [10,10], [11, 11], [11, 12], [10, 12]],
          "Blinker" : [[10, 10], [10, 11], [10, 12]],
          "Toad" : [[10, 10], [10, 11], [10, 12], [11, 9], [11, 10], [11, 11]]
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
    
<select id="set-speed" onChange={() => {
        const dropdown = document.getElementById("set-speed");
        const speedValue = dropdown.options[dropdown.selectedIndex].value;
        const speedScenarios = {
          "Slow" : setTimeout(runGameofLife, 500),
          "Normal" : [[10, 10], [10, 11], [10, 12]],
          "Fast" : [[10, 10], [10, 11], [10, 12], [11, 9], [11, 10], [11, 11]]
        }
        setGrid(createGrid(speedScenarios[speedValue]));
      }}>
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
          {genNum = 0}
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
            <div
              key={`${i}-${k}`}
              
              onClick={() => {
                if(!running){
                  const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;

                });
                setGrid(newGrid)
              }}}
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
