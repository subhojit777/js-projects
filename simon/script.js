'use strict';

function Simon() {
  this.buttonIndexes = [0, 1, 2, 3];
  this.gameSeries = [];
  this.gameTempo = 1000;
  this.gameStatus = false;
  this.strictMode = false;
  this.gameStart = false;
  this.userTurn = false;
  this.userTurnCurrentIndex = -1;
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
    urls: ['effects/simonSound0.mp3']
  });
  this.squareSound1 = new Howl({
    urls: ['effects/simonSound1.mp3']
  });
  this.squareSound2 = new Howl({
    urls: ['effects/simonSound2.mp3']
  });
  this.squareSound3 = new Howl({
    urls: ['effects/simonSound3.mp3']
  });
  this.errorSound = new Howl({
    urls: ['effects/buzz.mp3']
  });
}

Simon.Props = {
  INCREASE_TEMPO_LENGTHS: [5, 9, 13],
  PREVIEW_SOUND_TEMPO: 350,
  ACTION_DELAY: 1000
};

Simon.prototype.eventGameStatus = function() {
  this.elementStatus.click(function() {
    this.gameStatus = true;
  }.bind(this));
}

Simon.prototype.eventGameStart = function() {
  this.elementStart.click(function() {
    if (this.gameStatus) {
      if (this.gameStart) {
        setTimeout(function() {
          this.gameSeries = [];
          this.generateSeries();
        }.bind(this), Simon.Props.ACTION_DELAY);
      }
      else {
        this.gameStart = true;
        this.generateSeries();
      }
    }
  }.bind(this));
}

Simon.prototype.eventStrictMode = function() {
  this.elementStrict.click(function() {
    if (this.gameStatus) {
      // Toggle strict mode.
      if (this.strictMode) {
        this.strictMode = false;
      }
      else {
        this.strictMode = true;
      }
    }
  }.bind(this));
}

Simon.prototype.eventSquare0 = function() {
  this.elementSquare0.on('mousedown', function() {
    if (this.userTurn) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 0) {
        this.elementSquare0.addClass('blink');
        this.squareSound0.play();
        this.userTurnCurrentIndex++;
      }
      else {
        this.eventFailed();
      }
    }
  }.bind(this));

  this.elementSquare0.on('mouseup', function() {
    this.elementSquare0.removeClass('blink');
    this.squareSound0.stop();

    if (this.userTurnCurrentIndex == this.gameSeries.length) {
      this.userTurn = false;
      this.generateSeries();
    }
  }.bind(this));
}

Simon.prototype.eventSquare1 = function() {
  this.elementSquare1.on('mousedown', function() {
    if (this.userTurn) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 1) {
        this.elementSquare1.addClass('blink');
        this.squareSound1.play();
        this.userTurnCurrentIndex++;
      }
      else {
        this.eventFailed();
      }
    }
  }.bind(this));

  this.elementSquare1.on('mouseup', function() {
    this.elementSquare1.removeClass('blink');
    this.squareSound1.stop();

    if (this.userTurnCurrentIndex == this.gameSeries.length) {
      this.userTurn = false;
      this.generateSeries();
    }
  }.bind(this));
}

Simon.prototype.eventSquare2 = function() {
  this.elementSquare2.on('mousedown', function() {
    if (this.userTurn) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 2) {
        this.elementSquare2.addClass('blink');
        this.squareSound2.play();
        this.userTurnCurrentIndex++;
      }
      else {
        this.eventFailed();
      }
    }
  }.bind(this));

  this.elementSquare2.on('mouseup', function() {
    this.elementSquare2.removeClass('blink');
    this.squareSound2.stop();

    if (this.userTurnCurrentIndex == this.gameSeries.length) {
      this.userTurn = false;
      this.generateSeries();
    }
  }.bind(this));
}

Simon.prototype.eventSquare3 = function() {
  this.elementSquare3.on('mousedown', function() {
    if (this.userTurn) {
      if (this.gameSeries[this.userTurnCurrentIndex] == 3) {
        this.elementSquare3.addClass('blink');
        this.squareSound3.play();
        this.userTurnCurrentIndex++;
      }
      else {
        this.eventFailed();
      }
    }
  }.bind(this));

  this.elementSquare3.on('mouseup', function() {
    this.elementSquare3.removeClass('blink');
    this.squareSound3.stop();

    if (this.userTurnCurrentIndex == this.gameSeries.length) {
      this.userTurn = false;
      this.generateSeries();
    }
  }.bind(this));
}

Simon.prototype.getNextSequence = function() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  return Math.floor(Math.random() * (3 - 0 + 1)) + 0;
}

Simon.prototype.previewSeries = function() {
  console.log(this.gameSeries);

  // Thanks :) http://codeplanet.io/building-simon-says-javascript
	var i = 0;
	var interval = setInterval(function() {
    this.lightUp(this.gameSeries[i]);
    i++;
    if (i >= this.gameSeries.length) {
      clearInterval(interval);

      this.userTurn = true;
      this.userTurnCurrentIndex = 0;
    }
  }.bind(this), this.gameTempo);
}

Simon.prototype.lightUp = function(index) {
  switch (index) {
    case 0:
      this.elementSquare0.addClass('blink');
      this.squareSound0.play();

      setTimeout(function() {
        this.elementSquare0.removeClass('blink');
        this.squareSound0.stop();
      }.bind(this), Simon.Props.PREVIEW_SOUND_TEMPO);

      break;

    case 1:
      this.elementSquare1.addClass('blink');
      this.squareSound1.play();

      setTimeout(function() {
        this.elementSquare1.removeClass('blink');
        this.squareSound1.stop();
      }.bind(this), Simon.Props.PREVIEW_SOUND_TEMPO);

      break;

    case 2:
      this.elementSquare2.addClass('blink');
      this.squareSound2.play();

      setTimeout(function() {
        this.elementSquare2.removeClass('blink');
        this.squareSound2.stop();
      }.bind(this), Simon.Props.PREVIEW_SOUND_TEMPO);

      break;

    case 3:
      this.elementSquare3.addClass('blink');
      this.squareSound3.play();

      setTimeout(function() {
        this.elementSquare3.removeClass('blink');
        this.squareSound3.stop();
      }.bind(this), Simon.Props.PREVIEW_SOUND_TEMPO);

      break;
  }
}

Simon.prototype.generateSeries = function() {
  this.gameSeries.push(this.getNextSequence());

  if (this.gameSeries.length > this.gameLastStepCount) {
    // TODO show you are the winner
  }

  if (Simon.Props.INCREASE_TEMPO_LENGTHS.indexOf(this.gameSeries.length) > -1) {
    this.gameTempo -= 200;
  }

  this.elementCount.text(this.gameSeries.length);
  this.previewSeries();
}

Simon.prototype.eventFailed = function() {
  this.errorSound.play();
  this.userTurn = false;

  setTimeout(function() {
    this.errorSound.stop();

    if (this.strictMode) {
      this.gameSeries = [];
      this.generateSeries();
    }
    else {
      this.previewSeries();
    }
  }.bind(this), Simon.Props.ACTION_DELAY);
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
