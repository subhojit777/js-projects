'use strict';

function Simon() {
  this.buttonIndexes = [0, 1, 2, 3];
  this.gameSeries = [];
  this.gameTempo = 10000;
  this.gameStatus = 0;
  this.strictMode = 0;
  this.gameStart = 0;
  this.userTurn = 0;
  this.userTurnCurrentIndex = -1;
  this.increaseTempoLengths = [5, 9, 13];
  this.gameLastStepCount = 20;

  this.elementSquare0 = $('#0');
  this.elementSquare1 = $('#1');
  this.elementSquare2 = $('#2');
  this.elementSquare3 = $('#3');
  this.elementStrict = $('#strict');
  this.elementStart = $('#start');
  this.elementStatus = $('#status');
  this.elementCount = $('#count');

  this.squareSound0 = new Howl({
    urls: ['effects/simonSound1.mp3']
  });
  this.squareSound1 = new Howl({
    urls: ['effects/simonSound2.mp3']
  });
  this.squareSound2 = new Howl({
    urls: ['effects/simonSound3.mp3']
  });
  this.squareSound3 = new Howl({
    urls: ['effects/simonSound4.mp3']
  });
  this.errorSound = new Howl({
    urls: ['effects/buzz.mp3']
  });
}

Simon.prototype.eventGameStatus = function() {
  this.elementStatus.click(function() {
    this.gameStatus = 1;
  }.bind(this));
}

Simon.prototype.eventGameStart = function() {
  this.elementStart.click(function() {
    if (this.gameStatus == 1) {
      if (this.gameStart == 1) {
        // TODO reset game
      }
      else {
        this.gameStart = 1;
        this.generateSeries();
      }
    }
  }.bind(this));
}

Simon.prototype.eventStrictMode = function() {
  this.elementStrict.click(function() {
    this.strictMode = 1;
  }.bind(this));
}

Simon.prototype.eventSquare0 = function() {
  this.elementSquare0.on('mousedown', function() {
    if (this.userTurn == 1) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 0) {
        this.elementSquare0.addClass('blink');
        this.squareSound0.play();
        this.userTurnCurrentIndex++;

        if (this.userTurnCurrentIndex == this.gameSeries.length) {
          this.userTurn = 0;
          this.generateSeries();
        }
      }
      else {
        this.eventFailed();
      }
    }
    else {
      this.elementSquare0.addClass('blink');
      this.squareSound0.play();
    }
  }.bind(this));

  this.elementSquare0.on('mouseup', function() {
    this.elementSquare0.removeClass('blink');
    this.squareSound0.stop();
  }.bind(this));
}

Simon.prototype.eventSquare1 = function() {
  this.elementSquare1.on('mousedown', function() {
    if (this.userTurn == 1) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 1) {
        this.elementSquare1.addClass('blink');
        this.squareSound1.play();
        this.userTurnCurrentIndex++;

        if (this.userTurnCurrentIndex == this.gameSeries.length) {
          this.userTurn = 0;
          this.generateSeries();
        }
      }
      else {
        this.eventFailed();
      }
    }
    else {
      this.elementSquare1.addClass('blink');
      this.squareSound1.play();
    }
  }.bind(this));

  this.elementSquare1.on('mouseup', function() {
    this.elementSquare1.removeClass('blink');
    this.squareSound1.stop();
  }.bind(this));
}

Simon.prototype.eventSquare2 = function() {
  this.elementSquare2.on('mousedown', function() {
    if (this.userTurn == 1) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 2) {
        this.elementSquare2.addClass('blink');
        this.squareSound2.play();
        this.userTurnCurrentIndex++;

        if (this.userTurnCurrentIndex == this.gameSeries.length) {
          this.userTurn = 0;
          this.generateSeries();
        }
      }
      else {
        this.eventFailed();
      }
    }
    else {
      this.elementSquare2.addClass('blink');
      this.squareSound2.play();
    }
  }.bind(this));

  this.elementSquare2.on('mouseup', function() {
    this.elementSquare2.removeClass('blink');
    this.squareSound2.stop();
  }.bind(this));
}

Simon.prototype.eventSquare3 = function() {
  this.elementSquare3.on('mousedown', function() {
    if (this.userTurn == 1) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 3) {
        this.elementSquare3.addClass('blink');
        this.squareSound3.play();
        this.userTurnCurrentIndex++;

        if (this.userTurnCurrentIndex == this.gameSeries.length) {
          this.userTurn = 0;
          this.generateSeries();
        }
      }
      else {
        this.eventFailed();
      }
    }
    else {
      this.elementSquare3.addClass('blink');
      this.squareSound3.play();
    }
  }.bind(this));

  this.elementSquare3.on('mouseup', function() {
    this.elementSquare3.removeClass('blink');
    this.squareSound3.stop();
  }.bind(this));
}

Simon.prototype.getNextSequence = function() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  return Math.floor(Math.random() * (0 - 3)) + 3;
}

Simon.prototype.previewSeries = function() {
  console.log(this.gameSeries);
  for (var i = 0; i < this.gameSeries.length; i++) {
    switch (this.gameSeries[i]) {
      case 0:
        this.elementSquare0.trigger('mousedown');
        this.elementSquare0.trigger('mouseup');

        break;

      case 1:
        this.elementSquare1.trigger('mousedown');
        this.elementSquare1.trigger('mouseup');

        break;

      case 2:
        this.elementSquare2.trigger('mousedown');
        this.elementSquare2.trigger('mouseup');

        break;

      case 3:
        this.elementSquare3.trigger('mousedown');
        this.elementSquare3.trigger('mouseup');

        break;
    }
  }

  this.userTurn = 1;
  this.userTurnCurrentIndex = 0;
}

Simon.prototype.generateSeries = function() {
  this.gameSeries.push(this.getNextSequence());

  if (this.gameSeries.length > this.gameLastStepCount) {
    // TODO show you are the winner
  }

  if (this.increaseTempoLengths.indexOf(this.gameSeries.length) > -1) {
    this.gameTempo -= 200;
  }

  this.previewSeries();
}

Simon.prototype.eventFailed = function() {
  this.errorSound.play();
}

Simon.prototype.delay = function() {
  // Synchronous delay.
  // http://stackoverflow.com/a/26844533/1233922
  var dt = new Date();
	while ((new Date()) - dt <= this.gameTempo) { /* Do nothing */ }
}

Simon.prototype.init = function() {
  this.eventGameStatus();
  this.eventGameStart();
  this.eventStrictMode();
  this.eventSquare0();
  this.eventSquare1();
  this.eventSquare2();
  this.eventSquare3();
}

$(document).ready(function() {
  var simon = new Simon();
  simon.init();
});
