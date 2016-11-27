var _ = require('lodash');

function Room(id, brief, description) {
	this.id = id;
	this.brief = brief;
	this.description=description;
	this.supporter = false;
	this.arcs = {};
	this.contents = [];
}

Room.prototype.describe = function () {
	var s = "You are " + this.preposition() + " " + this.description;
	if (this.contents.length > 0) {
		s += "\nYou see:\n";
		s += _.map(this.contents, n => n.description).join("\n");
	}

	// should show only VISIBLE arcs
	if (Object.keys(this.arcs).length > 0) {
		s += "\nYou can go: ";
		s += _.map(Object.keys(this.arcs),(dir) => dir).join();
		s += "\n";
	}

	return s;
};

Room.prototype.preposition = function () {
	return this.supporter ? "on" : "in";
};

Room.prototype.add_arc = function (arc) {
	this.arcs[arc.direction]=arc;
};

Room.prototype.has_arc = function (direction) {
	return this.arcs[direction];
};

Room.prototype.has_item = function (noun) {
	return this.contents.indexOf(noun) >= 0;
};

Room.prototype.add_item = function (noun) {
	this.contents.push(noun);
	return noun;
};

Room.prototype.remove_item = function (noun) {
	var idx = this.contents.indexOf(noun);
	if (idx < 0) {
		throw("Room " + this + " does not contain " + noun);
	} else {
		this.contents.splice(idx, 1)
		return noun;
	}
}
	

Room.prototype.find = function (np) {
	return _.find(this.contents, n => n.match(np));
};

exports.Room = Room;
