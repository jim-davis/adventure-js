var _ = require('lodash');
const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");
const c = require("./categories.js");

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

Verb.prototype.selects_for = function (noun) {
	return _.find(this.categories, cat => cat == c.ANY || noun.has_category(cat));
};
	
Verb.prototype.execute = function (context, noun) {
	context.speak("Nothing special happens");
};

function Motion (word) {
	this.isMotion = true;
	Verb.call(word, []);
}

Motion.prototype = Verb;

exports.Verb = Verb;
exports.Verbs = Verbs;
exports.Motion = Motion;

