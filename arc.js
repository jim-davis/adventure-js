const opposite = require ("./opposite.js");
const grammar = require("./grammar.js");

const directions = ["up", "down", "north", "south", "east", "west", "in", "out", "left", "right"];

const abbreviation_to_direction = {"n" : "north",
								   "s" : "south",
								   "e" : "east",
								   "w" : "west",
								   "u" : "up",
								   "d" : "down",
								   "l" : "left",
								   "r" : "right"};

function Arc (from, to, direction, noun_phrase, traversal=null) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.noun_phrase=noun_phrase;
	this.noun = grammar.noun_phrase_noun(noun_phrase);
	this.traversal = traversal;
	this.hidden = noun_phrase == null || noun_phrase.length == 0;
	from.add_arc(this);
}

// can be specialized for conditionally-visible arcs
Arc.prototype.is_visible = function (game) {
	return !this.hidden;
};

// the arc that goes back from to to from in the opposite direction
// only makes sense if the direction is something normal like up or north
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

Arc.prototype.match = function (word) {
	return this.direction == word || this.noun == word;
};

exports.Arc = Arc;

exports.expand_direction_abbreviation = s => abbreviation_to_direction[s];

exports.isDirection = s => directions.indexOf(s) >= 0;


