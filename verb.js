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

Verb.prototype.isIntransitive = function () {
	return this.categories == null;
}
	
Verb.prototype.execute = function (context, noun) {
	console.log("Nothing special happens");
};

function Motion (word) {
	this.isMotion = true;
	Verb.call(word, []);
}

Motion.prototype = Verb;

exports.Verb = Verb;
exports.Verbs = Verbs;
exports.Motion = Motion;

