const Game = require ("./game.js").Game;
const room = require ("./room.js");
const arc = require("./arc.js");
const noun = require("./noun.js");
const c = require("./categories.js");
const Room = room.Room;
const Noun = noun.Noun;
const Nouns = noun.Nouns;

exports.create = () => {
	var g = new Game();

	// TODO: add code to load game definition from file

	g.add_room(new Room("sidewalk","sidewalk",
							  "a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here.")).
		set_supporter(true);

	var p = g.add_room(new Room("front_porch", "porch", 
							  "the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy.  In fact the whole thing looks like it would fall apart with one or two hard kicks.  You better walk carefully."))
		.set_supporter(true);

	p.get_description = function () {
		return this.get_state("broken") ?
			"the remains of the front porch.  The rails have fallen off, the boards are cracked and broken, and what's left looks like it might collapse at any second." : this.description;
	};

	g.when(/jump/).in("front_porch")
		.do(context => {
			context.player.room.set_state("broken", true);
			context.speak("The force of your jumping causes the already fragile porch to collapse!\n");
			context.look();
		});

	g.add_arc("walkway", "west", "sidewalk", "front_porch");

	g.add_room(new Room("ff", "first floor",
						"the first floor of the house"))
		.add_item(new Noun("wand", [c.LIGHTABLE, c.MOVEABLE], "a slender wand of bamboo, 25 centimeters long"))
		.add_item(new Noun("book", [c.LEGIBLE, c.MOVEABLE], "a thin paperback book"));

	g.add_arc("door", "in", "front_porch", "ff");

	g.add_room(new Room("kitchen", "kitchen", "the kitchen")).
		add_item(new Noun("cheese", [c.EDIBLE, c.MOVEABLE], "a block of Cheddar cheese"));

	g.add_arc("hallway", "west", "ff", "kitchen");

	g.add_room(new Room("basement", "basement", "a cluttered basement, full of old furniture, discarded shoes, a washer and dryer, and a worktable.")).
		add_item(new Noun("flashlight", [c.LIGHTABLE, c.MOVEABLE], "flashlight", "a flashlight"));

	g.add_arc("flight of stairs", "down", "ff", "basement");

	g.add_room(new Room("paint_closet", "paint closet", "a tiny closet, full of cans of most-used paint, paint brushes, and some broken lightbulbs"));

	g.add_arc("door", "out", "paint_closet", "basement");

	var a = new arc.Arc(g.room("front_porch"), g.room("paint_closet"), "down", "hole");
	a.enabled = function (context) {
		return this.from.get_state("broken");
	};
	
	a.is_visible = function (context) {
		return this.from.get_state("broken");
	};

	a.follow = function (context) {
		if (this.enabled(context)) {
			context.speak("You carefully climb down.\n");
			context.player.goto(this.to);
			context.speak(context.player.room.describe());
		} else {
			if (this.is_visible(context)) {
				context.speak("You can't");
			} else {
				context.speak("You can't go that way.");
			}
		}
	};

	g.room("front_porch").add_arc(a);

	g.add_room(new Room("back_porch", "porch", "a small porch"))
		.set_supporter(true)
		.add_item(new Noun("raccoon", [], "a raccoon"));

	g.when(/throw wand/).at("raccoon").holding("wand")
		.do((context) => {
			var noun = context.find("wand");
			context.player.room.add_item(context.player.remove_item(noun));
			context.speak("The raccoon deftly grabs the wand and waves it at you, chittering a spell in Raccoonian.  You see a flash of light, and then all vanishes.");
			context.player.goto(g.room("basement"));
		});

	g.when(/throw cheese/).at("raccoon").holding("cheese")
		.do((context) => {
			var noun = context.find("cheese");
			context.player.remove_item(noun);
			context.player.room.remove_item(context.player.room.find("raccoon"));
			context.speak("The raccoon takes a bite of the cheese, then spits it out in horror and shock!  Aughh, cheese!  It runs to the corner of the patio, climbs the fence, and quickly scurries away");
		});

	g.add_arc("door", "out", "kitchen", "back_porch");

	g.add_room(new Room("patio", "patio", "a small patio.  The ground is covered in stone tiles"))
		.set_supporter(true);

	a = g.add_arc("couple of steps", "down", "back_porch", "patio");
	a.follow = function (context) {
		if (this.from.find("raccoon")) {
			context.speak("As you step towards the stairs, the raccoon rushes you.  Startled, you jump back!");
		} else {
			arc.Arc.prototype.follow.call(this, context);
		}
	};

	//---------------------

	g.goto("sidewalk");


	return g;
}
