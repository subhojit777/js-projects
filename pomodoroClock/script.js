'use strict';

/**
 * Pomodoro clock.
 */
function PomodoroClock() {
  this.elementReduceBreak = document.getElementById('reduce-break');
  this.elementAddBreak = document.getElementById('add-break');
  this.elementBreakLength = document.getElementById('break-length');
  this.elementReduceSession = document.getElementById('reduce-session');
  this.elementAddSession = document.getElementById('add-session');
  this.elementSessionLength = document.getElementById('session-length');
  this.elementTimer = document.getElementById('timer');
  this.elementTimerCount = document.getElementById('timer-count');
  this.elementReset = document.getElementById('reset');
  this.elementProgressBar = document.getElementById('progress-bar');

  // Time status - whether timer is on or off.
  this.timerStatus = false;
  // Break status - whether break timer is on or off.
  this.timerBreakStatus = false;
  // Current date as per timer.
  this.date = new Date();

  // Metadata required for progress bar.
  // Date for comparing with current timer date.
  this.relativeDate = new Date();
  this.relativeDate.setMinutes(25);
  this.relativeDate.setSeconds(0);
  // Full timer count.
  this.timerFullCount = 25 * 60000;

  this.timer = null;
  this.tone = new Audio('tone.mp3');
}

/**
 * Carry out actions when break interval is reduced.
 */
PomodoroClock.prototype.reduceBreak = function() {
  this.elementReduceBreak.addEventListener('click', function() {
    if (parseInt(this.elementBreakLength.innerText) > 1) {
      this.elementBreakLength.innerText = parseInt(this.elementBreakLength.innerText) - 1;

      if (this.timerBreakStatus) {
        this.elementTimerCount.innerText = this.elementBreakLength.innerText + ':' + '00';

        this.timerFullCount = parseInt(this.elementBreakLength.innerText) * 60000;
        this.relativeDate.setMinutes(this.elementBreakLength.innerText);
        this.relativeDate.setSeconds(0);
      }
    }
  }.bind(this));
}

/**
 * Carry out actions when break interval is increased.
 */
PomodoroClock.prototype.addBreak = function() {
  this.elementAddBreak.addEventListener('click', function() {
    this.elementBreakLength.innerText = parseInt(this.elementBreakLength.innerText) + 1;

    if (this.timerBreakStatus) {
      this.elementTimerCount.innerText = this.elementBreakLength.innerText + ':' + '00';

      this.timerFullCount = parseInt(this.elementBreakLength.innerText) * 60000;
      this.relativeDate.setMinutes(this.elementBreakLength.innerText);
      this.relativeDate.setSeconds(0);
    }
  }.bind(this));
}

/**
 * Carry out actions when session interval is reduced.
 */
PomodoroClock.prototype.reduceSession = function() {
  this.elementReduceSession.addEventListener('click', function() {
    if (parseInt(this.elementSessionLength.innerText) > 1) {
      this.elementSessionLength.innerText = parseInt(this.elementSessionLength.innerText) - 1;
      this.elementTimerCount.innerText = this.elementSessionLength.innerText + ':' + '00';

      this.timerFullCount = parseInt(this.elementSessionLength.innerText) * 60000;
      this.relativeDate.setMinutes(this.elementSessionLength.innerText);
      this.relativeDate.setSeconds(0);
    }
  }.bind(this));
}

/**
 * Carry out actions when session interval is increased.
 */
PomodoroClock.prototype.addSession = function() {
  this.elementAddSession.addEventListener('click', function() {
    this.elementSessionLength.innerText = parseInt(this.elementSessionLength.innerText) + 1;
    this.elementTimerCount.innerText = this.elementSessionLength.innerText + ':' + '00';

    this.timerFullCount = parseInt(this.elementSessionLength.innerText) * 60000;
    this.relativeDate.setMinutes(this.elementSessionLength.innerText);
    this.relativeDate.setSeconds(0);
  }.bind(this));
}

/**
 * Start timer.
 */
PomodoroClock.prototype.startTimer = function() {
  this.elementTimer.addEventListener('click', function() {
    if (!this.timerStatus) {
      // Make sure timer starts from the selected session interval.
      var timerCount = this.elementTimerCount.innerText;
      var timeParts = timerCount.split(':');
      this.date.setMinutes(timeParts[0]);
      this.date.setSeconds(timeParts[1]);

      this.timerStatus = true;

      this.elementReduceBreak.disabled = true;
      this.elementAddBreak.disabled = true;
      this.elementReduceSession.disabled = true;
      this.elementAddSession.disabled = true;
      this.elementReset.disabled = true;

      this.elementProgressBar.classList.add('active');

      this.timer = setInterval(function() {
        this.date.setTime(this.date.getTime() - 1000);
        // Make sure seconds is always two digit.
        // http://stackoverflow.com/a/6040556/1233922
        this.elementTimerCount.innerText = this.date.getMinutes() + ':' + ('0' + this.date.getSeconds()).slice(-2);

        this.elementProgressBar.style.width = Math.round(((this.relativeDate.getTime() - this.date.getTime()) / this.timerFullCount) * 100) + '%';

        // When timer hits 0 - we toggle timer break status.
        if (this.elementTimerCount.innerText == '0:00') {
          if (!this.timerBreakStatus) {
            this.timerBreakStatus = true;

            this.date.setMinutes(this.elementBreakLength.innerText);
            this.date.setSeconds(0);

            this.relativeDate.setMinutes(this.elementBreakLength.innerText);
            this.relativeDate.setSeconds(0);
            this.timerFullCount = parseInt(this.elementBreakLength.innerText) * 60000;
            this.elementProgressBar.classList.remove('progress-bar-success');
            this.elementProgressBar.classList.add('progress-bar-info');

            this.tone.play();
          }
          else {
            this.timerBreakStatus = false;

            this.date.setMinutes(this.elementSessionLength.innerText);
            this.date.setSeconds(0);

            this.relativeDate.setMinutes(this.elementSessionLength.innerText);
            this.relativeDate.setSeconds(0);
            this.timerFullCount = parseInt(this.elementSessionLength.innerText) * 60000;
            this.elementProgressBar.classList.remove('progress-bar-info');
            this.elementProgressBar.classList.add('progress-bar-success');

            this.tone.play();
          }
        }
      }.bind(this), 1000);
    }
    else {
      this.timerStatus = false;

      this.elementReduceBreak.disabled = false;
      this.elementAddBreak.disabled = false;
      this.elementReset.disabled = false;
      // Make sure session interval cannot be changed while timer break is on.
      if (!this.timerBreakStatus) {
        this.elementReduceSession.disabled = false;
        this.elementAddSession.disabled = false;
      }

      this.elementProgressBar.classList.remove('active');

      clearInterval(this.timer);
    }
  }.bind(this));
}

/**
 * Reset timer.
 */
PomodoroClock.prototype.reset = function() {
  this.elementReset.addEventListener('click', function() {
    this.timerStatus = false;
    this.timerBreakStatus = false;
    this.elementTimerCount.innerText = this.elementSessionLength.innerText + ':00';

    this.elementProgressBar.style.width = '0%';
    this.elementProgressBar.classList.remove('progress-bar-info');
    this.elementProgressBar.classList.add('progress-bar-success');
    this.timerFullCount = parseInt(this.elementSessionLength.innerText) * 60000;
    this.relativeDate.setMinutes(this.elementSessionLength.innerText);
    this.relativeDate.setSeconds(0);
  }.bind(this));
}

/**
 * Initialize pomodoro clock.
 */
PomodoroClock.prototype.init = function() {
  this.reduceBreak();
  this.addBreak();
  this.reduceSession();
  this.addSession();
  this.startTimer();
  this.reset();
}

var pomodoroClock = new PomodoroClock();
pomodoroClock.init();
