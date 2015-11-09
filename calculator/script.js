'use strict';

const LENGTH = 12;

/**
 * Calculator constructor.
 */
function Calculator() {
  this.key = document.getElementsByClassName('key');
  // The calculator display.
  this.output = document.getElementById('output');
  // A flag that checks whether the number clicked is the first input.
  this.firstInput = true;
  // An array containing the expression.
  // First element: first number of the expression.
  // Second element: operand.
  // Third element: second number of the expression.
  this.expression = [];
}

/**
 * Constructor method that handles key click events.
 */
Calculator.prototype.clickEvent = function() {
  var key = document.getElementsByClassName('key');

  for (var i = 0; i < key.length; i++) {
    key[i].addEventListener('click', function(event) {
      switch (event.target.textContent) {
        case 'C':
          this.clearOutput();
          this.resetExpression();
          this.firstInput = true;
          break;

        case '=':
          if (this.expression.length == 2) {
            this.expression.push(this.toNumber(this.getOutput()));
            var result = this.calculateExpression(this.expression[0], this.expression[2], this.expression[1]);
            this.updateOutput(this.toNumber(result));

            this.resetExpression();
            this.firstInput = true;
          }
          break;

        case '+':
        case '-':
        case '*':
        case '/':
          this.expression.push(this.toNumber(this.getOutput()));
          this.expression.push(event.target.textContent);
          this.firstInput = true;
          break;

        default:
          if (this.firstInput) {
            this.updateOutput(event.target.innerHTML);
            this.firstInput = false;
          }
          else if (this.outputLength() < LENGTH) {
            this.updateOutput(this.getOutput() + event.target.innerHTML);
          }
          break;
      }
    }.bind(this), false);
  }
}

/**
 * Updates the calculator display.
 */
Calculator.prototype.updateOutput = function(content) {
  this.output.textContent = content;
}

/**
 * Gets the value currently displayed on the calculator.
 */
Calculator.prototype.getOutput = function() {
  return this.output.textContent;
}

/**
 * Resets the display of the calculator.
 */
Calculator.prototype.clearOutput = function() {
  return this.output.textContent = 0;
}

/**
 * Gets the length of value currently displayed on the calculator.
 */
Calculator.prototype.outputLength = function() {
  return this.output.textContent.length;
}

/**
 * Resets the expression.
 */
Calculator.prototype.resetExpression = function() {
  return this.expression.length = 0;
}

/**
 * Formats number to two decimal places and makes sure that it is a number.
 */
Calculator.prototype.toNumber = function(num) {
  return parseFloat(parseFloat(num).toFixed(2));
}

/**
 * Evaluates the expression.
 */
Calculator.prototype.calculateExpression = function(num1, num2, operand) {
  switch (operand) {
    case '+':
      var output = num1 + num2;
      break;

    case '-':
      var output = num1 - num2;
      break;

    case '*':
      var output = num1 * num2;
      break;

    case '/':
      var output = num1 / num2;
      break;
  }

  return output;
}

/**
 * Initializes calculator constructor.
 */
Calculator.prototype.init = function() {
  this.clickEvent();
}

var cal = new Calculator();
cal.init();
