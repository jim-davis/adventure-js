const Game = require ("./game.js").Game;
const room = require ("./room.js");
const arc = require("./arc.js");
const noun = require("./noun.js");
const c = require("./categories.js");
const Room = room.Room;
const Noun = noun.Noun;
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
	g.add_arc_pair("walkway", "west", "sidewalk", "front_porch");
	g.add_arc("sidewalk", "north", "sidewalk", "sidewalk",
			  "You walk a long way, but don't see anything interesting, so you turn around.");

	g.add_arc("sidewalk", "south", "sidewalk", "stop",
			  "You head south, and reach a bigger street, where you turn right.");

	g.add_arc("sidewalk", "east", "stop", "sidewalk",
			  "You head east, and when you see a familiar street you turn left");

	g.add_arc_pair("door", "in", "front_porch", "ff");
	g.add_arc_pair("hallway", "west", "ff", "kitchen");
	g.add_arc_pair("flight of stairs", "down", "ff", "basement");
	g.add_arc_pair("door", "out", "paint_closet", "basement");

	var a = g.add_arc("hole", "down", "front_porch", "paint_closet",
					  "you carefully climb down");

	a.is_visible = function (game) {
		return this.from.get_state("broken");
	};
	a.enabled = function (game) {
		return this.is_visible();
	};


	g.add_arc_pair("door", "out", "kitchen", "back_porch");

	[a,b] = g.add_arc_pair("couple of steps", "down", "back_porch", "patio");
	a.follow = function (game) {
		if (this.from.find("raccoon")) {
			game.speak("As you step towards the stairs, the raccoon rushes you.  Startled, you jump back!");
		} else {
			Arc.prototype.follow.call(this, game);
		}
	};

	g.add_transition_arc("wait", "stop", "stop1",
					 "You wait a while.  The traffic light turns green.  The streetcar gets closer.");

	g.add_arc("sidewalk", "east", "stop1", "sidewalk",
					  "You stop waiting around and head back east.  When you see a familiar street you turn left and go up it.");

	g.add_transition_arc("wait", "stop1", "stop2", 
					 "You wait some more.  The streetcar pulls up.");

	g.add_arc("sidewalk", "east", "stop2", "sidewalk",
					  "You walk away from the streetcar.  When you see a familiar street you turn left.");

	g.add_transition_arc("wait", "stop2", "stop", 
					 "The streetcar departs without you.");

	return g;
}

function add_actions(g) {
	add_porch_smashing(g);
	add_raccoon_fight(g);
	return g;
}

function add_porch_smashing(g) {
	g.when(/jump/).in("front_porch")
		.state(game => !game.player.room.get_state("broken"))
		.do(game => {
			game.player.room.set_state("broken", true);
			game.speak("The force of your jumping causes the already fragile porch to collapse!\n");
			game.look();
		});

	// synonyms.  I hate how much duplication there is for each synonym
	g.when(/smash/).in("front_porch")
		.state(game => !game.player.room.get_state("broken"))
		.do(game => {
			game.player.room.set_state("broken", true);
			game.speak("You smash the porch!\n");
			game.look();
	});

	g.when(/stomp/).in("front_porch")
		.state(game => !game.player.room.get_state("broken"))
		.do(game => {
			game.player.room.set_state("broken", true);
			game.speak("You stomp once, twice, three times.  The porch collapses!\n");
			game.look();
		});

	g.when(/break/).in("front_porch")
		.state(game => !game.player.room.get_state("broken"))
		.do(game => {
			game.player.room.set_state("broken", true);
			game.speak("You stomp and kick, and the porch breaks!\n");
			game.look();
	});

	g.when(/kick/).in("front_porch")
		.state(game => !game.player.room.get_state("broken"))
		.do(game => {
			game.player.room.set_state("broken", true);
			game.speak("Two or three hard kicks, and the porch collapses!\n");
			game.look();
		});
}

function add_raccoon_fight(g) {
	g.when(/throw wand/).at("raccoon").holding("wand")
		.do((game) => {
			var noun = game.find("wand");
			game.player.room.add_item(game.player.remove_item(noun));
			game.speak("The raccoon deftly grabs the wand and waves it at you, chittering a spell in Raccoonian.  You see a flash of light, and then all vanishes.");
			game.player.goto(g.room("basement"));
		});

	g.when(/throw cheese/).at("raccoon").holding("cheese")
		.do((game) => {
			var noun = game.find("cheese");
			game.player.remove_item(noun);
			game.player.room.remove_item(game.player.room.find("raccoon"));
			game.speak("The raccoon takes a bite of the cheese, then spits it out in horror and shock!  Aughh, cheese!  It runs to the corner of the patio, climbs the fence, and quickly scurries away");
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
