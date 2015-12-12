'use strict';

function RandomQuoteGenerator() {
  this.quotes = {};
  this.quoteGeneratorButton = document.getElementById('quote-generator');
  this.quotePlaceholder = document.getElementById('quote');
  this.quoteAuthorPlaceholder = document.getElementById('author');
  this.tweet = document.getElementById('tweet');
  this.lastQuotePosition = -1;
}

/**
 * Load quotes from an external resource.
 */
RandomQuoteGenerator.prototype.loadJSON = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'https://raw.githubusercontent.com/subhojit777/js-projects/master/random-quotes/data.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == '200') {
      callback(xhr.responseText);

      // Quotes are loaded, so we can show a random quote.
      this.loadRandomQuote();
      this.generateRandomQuote();
    }
  }.bind(this);
  xhr.send(null);
}

/**
 * Return random quote position.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
RandomQuoteGenerator.prototype.getRandomQuotePosition = function() {
  return Math.floor(Math.random() * (this.quotes.length - 0)) + 0;
}

/**
 * Generate random quote on demand.
 */
RandomQuoteGenerator.prototype.generateRandomQuote = function() {
  this.quoteGeneratorButton.addEventListener('click', function() {
    this.loadRandomQuote();
  }.bind(this));
}

/**
 * Load a random quote and render.
 */
RandomQuoteGenerator.prototype.loadRandomQuote = function() {
  var randomQuotePosition = -1;

  // Make sure it always generates random quote.
  do {
    randomQuotePosition = this.getRandomQuotePosition();
  } while (randomQuotePosition == this.lastQuotePosition);
  this.lastQuotePosition = randomQuotePosition;

  this.quotePlaceholder.textContent = this.quotes[randomQuotePosition].quote;
  this.quoteAuthorPlaceholder.textContent = this.quotes[randomQuotePosition].author;

  // http://stackoverflow.com/a/18622535/1233922
  this.tweet.innerHTML = '<a class="twitter-share-button" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.quotes[randomQuotePosition].quote) + ' - ' + encodeURIComponent(this.quotes[randomQuotePosition].author) + '" data-size="large"></a>';
  twttr.widgets.load();
}

RandomQuoteGenerator.prototype.init = function() {
  this.loadJSON(function(response) {
    this.quotes = JSON.parse(response);
  }.bind(this));
}

var randomQuoteGenerator = new RandomQuoteGenerator();
randomQuoteGenerator.init();
