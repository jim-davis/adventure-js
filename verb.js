var _ = require('lodash');
const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");
const c = require("./categories.js");

const Verbs = new dictionary.Dictionary();

Verbs.categorized_for = function (cat) {
	return _.filter(this.all(), v => v.selects_for_category(cat));
};

function Verb (word, categories, predicate) {
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

Verb.prototype.selects_for_category = function (cat) {
	return this.categories && this.categories.indexOf(cat) >= 0;
};
	
Verb.prototype.execute = function (game, noun) {
	game.speak("Nothing special happens");
};

function Motion (word) {
	Verb.call(this, word, []);
	this.isMotion = true;
}

Motion.prototype = new Verb;

exports.Verb = Verb;

exports.Verbs = Verbs;
exports.Motion = Motion;

