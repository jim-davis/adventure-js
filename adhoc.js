// an Adhoc is just a pair of a predicate and an action.
// The predicate is applied to (current) context and the current input line
// If it is true, the action is executed.
// The game has a list of adhocs.  Each time the user types
// input, the entire set list is applied.  The first one to fire wins

function Adhoc (predicate, action) {
	this.predicate = predicate;
	this.action = action;
	this.active = true;
}

Adhoc.prototype.match = function (context, input) {
	return this.active && this.predicate.call(null, context, input);
};

Adhoc.prototype.execute = function (context, input) {
	this.action.call(this, context, input);
};


// A fluid interface for building the adhoc, especially the predicate
// The regexp is applied to the current input line
// All the other terms are combined with and
function Builder (game, regexp) {
	this.game = game;
	this.regexp = regexp;
}

// The object described by np must be in the same room
Builder.prototype.at = function (np) {
	this.noun_in_room = np;
	return this;
};

// The object described by np must be in the inventory
Builder.prototype.holding = function (np) {
	this.noun_in_inventory = np;
	return this;
};

// TODO add a test of the objects's state, e.g. lamp is lit

// inverts the sense of the next test.
Builder.prototype.not = function () {
	throw "Not implemented";
	return this;
};

// the plater must be in the named room
Builder.prototype.in = function (room_id) {
	this.room_id = id;
	return this;
};

// the lambda to be executed if the predicate matches.
Builder.prototype.do = function (lambda) {
	this.game.add_adhoc(new Adhoc (this.predicate(), lambda));
};

// generates the lambda expression predicate
Builder.prototype.predicate = function () {
	return (context, input) => {
		return this.regexp.test(input) &&
			(!this.noun_in_room || context.player.room.find(this.noun_in_room)) &&
			(!this.room_id || context.player.room.id == this.room_id) &&
			(!this.noun_in_inventory || context.player.find(this.noun_in_inventory));
	};
};
		

exports.Builder = Builder;
