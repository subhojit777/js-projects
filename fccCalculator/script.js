'use strict';

function Calculator() {
  this.elementOutput = document.getElementById('output');
  this.elementPowerButton = document.querySelectorAll('[data-action=power]')[0];
  this.elementClearButton = document.querySelectorAll('[data-action=clear]')[0];
  this.elementPercentButton = document.querySelectorAll('[data-action=percent]')[0];
  this.elementOperatorsButton = document.querySelectorAll('[data-action=operator]');
  this.elementNumbersButton = document.querySelectorAll('[data-action=number]');
  this.elementDecimalButton = document.querySelectorAll('[data-action=decimal]')[0];

  this.isCalculatorOn = false;
  this.expression = {
    'firstOperand': '',
    'operator': '',
    'secondOperator': ''
  };
  this.firstInput = true;
  this.MAX_DIGITS = 12;
}

Calculator.prototype.eventCalculatorPower = function() {
  this.elementPowerButton.addEventListener('click', function() {
    // Toggle calculator power.
    if (this.isCalculatorOn) {
      this.resetCalculator();
      this.isCalculatorOn = false;
    }
    else {
      this.isCalculatorOn = true;
    }
  }.bind(this));
}

Calculator.prototype.eventClearOutput = function() {
  this.elementClearButton.addEventListener('click', function() {
    if (this.isCalculatorOn) {
      this.resetCalculator();
    }
  }.bind(this));
}

Calculator.prototype.resetCalculator = function() {
  this.clearOutput();
  this.expression = {
    'firstOperand': '',
    'operator': '',
    'secondOperator': ''
  };
}

/**
 * Resets the display of the calculator.
 */
Calculator.prototype.clearOutput = function() {
  this.elementOutput.textContent = '';
}

/**
 * Updates the calculator display.
 */
Calculator.prototype.updateOutput = function(content) {
  this.elementOutput.textContent = content;
}

/**
 * Gets the value currently displayed on the calculator.
 */
Calculator.prototype.getOutput = function() {
  return this.elementOutput.textContent;
}

/**
 * Formats number to two decimal places and makes sure that it is a number.
 */
Calculator.prototype.toNumber = function(num) {
  if (num.toString().indexOf('.') == -1) {
    if (num.toString().length < 12) {
      return parseInt(num, 10);
    }
    else {
      return parseInt(num.toString().substring(0, this.MAX_DIGITS));
    }
  }
  else {
    if (num.toString().length - 1 < 12) {
      return parseFloat(num);
    }
    else {
      return parseFloat(parseFloat(num).toFixed(this.MAX_DIGITS - num.toString().indexOf('.')));
    }
  }
}

Calculator.prototype.eventInputNumbers = function() {
  for (var i = 0; i < this.elementNumbersButton.length; i++) {
    this.elementNumbersButton[i].addEventListener('click', function(event) {
      if (this.isCalculatorOn) {
        if (this.firstInput) {
          this.updateOutput(event.target.getAttribute('value'));
          this.firstInput = false;
        }
        else {
          if (this.getOutput().length < this.MAX_DIGITS) {
            this.updateOutput(this.getOutput() + event.target.getAttribute('value'));
          }
        }
      }
    }.bind(this));
  }
}

Calculator.prototype.eventDecimal = function() {
  this.elementDecimalButton.addEventListener('click', function() {
    if (this.isCalculatorOn) {
      if (this.getOutput().indexOf('.') == -1) {
        this.updateOutput(this.getOutput() + '.');
      }
    }
  }.bind(this));
}

Calculator.prototype.eventInputOperators = function() {
  for (var i = 0; i < this.elementOperatorsButton.length; i++) {
    this.elementOperatorsButton[i].addEventListener('click', function(event) {
      if (this.isCalculatorOn) {
        if (event.target.getAttribute('value') != '=') {
          if (!this.expression.firstOperand) {
            this.expression = {
              'firstOperand': parseFloat(this.getOutput()),
              'operator': event.target.getAttribute('value'),
              'secondOperator': ''
            };
          }
          else if (this.expression.firstOperand && !this.expression.operator) {
            this.expression.operator = event.target.getAttribute('value');
          }
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
