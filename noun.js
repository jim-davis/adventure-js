const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");

const Nouns = new dictionary.Dictionary();

function Noun (word, categories, description) {
	this.word = word;
	this.synonyms = [];
	this.categories = categories;
	this.description = description;
	Nouns.add_word(this);
}

Noun.prototype.match = function (np) {
	return this.word == np || this.synonyms.indexOf(np) >= 0;
}

Noun.prototype.definiteNP = function () {
	// HMMM.  Is this right, if player used a synonym?
	return "the " + this.word;
};


exports.Noun = Noun;
exports.Nouns = Nouns;
