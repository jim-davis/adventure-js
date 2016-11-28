var _ = require('lodash');
const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");

const Nouns = new dictionary.Dictionary();

function Noun (word, categories, description) {
	this.word = word;
	this.synonyms = [];
	this.categories = categories;
	this.description = description;
	this.state = {};
	Nouns.add_word(this);
}

Noun.prototype.match = function (np) {
	return this.word == np || this.synonyms.indexOf(np) >= 0;
}

Noun.prototype.has_category = function (c) {
	return this.categories.indexOf(c) >= 0;
}

Noun.prototype.definiteNP = function () {
	// HMMM.  Is this right, if player used a synonym?
	return "the " + this.word;
};

Noun.prototype.get_state = function (s) {
	return this.state[s];
}

Noun.prototype.set_state = function (s, v) {
	this.state[s]=v;
};

exports.Noun = Noun;
exports.Nouns = Nouns;
