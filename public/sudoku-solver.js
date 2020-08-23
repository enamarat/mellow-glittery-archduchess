const textArea = document.getElementById('text-input');
import { puzzlesAndSolutions} from './puzzle-strings.js';
const cells = document.querySelectorAll(".sudoku-input");

/*** functions ***/
/////////////////////////////
function showNumbersInTheGrid(input) {
  const regex = /[1-9.]/;
  let wrongInputDetected = false;

  if (input.length <= 81) {
    for (let i = 0; i < input.length; i++) {
      if (regex.test(input[i]) === true) {
        cells[i].value = input[i];
        if (input[i] === ".") {
          cells[i].value = "";
          wrongInputDetected = true;
        }
      } else {
        wrongInputDetected = true;
        return false;
      }
    }
    
    if (input.length < 81) {
      document.querySelector("#error-msg").textContent = `Not enough values! There must be 81 symbols in the text area! Please type more.`;
    }
    if (input.length === 81) {
      document.querySelector("#error-msg").textContent = ``;
    }
  } else if (input.length > 81) {
    document.querySelector("#error-msg").textContent = `Max limit of 81 values is exceeded! Grid has stopped accepting your data!`;
  }
  
  if (wrongInputDetected === false) {
    return true;
  } else {
    return false;
  }
}

/////////////////////////////////////
function changeNumbersInTheTextArea() {
  const gridValues = [];
  for (let i = 0; i < cells.length; i++) {
       if (cells[i].value === "") {
        gridValues.push(".");
      } else {
        gridValues.push(cells[i].value);
      }
      textArea.value = gridValues.join("");
  }
}

/////////////////////////////////////
function clearTextArea() {
  textArea.value = "";
   for (let i = 0; i < cells.length; i++) {
     cells[i].value = "";
   }
}

///////////////////////////////////
function solveSudoku(input) {
  if (input.length !== 81) {
    document.querySelector("#error-msg").textContent = `Error: Expected puzzle to be 81 characters long`;
    return false;
  }
  let validPuzzleString = true;
  let emptyCells = 0;
     for (let j = 0; j < cells.length; j++) {
      if (cells[j].value === "") {
        emptyCells++;
      }
    }
  let filledCells = 0;

  function findDigits(input) {
   for (let i = 0; i < input.length; i++) {
     if (validPuzzleString === false) {
       break;
     }
     
      if (validPuzzleString === true) {
       /// determine the column and the row in which the value is placed; collect numbers ///
       let row = null;
       let column = null;
       
       // determine the row
       if (i <= 8) {
         row = 1;
       } else {
         if (i%9 === 0) {
          row = Math.ceil(i/9) +1;
         } else {
          row = Math.ceil(i/9);
        }
       }
      //console.log(`The row is # ${row}`);
      
       // collect numbers from the row
       const rowNumbers = [];
       for(let j = (row*9)-9; j < row*9; j++) {
         if (input[j] !== ".") {
           rowNumbers.push(input[j]);
         }
       }
      //console.log(`rowNumbers: ${rowNumbers}`);
     // check for repeating numbers
     let rowCounts = {};
     rowNumbers.forEach(function(number) { rowCounts[number] = (rowCounts[number] || 0)+1; });
     for (let property in rowCounts) {
       if (rowCounts[property] > 1) {
         console.log("Duplicate!");
         validPuzzleString = false;
         break;
       }
     }
       
        // determine the column
       if (i === 0 || i%9 === 0) {
         column = 1;
       } else  {
         column = (i%9)+1;
       }
       //console.log(`column is ${column}`);
       
       //collect numbers from the column
       const columnNumbers = [];
       for(let j = column-1; j < column+72; j += 9) {
         if (input[j] !== ".") {
           columnNumbers.push(input[j]);
         }
       }
      //console.log(`columnNumbers: ${columnNumbers}`);
        // check for repeating numbers
       let columnCounts = {};
       columnNumbers.forEach(function(number) { columnCounts[number] = (columnCounts[number] || 0)+1; });
       for (let property in columnCounts) {
         if (columnCounts[property] > 1) {
           console.log("Duplicate!");
           validPuzzleString = false;
           break;
         }
       }
     
      /// determine the square of 9 cells which empty cell belongs to; collect numbers from it ///
       let squareNumber = null;
      // determine the square
       if (row < 4) {
        let possibleSquares = [1,2,3];
        squareNumber = possibleSquares[Math.ceil(column/3)-1];
       } else if (row > 3 && row < 7) {
        let possibleSquares = [4,5,6];
        squareNumber = possibleSquares[Math.ceil(column/3)-1];
       } else if (row > 6) {
         let possibleSquares = [7,8,9];
         squareNumber = possibleSquares[Math.ceil(column/3)-1];
       }
       //console.log(`squareNumber is ${squareNumber}`);
       
       // collect numbers from the square
       const squareNumbers = [];
       let start = null;
       if (squareNumber < 4) {
         start = 0 + 3*(squareNumber-1);
       } else if (squareNumber  > 3 && squareNumber < 7) {
         start = 27 + 3*(squareNumber-4);
       } else if (squareNumber > 6) {
         start = 54 + 3*(squareNumber-7);
       }
       
       for (let a = 0; a < 3; a++) {
         for (let b = 0; b < 3; b++) {
           if (input[start] !== ".") {
             squareNumbers.push(input[start]);
           }
           start += 1;
         }
         start += 6;
       }
      //console.log(`squareNumbers: ${squareNumbers}`);
     
      if (input[i] === ".") {
         /// compare rowNumbers, columnNumbers and squareBumbers ///
      // first, let's combine numbers from the row and the column
      const rowAndColumnNumbers = [...rowNumbers];
        for (let b = 0; b < columnNumbers.length; b++) {
          if (rowNumbers.indexOf(columnNumbers[b]) === -1) {
            rowAndColumnNumbers.push(columnNumbers[b]);
          }
        }
       //console.log(`rowAndColumnNumbers: ${rowAndColumnNumbers}`);
       
      // second, let's add numbers from the square to them
       const uniqueNumbers = [...rowAndColumnNumbers];
        for (let b = 0; b < squareNumbers.length; b++) {
          if (rowAndColumnNumbers.indexOf(squareNumbers[b]) === -1) {
            uniqueNumbers.push(squareNumbers[b]);
          }
        }
       //console.log(`uniqueNumbers: ${uniqueNumbers}`);
       
       /// find missing values ///
       const missingValues = [];
       for (let j = 1; j < 10; j++) {
         if (uniqueNumbers.indexOf(j.toString()) === -1) {
           missingValues.push(j);
         }
       }
       //console.log(`missingValues: ${missingValues}`);
       
       /// substitute empty cells with possible values ///
       // if there is only one missing value, put it in the cell
       if (missingValues.length === 1) {
         cells[i].value = missingValues[0];
         cells[i].style.color = "red";
         changeNumbersInTheTextArea();
         emptyCells--;
         filledCells++;
       }
      } // end of a condition (empty cell)
     } // end of a condition (validPuzzleString === true)
    } // end of a loop
    let count = 0;
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].value === "") {
        count++;
      }
    }
    if (count > 0 && validPuzzleString === true) {
      findDigits(textArea.value);
    }
  }///end of a function

  findDigits(textArea.value);
  
   if (validPuzzleString === false) {
     console.log("Invalid puzzle!");
     return false;
   }

   // final verdict
   if (emptyCells === 0) {
     if (validPuzzleString === true) {
       const obj = {};
       let str = "";
       for (let i = 0; i < cells.length; i++) {
         obj[`${i}`] = cells[i].value;
        str += cells[i].value;
       }
       obj.solution = str;
       console.log(obj.solution);
       return obj;
       // for string with all digits
     } else if (validPuzzleString === false) {
       console.log("Invalid puzzle!");
       return false;
     }
   } 
}


  /*** event listeners ***/
  document.addEventListener('DOMContentLoaded', () => {
    // Load a simple puzzle into the text area
    textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    // show numbers in the grid
    showNumbersInTheGrid(textArea.value);
  });

  // update numbers in the grid when values in the text area are changed
  document.querySelector("#text-input").addEventListener("input", () => {
    showNumbersInTheGrid(textArea.value);
  });

  document.querySelector('.grid').addEventListener("keyup", (event) => {
    const regexNumbers = /[1-9]/;
    if (regexNumbers.test(event.key) || event.key === "Backspace") {
       changeNumbersInTheTextArea(); 
    }
  });

 document.getElementById('clear-button').addEventListener('click', () => {
    clearTextArea();
  });

  document.getElementById('solve-button').addEventListener('click', () => {
    console.log(typeof solveSudoku(textArea.value));
    console.log(solveSudoku(textArea.value));
    solveSudoku(textArea.value);
  });

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    showNumbersInTheGrid,
    solveSudoku
  }
} catch (e) {}
