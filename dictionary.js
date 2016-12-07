var _ = require('lodash');

function Dictionary() {
	this.words = {};
}

Dictionary.prototype.add_word = function (w) {
	// only add words that have a non-empty spelling.
	if (w.word) {
		this.words[w.word] = w;
	}
}

Dictionary.prototype.find = function (w) {
	return this.words[w];
}

Dictionary.prototype.all = function () {
	return _.map(Object.keys(this.words))
		.filter(k => this.words.hasOwnProperty(k))
		.map(k => this.words[k]);
};

exports.Dictionary = Dictionary;


