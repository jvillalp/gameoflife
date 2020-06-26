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
    //push columns (array) array from array(numCols), make a initital state of all zero's
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
  //useState as values will keep changing
  const [grid, setGrid] = useState(() => {
    return clearGrid()
  });
  const [play, setPlay] = useState(false);

  //useRef returns a mutable ref object whose .current property is 
  //initialized to the passed argument (initialValue). 
  //The returned object will persist for the full lifetime of the component.
  const playRef = useRef(play);
  //current value is whatever is currently being looped through
  playRef.current = play
  // console.log(play)

  //Pass an inline callback and an array of dependencies. useCallback 
  //will return a memoized version of the callback that only changes 
  //if one of the dependencies has changed. This is useful when passing 
  //callbacks to optimized child components that rely on reference equality 
  //to prevent unnecessary renders (e.g. shouldComponentUpdate).

  const singleGameOfLife = () => {
    genNum = genNum + 1;
    //( b ) simulation code - Apply rules of life to determine if this cell will change states
    //setgrid to change state of grid
    //g is new value of grid
    setGrid(g => {
      //produce will set a new copy of grid and update new copy to setgrid 
      //The produce function takes a function which accepts draft as an argument. 
      //It is inside this function that we can then set the draft copy with which 
      //we want to update our state.
      //nextGen is what we want to copy
      return produce(g, nextGen => {
        /* two for loops (interate) between col and rows*/
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neigbors = 0;
            //array of operations, in operations cols do not change
            opperations.forEach(([x, y]) => {
              const newGenI = i + x;
              const newGenK = k + y;
              //check bounce in corner areas - will stay alive if in the corners 
              if (newGenI >= 0 && newGenI < numRows && newGenK >= 0 < numCols) {
                //neigbor add to new grid copy, if live cell, will add 1 to neighbors
                neigbors += g[newGenI][newGenK]
              }
            })
            //determines if a cell becomes zero
            //first three rules
            if (neigbors < 2 || neigbors > 3) {
              nextGen[i][k] = 0;
              //determines if a cell becomes one
              //4 rule - makes cell comes to live
            } else if (g[i][k] === 0 && neigbors === 3) {
              nextGen[i][k] = 1;
            }
          }
        }
      })
    });
  }

  const runGameofLife = useCallback(() => {
    //if not running, return - base case
    if (!playRef.current) {
      return;
    }
    singleGameOfLife();
    //to be able to change the speed of the simulation
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
    /*setimeout - two params - function and speed amount in ms
    recursive : calls itself at a set speed */
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
            playRef.current = true;
            runGameofLife()
          } else {
            playRef.current = false
          }
        }}
      >
        {play ? "End" : "Begin"}
      </button>
      <button
        onClick={() => {
          singleGameOfLife();
        }}>
        Next Generation
      </button>
      <input type="text" id="gen-num"/>
      <button
        onClick={() => {
          const n = document.getElementById("gen-num").value;
          if (n !== undefined) {
            const nthValue = parseInt(n, 10);
            for (let a = 0; a< nthValue;a++){
              singleGameOfLife();
            }
          }
        }}
      >
        Nth Generation
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
        /* gridtemplatecolumns has to parameters to show repeat of num of cols and the size (25px)*/
        gridTemplateColumns: `repeat(${numCols}, 25px)`
      }}>
        {/* map over the createGrid funtion, 
        rows is an array so map over that too 
        in rows map over each col to display
        [] map through row and index (i) */}
        {grid.map((rows, i) =>

          rows.map((col, k) =>
            <div className="grid"
              /* key i is row , k is col */
              key={`${i}-${k}`}
              /* onClick to click on cell and change from 0 to 1 from 1 to 0 */
              onClick={() => {
                if (!play) {
                  /* produce from immer : pass intital grid, and sec param as nextGen clone copy of the grid  
                  produce will create a new grid for us */
                  const newGenGrid = produce(grid, gridClone => {
                    /* if alive make dead else make alive - this is to be able to toggle back and forth */
                    gridClone[i][k] = grid[i][k] ? 0 : 1;
                  });
                  /* now can set state to a new one and back and forth. */
                  setGrid(newGenGrid)
                }
              }}
              /* if alive grid[i][k] or 1, cell is pink else, undefined, styling to diffrenciate 0 vs 1 */
              style={{
                backgroundColor: grid[i][k] ? 'pink' : undefined,
              }}
            />))}
      </header>
    </div>
  );
}

export default App;
