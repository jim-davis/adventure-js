const game = require ("./game.js");
const player = require ("./player.js");
const room = require ("./room.js");
const arc = require("./arc.js");
const noun = require("./noun.js");
const c = require("./categories.js");

const Game = game.Game;
const Player = player.Player;
const Room = room.Room;

const Noun = noun.Noun;
const Nouns = noun.Nouns;

exports.create = () => {
	var g = new Game();

	// TODO: add code to load game definition from file
	g.add_room(new Room("sidewalk","sidewalk",
							  "a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here."));
	g.room("sidewalk").supporter = true;

	g.add_room(new Room("porch", "porch", 
							  "the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy"));
	g.room("porch").supporter = true;
	
	var r = new Room("ff", "first floor",
						"the first floor of the house");
	g.add_room(r);

	g.add_arc("west", "sidewalk", "porch");
	g.add_arc("in", "porch", "ff");

	new Noun("cheese", [c.EDIBLE], "a block of tasty Cheddar");
	g.room("sidewalk").add_item(Nouns.find("cheese"));

	new Noun("wand", [], "a slender wand of bamboo, 25 centimeters long");

	var p = new Player();

	var wand = new Noun("wand", [], "a slender wand of bamboo, 25 centimeters long");
	p.add_item(wand);
	
	g.set_player( p);
	p.goto(g.room("sidewalk"));

	return [g, p];
}
