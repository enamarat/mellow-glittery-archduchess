/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      assert.equal(Solver.showNumbersInTheGrid("9"), true);
      assert.equal(Solver.compareCellsGridAndTextArea(), true);
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
        const textArea = document.getElementById('text-input');
        assert.equal(Solver.changeNumbersInTheTextArea(), textArea.value);
        done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      assert.equal(Solver.clearTextArea(), "");
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
     const textArea = document.getElementById('text-input');
      let solve = Solver.solveSudoku;
      let analyze = Solver.analyzePuzzleString;
      let result = "769235418851496372432.7.95617456928339.8..7616287135492836..194516924837947381625";
      assert.equal(solve(analyze(result)), "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
      assert.equal(Solver.compareCellsGridAndTextArea(), true);
     done();
    });
  });
});

