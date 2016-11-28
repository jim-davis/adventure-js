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

	var p = new Player();
	p.add_item(new Noun("wand", [], "a slender wand of bamboo, 25 centimeters long"));

	// TODO: add code to load game definition from file

	g.add_room(new Room("sidewalk","sidewalk",
							  "a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here."));
	g.room("sidewalk").supporter = true;

	g.add_room(new Room("porch", "porch", 
							  "the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy"));
	g.room("porch").supporter = true;

	g.add_arc("walkway", "west", "sidewalk", "porch");
	
	g.add_room(new Room("ff", "first floor",
						"the first floor of the house"));
	g.add_arc("door", "in", "porch", "ff");


	g.add_room(new Room("k1", "kitchen", "the kitchen")).
		add_item(new Noun("cheese", [c.EDIBLE], "a block of Cheddar cheese"));

	g.add_arc("hallway", "west", "ff", "k1");

	g.add_room(new Room("basement", "basement", "a cluttered basement, full of old furniture, discarded shoes, a washer and dryer, and a worktable.")).
		add_item(new Noun("flashlight", [c.LIGHTABLE], "a flashlight"));

	g.add_arc("flight of stairs", "down", "ff", "basement");

	g.set_player( p);
	p.goto(g.room("sidewalk"));

	return [g, p];
}
