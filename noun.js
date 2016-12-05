const _ = require('lodash');
const grammar = require ("./grammar.js");
const dictionary = require ("./dictionary.js");

function Noun (word, categories, description, detail=null) {
	this.word = word;
	this.categories = categories;
	this.description = description; 
	this.detail = detail || "You see nothing special.";
	this.state = {};
}

Noun.prototype.match = function (np) {
	return this.word == np;
}

Noun.prototype.has_category = function (c) {
	return this.categories.indexOf(c) >= 0;
}

Noun.prototype.indefinite_article = function () {
	return this.description.match(/^[aeiou]/) ? "an" : "a";
};

Noun.prototype.definiteNP = function () {
	return "the " + this.word;
};

Noun.prototype.get_state = function (s) {
	return this.state[s];
}

Noun.prototype.set_state = function (s, v) {
	this.state[s]=v;
};

Noun.prototype.default_verb = function () {
	var primary_category = this.categories && this.categories.length > 0 && this.categories[0];
	return null;
};

Noun.prototype.get_detail = function () {
	return this.detail;
};

exports.Noun = Noun;
