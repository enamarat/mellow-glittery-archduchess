/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;
//const expect = chai.expect;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let Solver;

suite('UnitTests', function() {
  this.timeout(0);
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile('./views/index.html')
      .then((dom) => {
   //console.log(dom.setTimeout);
        global.window = dom.window;
        global.document = dom.window.document;
       
        Solver = require('../public/sudoku-solver.js');
      });
  });
  
  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite('Function showNumbersInTheGrid()', () => {
    test('Valid "1-9" characters', (done) => {
      const input = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      assert.equal(Solver.showNumbersInTheGrid(input[0]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[1]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[2]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[3]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[4]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[5]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[6]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[7]), true);
      assert.equal(Solver.showNumbersInTheGrid(input[8]), true);
      done();
    });

    // Invalid characters or numbers are not accepted 
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ['!', 'a', '/', '+', '-', '0', '10', 0, '.'];
      assert.equal(Solver.showNumbersInTheGrid(input[0]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[1]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[2]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[3]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[4]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[5]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[6]), false);
      assert.equal(Solver.showNumbersInTheGrid(input[7].toString()), false);
      assert.equal(Solver.showNumbersInTheGrid(input[8]), false);
      done();
    });
  });
  
  suite('Function solveSudoku()', function() {
    //this.timeout(0);
    test('Parses a valid puzzle string into an object', function(done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
       console.log(Solver.solveSudoku(input));
     //assert.typeOf(Solver.solveSudoku(input), 'object', 'we have an object');
     
      done();
    });
    
    // Puzzles that are not 81 numbers/periods long show the message 
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test('Shows an error for puzzles that are not 81 numbers long', done => {
      const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const longStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
      const errorMsg = 'Error: Expected puzzle to be 81 characters long.';
      const errorDiv = document.getElementById('error-msg');
      assert.equal(Solver.solveSudoku(shortStr), false);
      assert.equal(Solver.solveSudoku(longStr), false);
      done();
    });
  });

  suite('Function ____()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.typeOf(Solver.solveSudoku(input), 'object', 'we have an object');
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
     // assert.typeOf(Solver.solveSudoku(input), 'boolean', 'we have a boolean');
      assert.equal(Solver.solveSudoku(input), false);
      done();
    });
  });
  
  
  suite('Function ____()', () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      //769235418851496372432178956174569283395842761628713549283657194516924837947381625
  //console.log(Solver.solveSudoku(input).solution);
    //  assert.isString(Solver.solveSudoku(input).solution);
      assert.equal(Solver.solveSudoku(input).solution, "769235418851496372432178956174569283395842761628713549283657194516924837947381625");                                              
      done();
    });
  });
});
