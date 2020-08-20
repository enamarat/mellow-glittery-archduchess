const textArea = document.getElementById('text-input');
import { puzzlesAndSolutions} from './puzzle-strings.js';

/*** functions ***/
const showNumbersInTheGrid = () => {
  const cells = document.querySelectorAll(".sudoku-input");
  const regex = /[1-9.]/;
  if (textArea.value.length <= 81) {
    for (let i = 0; i < textArea.value.length; i++) {
      if (regex.test(textArea.value[i]) === true) {
        cells[i].value = textArea.value[i];
        if (textArea.value[i] === ".") {
          cells[i].value = "";
        }
      }
    }
    if (textArea.value.length < 81) {
      document.querySelector("#error-msg").textContent = `Not enough values! There must be 81 symbols in the text area! Please type more.`;
    }
    if (textArea.value.length === 81) {
      document.querySelector("#error-msg").textContent = ``;
    }
  } else if (textArea.value.length > 81) {
    document.querySelector("#error-msg").textContent = `Max limit of 81 values is exceeded! Grid has stopped accepting your data!`;
  }
}

const changeNumbersInTheTextArea = () => {
  const cells = document.querySelectorAll(".sudoku-input");
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

const clearTextArea = () => {
  textArea.value = "";
   const cells = document.querySelectorAll(".sudoku-input");
   for (let i = 0; i < cells.length; i++) {
     cells[i].value = "";
   }
}

const solveSudoku = () => {
    const cells = document.querySelectorAll(".sudoku-input");
    if (textArea.value.length !== 81) {
      document.querySelector("#error-msg").textContent = `Error: Expected puzzle to be 81 characters long`;
    }
  
   for (let i = 0; i < textArea.value.length; i++) {
     // if the cell is occupied with a number skip it; if it is empty start the search for a possible value
     if (textArea.value[i] === ".") {
       /*** determine the column and the row in which the value is placed; collect numbers ***/
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
         //rowNumbers.push(textArea.value[j]);
         if (textArea.value[j] !== ".") {
         // console.log(textArea.value[j]);
           rowNumbers.push(textArea.value[j]);
         }
       }
      console.log(`rowNumbers: ${rowNumbers}`);
       
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
         //rowNumbers.push(textArea.value[j]);
         if (textArea.value[j] !== ".") {
         // console.log(textArea.value[j]);
           columnNumbers.push(textArea.value[j]);
         }
       }
      console.log(`columnNumbers: ${columnNumbers}`);
       
      /*** determine the square of 9 cells which empty cell belongs to; collect numbers from it ***/
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
           if (textArea.value[start] !== ".") {
             squareNumbers.push(textArea.value[start]);
           }
           start += 1;
         }
         start += 6;
       }
      console.log(`squareNumbers: ${squareNumbers}`);
       
      /*** compare rowNumbers, columnNumbers and squareBumbers ***/
      // first, let's combine numbers from the row and the column
      const rowAndColumnNumbers = [...rowNumbers];
        for (let b = 0; b < columnNumbers.length; b++) {
          if (rowNumbers.indexOf(columnNumbers[b]) === -1) {
            rowAndColumnNumbers.push(columnNumbers[b]);
          }
        }
       console.log(`rowAndColumnNumbers: ${rowAndColumnNumbers}`);
       
      // second, let's add numbers from the square to them
       const uniqueNumbers = [...rowAndColumnNumbers];
        for (let b = 0; b < squareNumbers.length; b++) {
          if (rowAndColumnNumbers.indexOf(squareNumbers[b]) === -1) {
            uniqueNumbers.push(squareNumbers[b]);
          }
        }
       console.log(`uniqueNumbers: ${uniqueNumbers}`);
       
       /*** find missing values ***/
       const missingValues = [];
       for (let j = 1; j < 10; j++) {
         if (uniqueNumbers.indexOf(j.toString()) === -1) {
           missingValues.push(j);
         }
       }
       console.log(`missingValues: ${missingValues}`);
       
       /*** substitute empty cells with possible values ***/
       // if there is only one missing value, put it in the cell
       if (missingValues.length === 1) {
         cells[i].value = missingValues[0];
         cells[i].style.color = "red";
         changeNumbersInTheTextArea();
         
         // check the grid for empty cells; if there are any, start the function again (the function is recurring)
         for (let i = 0; i < cells.length; i++) {
             if (cells[i].value === "") {
              solveSudoku();
             }
          }
       }
       
     }
   }
}

  /*** event listeners ***/
  document.addEventListener('DOMContentLoaded', () => {
    // Load a simple puzzle into the text area
    textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    // show numbers in the grid
    showNumbersInTheGrid();
  });

  // update numbers in the grid when values in the text area are changed
  document.querySelector("#text-input").addEventListener("input", () => {
    showNumbersInTheGrid();
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
    solveSudoku();
  });

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {

  }
} catch (e) {}
