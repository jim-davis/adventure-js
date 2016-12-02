const opposite = require ("./opposite.js");
const grammar = require("./grammar.js");

function Arc (from, to, direction, noun_phrase) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.noun_phrase=noun_phrase;
	this.noun = grammar.noun_phrase_noun(noun_phrase);
	this.traversal = null;
}

Arc.directions = ["up", "down", "north", "south", "east", "west", "in", "out"];

Arc.isDirection = function (pp) {
	return Arc.directions.indexOf(pp) >= 0;
};

Arc.prototype.is_visible = function (context) {
	return true;
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

Arc.prototype.enabled = function (context) {
	return true;
};

Arc.prototype.follow = function (context) {
	if (this.enabled(context)) {
		this.traverse(context);
		context.player.goto(this.to);
		context.look();
	} else {
		if (this.is_visible(context)) {
			context.speak("You can't");
		} else {
			context.speak("You can't go that way.");
		}
	}
};

Arc.prototype.traverse = function (context) {
	context.speak((this.traversal || ("You go " + this.direction)) + ".\n");
};

Arc.prototype.match = function (word) {
	return this.direction == word || this.noun == word;
};

exports.Arc = Arc;
