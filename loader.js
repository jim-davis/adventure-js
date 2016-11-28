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
	p.add_item(new Noun("wand", [c.MOVEABLE], "a slender wand of bamboo, 25 centimeters long"));

	// TODO: add code to load game definition from file

	g.add_room(new Room("sidewalk","sidewalk",
							  "a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here.")).
		set_supporter(true);

	g.add_room(new Room("porch", "porch", 
							  "the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy.  In fact the whole thing looks like it would fall apart with one or two hard kicks.  You better walk carefully.")).
		set_supporter(true);

	g.add_arc("walkway", "west", "sidewalk", "porch");
	
	g.add_room(new Room("ff", "first floor",
						"the first floor of the house"));
	g.add_arc("door", "in", "porch", "ff");

	g.add_room(new Room("kitchen", "kitchen", "the kitchen")).
		add_item(new Noun("cheese", [c.MOVEABLE, c.EDIBLE], "a block of Cheddar cheese"));

	g.add_arc("hallway", "west", "ff", "kitchen");

	g.add_room(new Room("basement", "basement", "a cluttered basement, full of old furniture, discarded shoes, a washer and dryer, and a worktable.")).
		add_item(new Noun("flashlight", [c.MOVEABLE, c.LIGHTABLE], "a flashlight"));

	g.add_arc("flight of stairs", "down", "ff", "basement");

	g.add_room(new Room("porch", "porch", "a small porch")).
		set_supporter(true)
		.add_item(new Noun("raccoon", [], "a raccoon"));

	g.add_arc("door", "out", "kitchen", "porch");

	g.add_room(new Room("patio", "patio", "a small patio.  The ground is covered in stone tiles")).
		set_supporter(true);

	a = g.add_arc("couple of steps", "down", "porch", "patio");
	a.follow = function (context) {
		if (this.from.find("raccoon")) {
			context.speak("As you step towards the stairs, the raccoon rushes you.  Startled, you jump back!");
		} else {
			arc.Arc.prototype.follow.call(this, context);
		}
	};
	
	//---------------------
	g.set_player( p);
	p.goto(g.room("sidewalk"));

	return [g, p];
}
