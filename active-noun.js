const _ = require('lodash');
const Noun = require("./noun.js").Noun;

function ActiveNoun (word, categories, description, detail=null) {
	Noun.call(this, word, categories, description, detail);
}

ActiveNoun.prototype = new Noun;

exports.ActiveNoun = ActiveNoun;

