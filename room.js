var _ = require('lodash');
var grammar = require("./grammar.js")

function Room(id, brief, description) {
	this.id = id;
	this.brief = brief;
	this.description=description;
	this.supporter = false;
	this.arcs = {};
	this.contents = [];
	this.state = {};
}

// return the string that describes the room from player's perspective
Room.prototype.describe = function (game, verbose) {
	var s = (game.player.has_seen(this) && ! verbose) ? 
		this.brief : 
		"You are " + this.preposition() + " " + this.get_description(game);

	if (this.contents.length > 0) {
		s += "\nYou see:\n";
		s += _.map(this.contents, n => " " + n.description).join("\n");
	}

	if (this.visible_exits(game)) {
		var arcs_by_noun = _.groupBy(this.visible_exits(), a => a.noun_phrase);
		s += "\n\n" + _.map(Object.keys(arcs_by_noun),
			  n => { var arcs = arcs_by_noun[n];
					 return arcs.length == 1 ? arcs[0].describe() : 
					 grammar.pluralize(arcs[0].noun_phrase) + 
					 " lead " +
					 grammar.comma_separated_list(_.map(arcs, a => a.direction));
					 })
			.join("\n");
	}

	return s;
};


// normally this is just the static description of the room
// but it may be state dependent.
Room.prototype.get_description = function (game) {
	return this.description;
};

Room.prototype.get_state = function (s) {
	return this.state[s];
}

Room.prototype.set_state = function (s, v) {
	this.state[s]=v;
};

// the arcs leading out that are currently visible
Room.prototype.visible_exits = function (game) {
	return _.filter(this.arcs, a => a.is_visible(game));
};


Room.prototype.add_arc = function (arc) {
	this.arcs[arc.direction]=arc;
};

// find the arc, either by direction or by the noun of its name
Room.prototype.has_arc = function (direction) {
	return this.arcs[direction] ||
		_.find(this.arcs, a => a.match(direction));
};

// true iff the noun is in the room
Room.prototype.has_item = function (noun) {
	return this.contents.indexOf(noun) >= 0;
};

// add a noun.  Return the room so we can chain methods
Room.prototype.add_item = function (noun) {
	this.contents.push(noun);
	return this;
};

// remove the noun.  It is an error to call this if not thee
Room.prototype.remove_item = function (noun) {
	var idx = this.contents.indexOf(noun);
	if (idx < 0) {
		throw("Room " + this + " does not contain " + noun);
	} else {
		this.contents.splice(idx, 1)
		return noun;
	}
}

// If a room is a "supporter" it supports the player, so
// we say you are "on" the room not "in" the room.
// So "on the stairs", "on the sidewalk", but "in the living room"
Room.prototype.set_supporter = function (b) {
	this.supporter = b;
	return this;
};

// the preposition to use when describing the players
// relation to the room: usually it is "in" but it could be "on"
Room.prototype.preposition = function () {
	return this.supporter ? "on" : "in";
};


// the the Noun in the room
Room.prototype.find = function (np) {
	return _.find(this.contents, n => n.match(np));
};

exports.Room = Room;
