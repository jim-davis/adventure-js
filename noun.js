const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");

const Nouns = new dictionary.Dictionary();

function Noun (word, categories, description) {
	this.word = word;
	this.categories = categories;
	this.description = description;
	Nouns.add_word(this);
}

exports.Noun = Noun;
exports.Nouns = Nouns;
