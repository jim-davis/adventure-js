const opposite = require ("./opposite.js");
const grammar = require("./grammar.js");

function Arc (from, to, direction, noun_phrase, hidden=false) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.noun_phrase=noun_phrase;
	this.noun = grammar.noun_phrase_noun(noun_phrase);
	this.traversal = null;
	this.hidden = hidden;
}

Arc.directions = ["up", "down", "north", "south", "east", "west", "in", "out"];

Arc.isDirection = function (pp) {
	return Arc.directions.indexOf(pp) >= 0;
};

Arc.prototype.is_visible = function (game) {
	return !this.hidden;
};

Arc.prototype.reverse_arc = function () {
	return new Arc(this.to, 
				   this.from,
				   opposite.direction(this.direction),
				   this.noun_phrase);
}

Arc.prototype.describe = function () {
	return "A " + this.noun_phrase + " leads " + this.direction;
};

Arc.prototype.enabled = function (game) {
	return true;
};

Arc.prototype.follow = function (game) {
	if (this.enabled(game)) {
		game.speak("\n");
		this.traverse(game);
		game.player.goto(this.to);
		game.look();
	} else {
		if (this.is_visible(game)) {
			game.speak("You can't");
		} else {
			game.speak("You can't go that way.");
		}
	}
};


Arc.prototype.traverse = function (game) {
	game.speak((this.traversal || ("You go " + this.direction + ".")) + "\n");
};

Arc.prototype.set_traversal_message = function (str) {
	this.traversal=str;
	return this;
};

Arc.prototype.match = function (word) {
	return this.direction == word || this.noun == word;
};

exports.Arc = Arc;
