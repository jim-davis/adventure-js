const Game = require ("./game.js").Game;
const room = require ("./room.js");
const arc = require("./arc.js");
const noun = require("./noun.js");
const c = require("./categories.js");
const Room = room.Room;
const Noun = noun.Noun;
const Nouns = noun.Nouns;
const Arc = arc.Arc;

function add_rooms(g) {
	g.add_room(new Room("sidewalk","sidewalk in front of a house",
						"a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here.")).
		set_supporter(true);

	var p = g.add_room(new Room("front_porch", "porch", 
								"the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy.  In fact the whole thing looks like it would fall apart with one or two hard kicks.  You better walk carefully."))
		.set_supporter(true);
	p.get_description = function () {
		return this.get_state("broken") ?
			"the remains of the front porch.  The rails have fallen off, the boards are cracked and broken, and what's left looks like it might collapse at any second." : this.description;
	};

	g.add_room(new Room("ff", "first floor",
						"the first floor of the house"))
		.add_item(new Noun("wand", [c.LIGHTABLE, c.MOVEABLE], "a slender wand of bamboo, 25 centimeters long"))
		.add_item(new Noun("book", [c.LEGIBLE, c.MOVEABLE], "a thin paperback book"));

	g.add_room(new Room("kitchen", "kitchen", "the kitchen")).
		add_item(new Noun("cheese", [c.EDIBLE, c.MOVEABLE], "a block of Cheddar cheese"));

	g.add_room(new Room("basement", "basement", "a cluttered basement, full of old furniture, discarded shoes, a washer and dryer, and a worktable.")).
		add_item(new Noun("flashlight", [c.LIGHTABLE, c.MOVEABLE], "flashlight", "a flashlight"));

	g.add_room(new Room("paint_closet", "paint closet", "a tiny closet, full of cans of most-used paint, paint brushes, and some broken lightbulbs"));

	g.add_room(new Room("back_porch", "porch", "a small porch"))
		.set_supporter(true)
		.add_item(new Noun("raccoon", [], "a raccoon"));

	g.add_room(new Room("patio", "patio", "a small patio.  The ground is covered in stone tiles"))
		.set_supporter(true);


	g.add_room(new Room("stop", "streetcar stop",
						"the corner of two big streets.  The light is red in both directions, you better not cross.\nIn the distance you see a streetcar approaching."))
		.set_supporter(true);	// on?  at?

	g.add_room(new Room("stop1", "streetcar stop",
						"the corner of two big streets.  The light is green, you could cross the street now if you wanted.  The streetcar is getting closer."))
		.set_supporter(true);	// on?  at?

	g.add_room(new Room("stop2", "streetcar stop",
						"the corner of two big streets.  The streetcar is here, you could board it."))
		.set_supporter(true);	// on?  at?


	return g;
}


function add_arcs(g) {
	g.add_arc("walkway", "west", "sidewalk", "front_porch");
	g.add_arc("sidewalk", "north", "sidewalk", "sidewalk")
		.set_traversal_message("You walk a long way, but don't see anything interesting, so you turn around.");

	g.add_arc("sidewalk", "south", "sidewalk", "stop", false)
		.set_traversal_message("You head south, and reach a bigger street, where you turn right.");

	g.add_arc("sidewalk", "east", "stop", "sidewalk", false)
		.set_traversal_message("You head east, and when you see a familiar street you turn left");

	g.add_arc("door", "in", "front_porch", "ff");
	g.add_arc("hallway", "west", "ff", "kitchen");
	g.add_arc("flight of stairs", "down", "ff", "basement");
	g.add_arc("door", "out", "paint_closet", "basement");

	var a = new Arc(g.room("front_porch"), g.room("paint_closet"), "down", "hole");
	a.enabled = function (context) {
		return this.from.get_state("broken");
	};
	
	a.is_visible = function (context) {
		return this.from.get_state("broken");
	};
	a.traversal = "You carefully climb down.";

	g.room("front_porch").add_arc(a);


	g.add_arc("door", "out", "kitchen", "back_porch");

	a = g.add_arc("couple of steps", "down", "back_porch", "patio");
	a.follow = function (context) {
		if (this.from.find("raccoon")) {
			context.speak("As you step towards the stairs, the raccoon rushes you.  Startled, you jump back!");
		} else {
			Arc.prototype.follow.call(this, context);
		}
	};

	g.add_arc("", "wait", "stop", "stop1", false, true)
	.set_traversal_message("You wait a while.  The traffic light turns green.  The streetcar gets closer.");
	g.add_arc("sidewalk", "east", "stop1", "sidewalk", false)
		.set_traversal_message("You stop waiting around and head back east.  When you see a familiar street you turn left and go up it.");


	g.add_arc("", "wait", "stop1", "stop2", false, true)
	.set_traversal_message("You wait some more.  The streetcar pulls up.");
	g.add_arc("sidewalk", "east", "stop2", "sidewalk", false)
		.set_traversal_message("You walk away from the streetcar.  When you see a familiar street you turn left.");

	g.add_arc("", "wait", "stop2", "stop", false, true)
	.set_traversal_message("The streetcar departs without you.");

	return g;
}

function add_actions(g) {
	add_porch_smashing(g);
	add_raccoon_fight(g);
	return g;
}

function add_porch_smashing(g) {
	g.when(/jump/).in("front_porch")
		.state(context => !context.player.room.get_state("broken"))
		.do(context => {
			context.player.room.set_state("broken", true);
			context.speak("The force of your jumping causes the already fragile porch to collapse!\n");
			context.look();
		});

	// synonyms.  I hate how much duplication there is for each synonym
	g.when(/smash/).in("front_porch")
		.state(context => !context.player.room.get_state("broken"))
		.do(context => {
			context.player.room.set_state("broken", true);
			context.speak("You smash the porch!\n");
			context.look();
	});

	g.when(/stomp/).in("front_porch")
		.state(context => !context.player.room.get_state("broken"))
		.do(context => {
			context.player.room.set_state("broken", true);
			context.speak("You stomp once, twice, three times.  The porch collapses!\n");
			context.look();
		});

	g.when(/break/).in("front_porch")
		.state(context => !context.player.room.get_state("broken"))
		.do(context => {
			context.player.room.set_state("broken", true);
			context.speak("You stomp and kick, and the porch breaks!\n");
			context.look();
	});

	g.when(/kick/).in("front_porch")
		.state(context => !context.player.room.get_state("broken"))
		.do(context => {
			context.player.room.set_state("broken", true);
			context.speak("Two or three hard kicks, and the porch collapses!\n");
			context.look();
		});
}

function add_raccoon_fight(g) {
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
}


exports.create = () => {
	var g = new Game();
	add_rooms(g);
	add_arcs(g);
	add_actions(g);

	g.goto("sidewalk");
	return g;
}
