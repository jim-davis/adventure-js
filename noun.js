const _ = require('lodash');
const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");

function Noun (word, categories, description, detail=null) {
	this.word = word;
	this.categories = categories;
	this.description = description; 
	this.detail = detail || "You see nothing special.";
	this.state = {};
	this.adhoc_sentence_handlers = {};
}

Noun.prototype.match = function (np) {
	return this.word == np;
}

// true if c is one of the categories for this noun
Noun.prototype.has_category = function (c) {
	return this.categories.indexOf(c) >= 0;
}

// The indefinite article to use with this noun
Noun.prototype.indefinite_article = function () {
	return this.description.match(/^[aeiou]/) ? "an" : "a";
};

// a noun phrase for this item
Noun.prototype.definiteNP = function () {
	return "the " + this.word;
};

// state is a set of key/value pairs
Noun.prototype.get_state = function (s) {
	return this.state[s];
}

Noun.prototype.set_state = function (s, v) {
	this.state[s]=v;
};

// can be overridden
Noun.prototype.get_detail = function () {
	return this.detail;
};

Noun.prototype.add_adhoc_sentence_handler = function (input, action) {
	this.adhoc_sentence_handlers[input] = action;
};

Noun.prototype.adhoc = function (input) {
	return this.adhoc_sentence_handlers[input];
};

Noun.prototype.execute = function (game, word) {
	game.speak("Nothing special happens.");
};

Noun.prototype.tick = function (game) {
};

exports.Noun = Noun;
