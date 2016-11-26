const world = require ("./world.js");

const Game = world.Game;
const Player = world.Player;
const Room = world.Room;

// add code to load game from file
exports.create = () => {
	var g = new Game();

	g.add_room(new Room("sidewalk","sidewalk",
							  "a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here."));
	g.add_room(new Room("porch", "porch", 
							  "the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy"));
	
	var r = new Room("ff", "first floor",
						"the first floor of the house");
	g.add_room(r);

	g.add_arc("west", "sidewalk", "porch");
	g.add_arc("in", "porch", "ff");

	var p = new Player();
	
	g.set_player( p);
	p.location = g.room("sidewalk");

	return g;
}
