'use strict';

function Calculator() {
  this.elementOutput = document.getElementById('output');
  this.elementPowerButton = document.querySelectorAll('[data-action=power]')[0];
  this.elementClearButton = document.querySelectorAll('[data-action=clear]')[0];
  this.elementPercentButton = document.querySelectorAll('[data-action=percent]')[0];
  this.elementOperatorsButton = document.querySelectorAll('[data-action=operator]');
  this.elementNumbersButton = document.querySelectorAll('[data-action=number]');
  this.elementDecimalButton = document.querySelectorAll('[data-action=decimal]')[0];
  this.elementLedStatus = document.getElementById('status');
  this.elementLed = this.elementLedStatus.querySelector('span');

  this.isCalculatorOn = false;
  this.expression = {
    'firstOperand': '',
    'operator': '',
    'secondOperator': ''
  };
  this.firstInput = true;
  this.MAX_DIGITS = 12;
}

/**
 * Event handler for calculator power button.
 */
Calculator.prototype.eventCalculatorPower = function() {
  this.elementPowerButton.addEventListener('click', function() {
    // Toggle calculator power.
    if (this.isCalculatorOn) {
      this.resetCalculator();
      this.isCalculatorOn = false;
      this.elementLed.className = 'off';
    }
    else {
      this.isCalculatorOn = true;
      this.elementLed.className = 'on';
      this.initialOutput();
    }
  }.bind(this));
}

/**
 * Event handler for calculator clear button.
 */
Calculator.prototype.eventClearOutput = function() {
  this.elementClearButton.addEventListener('click', function() {
    if (this.isCalculatorOn) {
      this.resetCalculator();
      this.initialOutput();
    }
  }.bind(this));
}

/**
 * Initialize display of the calculator.
 */
Calculator.prototype.initialOutput = function() {
  this.updateOutput('0');
}

/**
 * Reset calculator state.
 */
Calculator.prototype.resetCalculator = function() {
  this.clearOutput();
  this.expression = {
    'firstOperand': '',
    'operator': '',
    'secondOperator': ''
  };
}

/**
 * Clear calculator display.
 */
Calculator.prototype.clearOutput = function() {
  this.elementOutput.textContent = '';
}

/**
 * Update calculator display.
 */
Calculator.prototype.updateOutput = function(content) {
  this.elementOutput.textContent = content;
}

/**
 * Return the figure currently displayed on the calculator.
 */
Calculator.prototype.getOutput = function() {
  return this.elementOutput.textContent;
}

/**
 * Format number as per calculator configuration.
 *
 * Configuration:
 * - Maximum number of digits.
 *   - see this.MAX_DIGITS
 */
Calculator.prototype.toNumber = function(num) {
  // Number is integer.
  // So truncate it to MAX_DIGITS if greater than MAX_DIGITS.
  if (num.toString().indexOf('.') == -1) {
    if (num.toString().length < this.MAX_DIGITS) {
      return parseInt(num, 10);
    }
    else {
      return parseInt(num.toString().substring(0, this.MAX_DIGITS));
    }
  }
  // Number is decimal.
  // So truncate it to MAX_DIGITS (excluding '.') if greater than MAX_DIGITS.
  else {
    if (num.toString().length - 1 < this.MAX_DIGITS) {
      return parseFloat(num);
    }
    else {
      return parseFloat(parseFloat(num).toFixed(this.MAX_DIGITS - num.toString().indexOf('.')));
    }
  }
}

/**
 * Event handler for numbers.
 */
Calculator.prototype.eventInputNumbers = function() {
  for (var i = 0; i < this.elementNumbersButton.length; i++) {
    this.elementNumbersButton[i].addEventListener('click', function(event) {
      if (this.isCalculatorOn) {
        if (this.firstInput) {
          this.updateOutput(event.target.getAttribute('value'));
          this.firstInput = false;
        }
        else {
          // Make sure input does not go more than MAX_DIGITS.
          if (this.getOutput().length < this.MAX_DIGITS) {
            this.updateOutput(this.getOutput() + event.target.getAttribute('value'));
          }
        }
      }
    }.bind(this));
  }
}

/**
 * Event handler for decimal.
 */
Calculator.prototype.eventDecimal = function() {
  this.elementDecimalButton.addEventListener('click', function() {
    if (this.isCalculatorOn) {
      if (this.getOutput().indexOf('.') == -1) {
        this.updateOutput(this.getOutput() + '.');
      }
    }
  }.bind(this));
}

/**
 * Event handler for operators.
 */
Calculator.prototype.eventInputOperators = function() {
  for (var i = 0; i < this.elementOperatorsButton.length; i++) {
    this.elementOperatorsButton[i].addEventListener('click', function(event) {
      if (this.isCalculatorOn) {
        if (event.target.getAttribute('value') != '=') {
          // Operator entered for the first time.
          // Hence, initialize this.expression
          if (!this.expression.firstOperand) {
            this.expression = {
              'firstOperand': parseFloat(this.getOutput()),
              'operator': event.target.getAttribute('value'),
              'secondOperator': ''
            };
          }
          // This is going to be executed when you are using result from
          // previous expression.
          else if (this.expression.firstOperand && !this.expression.operator) {
            this.expression.operator = event.target.getAttribute('value');
          }
          // This is going to be executed when you are creating chain of
          // expression.
          else if (this.expression.firstOperand && this.expression.operator && !this.firstInput) {
            this.expression.secondOperand = parseFloat(this.getOutput());
            var result = this.toNumber(this.evaluateExpression());
            this.expression = {
              'firstOperand': result,
              'operator': event.target.getAttribute('value'),
              'secondOperator': ''
            };
          }
        }
        // Evaluate expression.
        else if (this.expression.firstOperand && this.expression.operator) {
          this.expression.secondOperand = parseFloat(this.getOutput());
          var result = this.toNumber(this.evaluateExpression());
          this.updateOutput(result);
          this.expression = {
            'firstOperand': result,
            'operator': '',
            'secondOperator': ''
          };
        }

        this.firstInput = true;
      }
    }.bind(this));
  }
}

/**
 * Event handler for percent button.
 */
Calculator.prototype.eventPercent = function() {
  this.elementPercentButton.addEventListener('click', function() {
    if (this.expression.firstOperand != '' && this.expression.operator == '/' && this.isCalculatorOn) {
      this.expression.secondOperand = this.toNumber(this.getOutput());
      var result = this.toNumber((parseFloat(this.expression.firstOperand) / parseFloat(this.expression.secondOperand)) * 100);
      this.updateOutput(result);
      this.expression = {
        'firstOperand': result,
        'operator': '',
        'secondOperand': ''
      };
    }
  }.bind(this));
}

/**
 * Evaluate expression.
 */
Calculator.prototype.evaluateExpression = function() {
  var result = null;

  switch (this.expression.operator) {
    case '+':
      result = this.expression.firstOperand + this.expression.secondOperand;
      break;

    case '-':
      result = this.expression.firstOperand - this.expression.secondOperand;
      break;

    case '*':
      result = this.expression.firstOperand * this.expression.secondOperand;
      break;

    case '/':
      result = this.toNumber(this.expression.firstOperand / this.expression.secondOperand);
      break;
  }

  return result;
}

Calculator.prototype.init = function() {
  this.eventCalculatorPower();
  this.eventClearOutput();
  this.eventInputNumbers();
  this.eventInputOperators();
  this.eventPercent();
  this.eventDecimal();
}

var calculator = new Calculator();
calculator.init();
