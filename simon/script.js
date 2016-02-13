'use strict';

const INITIAL_GAME_TEMPO = 1000;

function Simon() {
  this.buttonIndexes = [0, 1, 2, 3];
  this.gameSeries = [];
  this.gameTempo = INITIAL_GAME_TEMPO;
  this.gameStatus = false;
  this.strictMode = false;
  this.gameStart = false;
  this.userTurn = false;
  this.userTurnCurrentIndex = -1;

  this.elementSquare0 = $('#square0');
  this.elementSquare1 = $('#square1');
  this.elementSquare2 = $('#square2');
  this.elementSquare3 = $('#square3');
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

/**
 * Game properties.
 */
Simon.Props = {
  INCREASE_TEMPO_LENGTHS: [5, 9, 13],
  PREVIEW_SOUND_TEMPO: 350,
  ACTION_DELAY: 1000,
  GAME_LAST_STEP_COUNT: 20
};

/**
 * Event handler for game start button.
 */
Simon.prototype.eventGameStart = function() {
  this.elementStart.click(function() {
    if (this.gameStatus) {
      if (this.gameStart) {
        // Make sure everything visual/audio events are stopped.
        this.gameSeries = [];
        this.gameTempo = INITIAL_GAME_TEMPO;
        this.userTurn = false;
        this.elementCount.text('-');
        this.elementSquare0.removeClass('blink');
        this.elementSquare1.removeClass('blink');
        this.elementSquare2.removeClass('blink');
        this.elementSquare3.removeClass('blink');
        clearInterval(this.previewSeriesInterval);
        Howler.mute();

        // Reset game.
        setTimeout(function() {
          Howler.unmute();
          this.generateSeries();
        }.bind(this), Simon.Props.ACTION_DELAY);
      }
      else {
        this.gameStart = true;
        this.elementStart.addClass('on');
        this.generateSeries();
      }
    }
  }.bind(this));
}

/**
 * Event handler for strict button.
 */
Simon.prototype.eventStrictMode = function() {
  this.elementStrict.click(function() {
    if (this.gameStatus) {
      // Toggle strict mode.
      if (this.strictMode) {
        this.strictMode = false;
        this.elementStrict.removeClass('on');
      }
      else {
        this.strictMode = true;
        this.elementStrict.addClass('on');
      }
    }
  }.bind(this));
}

/**
 * Event handler for first simon game button.
 */
Simon.prototype.eventSquare0 = function() {
  this.elementSquare0.on('mousedown', function() {
    if (this.userTurn && this.gameStart) {
      // If the right button is pressed.
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

/**
 * Event handler for second simon game button.
 */
Simon.prototype.eventSquare1 = function() {
  this.elementSquare1.on('mousedown', function() {
    if (this.userTurn && this.gameStart) {
      // If the right button is pressed.
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

/**
 * Event handler for third simon game button.
 */
Simon.prototype.eventSquare2 = function() {
  this.elementSquare2.on('mousedown', function() {
    if (this.userTurn && this.gameStart) {
      // If the right button is pressed.
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

/**
 * Event handler for fourth simon game button.
 */
Simon.prototype.eventSquare3 = function() {
  this.elementSquare3.on('mousedown', function() {
    if (this.userTurn && this.gameStart) {
      // If the right button is pressed.
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

/**
 * Get next sequence in game series.
 */
Simon.prototype.getNextSequence = function() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  return Math.floor(Math.random() * (3 - 0 + 1)) + 0;
}

/**
 * Animate game series.
 */
Simon.prototype.previewSeries = function() {
  console.log(this.gameSeries);

  // Thanks :) http://codeplanet.io/building-simon-says-javascript
	var i = 0;
  this.previewSeriesInterval = setInterval(function() {
    this.lightUp(this.gameSeries[i]);
    i++;
    if (i >= this.gameSeries.length) {
      clearInterval(this.previewSeriesInterval);

      this.userTurn = true;
      this.userTurnCurrentIndex = 0;
    }
  }.bind(this), this.gameTempo);
}

/**
 * Light up simon game buttons.
 */
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

/**
 * Generate game series.
 */
Simon.prototype.generateSeries = function() {
  this.gameSeries.push(this.getNextSequence());

  if (this.gameSeries.length > Simon.Props.GAME_LAST_STEP_COUNT) {
    // Winner notification.
    this.elementCount.text('**');
    var i = 1;
    var interval = setInterval(function() {
      this.lightUp(this.gameSeries[Simon.Props.GAME_LAST_STEP_COUNT - 1]);
      i++;
      if (i >= 5) {
        clearInterval(interval);
      }
    }.bind(this), 400);

    return false;
  }

  if (Simon.Props.INCREASE_TEMPO_LENGTHS.indexOf(this.gameSeries.length) > -1) {
    this.gameTempo -= 200;
  }

  this.elementCount.text(this.gameSeries.length);
  this.previewSeries();
}

/**
 * Event handler for wrong move.
 */
Simon.prototype.eventFailed = function() {
  this.errorSound.play();
  this.userTurn = false;

  setTimeout(function() {
    this.errorSound.stop();

    if (this.strictMode) {
      // Reset game.
      this.gameSeries = [];
      this.generateSeries();
    }
    else {
      this.previewSeries();
    }
  }.bind(this), Simon.Props.ACTION_DELAY);
}

/**
 * Convert power button as bootstrap switch.
 */
Simon.prototype.powerButtonAsSwitch = function() {
  var self = this;
  self.elementStatus.bootstrapSwitch({
    state: false,
    size: 'mini',
    animate: false,
    onSwitchChange: function(event, state) {
      self.gameStatus = state;

      if (!self.gameStatus) {
        // Simon board turned off, make sure everything visual/audio events are
        // stopped/resetted.
        self.gameSeries = [];
        self.gameTempo = INITIAL_GAME_TEMPO;
        self.gameStatus = false;
        self.gameStart = false;
        self.userTurn = false;
        self.strictMode = false;
        self.elementCount.empty();
        self.elementSquare0.removeClass('blink');
        self.elementSquare1.removeClass('blink');
        self.elementSquare2.removeClass('blink');
        self.elementSquare3.removeClass('blink');
        self.elementStart.removeClass('on');
        self.elementStrict.removeClass('on');
        clearInterval(self.previewSeriesInterval);
        Howler.mute();
      }
      else {
        // Simon board turned on, make sure all audio is unmuted.
        self.elementCount.text('-');
        Howler.unmute();
      }
    }
  });
}

/**
 * Initialize simon game.
 */
Simon.prototype.init = function() {
  this.powerButtonAsSwitch();
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
