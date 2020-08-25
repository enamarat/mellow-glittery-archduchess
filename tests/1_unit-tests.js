/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

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
  
  suite('Function analyzePuzzleString()', function() {
    test('Parses a valid puzzle string into an object', function(done) {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      assert.typeOf(Solver.analyzePuzzleString(input), 'object', 'we have an object');
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
      assert.equal(Solver.analyzePuzzleString(shortStr), false);
      assert.equal(Solver.analyzePuzzleString(longStr), false);
      done();
    });
  });

  suite('Function analyzePuzzleString()', () => {
    // Valid complete puzzles pass
    test('Valid puzzles pass', done => {
      const input = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.typeOf(Solver.analyzePuzzleString(input), 'object', 'we have an object');
      done();
    });

    // Invalid complete puzzles fail
    test('Invalid puzzles fail', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.equal(Solver.analyzePuzzleString(input), false);
      done();
    });
  });
  
  
  suite('Function solveSudoku()', done => {
    // Returns the expected solution for a valid, incomplete puzzle
    test('Returns the expected solution for an incomplete puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let solve = Solver.solveSudoku;
      let analyze = Solver.analyzePuzzleString;
  
      //1
      let result = input;
      assert.equal(solve(analyze(result)), "7.9..5.1.85.4...72432......17..69.83.9.....6.62.71...9......1945....4.37.4.3..6..");
      //2
      result = "7.9..5.1.85.4...72432......17..69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solve(analyze(result)), "769..5.1.85.4...72432....5.17..69.8339.....6.62.71...9......1945....4.37.4.3..6..");
      //3
      result = "769..5.1.85.4...72432....5.17..69.8339.....6.62.71...9......1945....4.37.4.3..6..";
      assert.equal(solve(analyze(result)), "769..5.188514...72432....5.17..69.8339.....6.62.71..4928....1945....4.37.4.3..62.");
      //4
      result = "769..5.188514...72432....5.17..69.8339.....6.62.71..4928....1945....4.37.4.3..62.";
      assert.equal(solve(analyze(result)), "7692.5.188514...72432...95617..69.8339.....6.62.71.54928....194516..48379473..625");
      //5
      result = "7692.5.188514...72432...95617..69.8339.....6.62.71.54928....194516..48379473..625";
      assert.equal(solve(analyze(result)), "769235.188514..372432...95617.56928339.....6162871.549283...1945169.483794738.625");
      //6
      result = "769235.188514..372432...95617.56928339.....6162871.549283...1945169.483794738.625";
      assert.equal(solve(analyze(result)), "769235418851496372432.7.95617456928339.8..7616287135492836..194516924837947381625");
      //7
      result = "769235418851496372432.7.95617456928339.8..7616287135492836..194516924837947381625";
      assert.equal(solve(analyze(result)), "769235418851496372432178956174569283395842761628713549283657194516924837947381625");
      done();
    });
  });
});
