var _ = require('lodash');
irregular_plurals = {
	"man": "men",
	"woman": "women",
	"go": "goes"};

function pluralize(s) {
	var m;
	var p;
	if (p = irregular_plurals[s]) {
		return p;
	}
	if (m = /^(.*)s[hs]/.exec(s)) {
		return m[0] + "es";
	} else if (m = /^(.*)x/.exec(s)) {
		return m[0] + "es";
	} else if (m = /^(.*[aeiou])y/.exec(s)) {
		return m[0] + "s";
	} else if (m = /^(.*)y/.exec(s)) {
		return m[1] + "ies";
	} else {
		return s + "s";
	}
}

exports.pluralize = pluralize;

exports.pluralize_if = (isPlural, s) => isPlural ? pluralize(s) : s;

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

exports.noun_phrase_noun = np => np.split(/ /)[np.split(/ /).length -1];

exports.comma_separated_list = l => 
	_.slice(l,0,l.length-1).join(", ") + " and " + l[l.length-1];
