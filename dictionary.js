function Dictionary() {
	this.words = {};
}

Dictionary.prototype.add_word = function (w) {
	this.words[w.word] = w;
}

Dictionary.prototype.find = function (w) {
	return this.words[w];
}

exports.Dictionary = Dictionary;
