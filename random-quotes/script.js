'use strict';

function RandomQuoteGenerator() {
  this.quotes = [
    {quote: "Everyone who achieves success in a great venture, solves each problem as they came to it. They helped themselves. And they were helped through powers known and unknown to them at the time they set out on their voyage. They keep going regardless of the obstacles they met.",
    author: "W. Clement Stone"},
    {quote: "Where faith is there is courage, there is fortitude, there is steadfastness and strength ... Faith bestows that sublime courage that rises superior to the troubles and disappointments of life, that acknowledges no defeat except as a step to victory; that is strong to endure, patient to wait, and energetic to struggle ... Light up, then, the lamp of faith in your heart ... It will lead you safely through the mists of doubt and the black darkness of despair; along the narrow, thorny ways of sickness and sorrow, and over the treacherous places of temptation and uncertainty.",
    author: "James Lane Allen"},
    {quote: "There is only one religion, though there are a hundred versions of it.",
    author: "George Bernard Shaw"},
    {quote: "No one, Eleanor Roosevelt said, can make you feel inferior without your consent. Never give it.",
    author: "Marian Wright Edelman"},
    {quote: "You need to claim the events in your life to make yourself yours.",
    author: "Anne Wilson Schaef"},
    {quote: "Some will always be above others. Destroy the inequality today, and it will appear again tomorrow.",
    author: "Ralph Waldo Emerson"},
    {quote: "The fate of all extremes is such Men may be read, as well as books, too much. To observations which ourselves we make, We grow more partial for th' observer's sake.",
    author: "Alexander Pope"},
    {quote: "Wouldn't it be terrible if I quoted some reliable statistics which prove that more people are driven insane through religious hysteria than by drinking alcohol.",
    author: "W. C. Fields"},
    {quote: "There exists one book, which, to my taste, furnishes the happiest treatise of natural education. What then is this marvelous book? Is it Aristotle? Is it Pliny, is it Buffon? No-it is Robinson Crusoe.",
    author: "Jean Jacques Rousseau"},
    {quote: "We still do not know one-thousandth of one percent of what nature has revealed to us.",
    author: "Albert Einstein"},
  ];

  this.quoteGeneratorButton = document.getElementById('quote-generator');
  this.quotePlaceholder = document.getElementById('quote');
  this.quoteAuthorPlaceholder = document.getElementById('author');
  this.tweet = document.getElementById('tweet');
  this.lastQuotePosition = -1;
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
 * Display random quote when page loads.
 */
RandomQuoteGenerator.prototype.initialRandomQuote = function() {
  window.addEventListener('load', function() {
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
  this.initialRandomQuote();
  this.generateRandomQuote();
}

var randomQuoteGenerator = new RandomQuoteGenerator();
randomQuoteGenerator.init();
