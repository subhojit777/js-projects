'use strict';

const LENGTH = 12;

function Calculator() {
  this.key = document.getElementsByClassName('key');
  this.output = document.getElementById('output');
  this.firstInput = true;
  this.lastNumber = 0;
  this.operator = '';
}

Calculator.prototype.clickEvent = function() {
  var key = document.getElementsByClassName('key');
  var self = this;
  for (var i = 0; i < key.length; i++) {
    key[i].addEventListener('click', function(event) {
      switch (event.target.textContent) {
        case 'C':
          self.clearOutput();
          self.firstInput = true;
          break;

        case '=':
          switch (self.operator) {
            case '+':
              self.updateOutput(parseInt(self.currentOutput()) + parseInt(self.lastNumber));
              break;
            case '-':
              self.updateOutput(parseInt(self.currentOutput()) - parseInt(self.lastNumber));
              break;
            case '*':
              self.updateOutput(parseInt(self.currentOutput()) * parseInt(self.lastNumber));
              break;
            case '/':
              self.updateOutput(parseInt(self.currentOutput()) / parseInt(self.lastNumber));
              break;
          }

          self.firstInput = true;
          self.operator = '';
          break;

        case '+':
          self.operator = '+';

          // Make sure this is the first number in the expression.
          if (self.lastNumber == 0 && !self.firstInput) {
            self.lastNumber = parseInt(self.currentOutput());
          }
          // Make sure this is the second number for the expression.
          else if (self.lastNumber != 0 && !self.firstInput) {
            self.updateOutput(parseInt(self.currentOutput()) + parseInt(self.lastNumber));
            self.lastNumber = 0;
          }

          // Reset firstInput so that it *should* accept second number for an
          // expression.
          self.firstInput = true;
          break;

        case '-':
          self.operator = '-';

          // Make sure this is the first number in the expression.
          if (self.lastNumber == 0 && !self.firstInput) {
            self.lastNumber = self.currentOutput();
          }
          // Make sure this is the second number for the expression.
          else if (self.lastNumber != 0 && !self.firstInput) {
            self.updateOutput(parseInt(self.currentOutput()) - parseInt(self.lastNumber));
            self.lastNumber = 0;
          }

          // Reset firstInput so that it *should* accept second number for an
          // expression.
          self.firstInput = true;
          break;

        case '*':
          self.operator = '*';

          // Make sure this is the first number in the expression.
          if (self.lastNumber == 0 && !self.firstInput) {
            self.lastNumber = self.currentOutput();
          }
          // Make sure this is the second number for the expression.
          else if (self.lastNumber != 0 && !self.firstInput) {
            self.updateOutput(parseInt(self.currentOutput()) * parseInt(self.lastNumber));
            self.lastNumber = 0;
          }

          // Reset firstInput so that it *should* accept second number for an
          // expression.
          self.firstInput = true;
          break;

        case '/':
          self.operator = '/';

          // Make sure this is the first number in the expression.
          if (self.lastNumber == 0 && !self.firstInput) {
            self.lastNumber = self.currentOutput();
          }
          // Make sure this is the second number for the expression.
          else if (self.lastNumber != 0 && !self.firstInput) {
            self.updateOutput(parseInt(self.currentOutput()) / parseInt(self.lastNumber));
            self.lastNumber = 0;
          }

          // Reset firstInput so that it *should* accept second number for an
          // expression.
          self.firstInput = true;
          break;

        default:
          if (self.firstInput) {
            self.updateOutput(event.target.innerHTML);
            self.firstInput = false;
          }
          else if (self.outputLength() < LENGTH) {
            self.updateOutput(self.currentOutput() + event.target.innerHTML);
          }
          break;
      }
    }, false);
  }
}

Calculator.prototype.updateOutput = function(content) {
  this.output.textContent = content;
}

Calculator.prototype.currentOutput = function() {
  return this.output.textContent;
}

Calculator.prototype.clearOutput = function() {
  return this.output.textContent = 0;
}

Calculator.prototype.outputLength = function() {
  return this.output.textContent.length;
}

Calculator.prototype.init = function() {
  this.clickEvent();
}

var cal = new Calculator();
cal.init();
