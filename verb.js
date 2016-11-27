const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");

const Verbs = new dictionary.Dictionary();

function Verb (word, categories) {
	this.word = word;
	this.categories = categories;
	Verbs.add_word(this);
}


Verb.prototype.conjugate = function (plural) {
	return grammar.pluralize_if(plural, this.word);
};
	
Verb.prototype.execute = function (context, noun) {
};

exports.Verb = Verb;
exports.Verbs = Verbs;
