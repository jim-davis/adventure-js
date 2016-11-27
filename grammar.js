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

function pluralize_if (isPlural, s) {
	return isPlural ? pluralize(s) : s;
}

exports.pluralize = pluralize;
exports.pluralize_if = pluralize_if;

