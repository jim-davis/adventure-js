const _ = require('lodash');
const Game = require ("./game.js").Game;
const room = require ("./room.js");
const arc = require("./arc.js");
const Noun = require("./noun.js").Noun;
const c = require("./categories.js");
const Room = room.Room;
const Arc = arc.Arc;

const Dynamite = require("./dynamite.js").Dynamite;

function add_rooms(g) {

	g.make_room("sidewalk","sidewalk in front of a house",
						"a city sidewalk in Toronto.  Passing traffic makes it unsafe to cross the street here.", "on")
	.add_item(new Dynamite());

	var p = g.make_room("front_porch", "porch", "on", 
						"the front porch of a house.  The porch is painted green and purple, but the paint is peeling off the steps.  The rails are partially rotten and look flimsy.  In fact the whole thing looks like it would fall apart with one or two hard kicks.  You better walk carefully.", "on");
	p.get_description = function () {
		return this.get_state("broken") ?
			"the remains of the front porch.  The rails have fallen off, the boards are cracked and broken, and what's left looks like it might collapse at any second." : this.description;
	};

	g.make_room("ff", "first floor",
				"the first floor of the house")
		.add_item(new Noun("wand", [c.LIGHTABLE, c.MOVEABLE], "slender wand of bamboo, 25 centimeters long",
						  "A closer look shows that one end is lightly charred, and a few fine cracks run a few centimeters from the end."))
		.add_item(new Noun("book", [c.LEGIBLE, c.MOVEABLE], "thin paperback book",
						  "The cover has been partially damaged, and is hard to read, but says something like \"The art and ..of Light...\".  It shows a long-haired, be-spectaled old man holding a strange jar in one hand, and a large key in the other.  You'll probably have to read it to learn more"));

	g.make_room("kitchen", "kitchen", "the kitchen")
		.add_item(new Noun("cheese", [c.EDIBLE, c.MOVEABLE], "block of cheese", "It's Cheddar cheese, two or three years old."));

	g.make_room("basement", "basement", "a cluttered basement, full of old furniture, discarded shoes, a washer and dryer, and a worktable.")
		.add_item(new Noun("flashlight", [c.LIGHTABLE, c.MOVEABLE], "flashlight",
						   "It's made of a dark metal, and looks pretty tough."));

	g.make_room("paint_closet", "paint closet", "a tiny closet, full of cans of most-used paint, paint brushes, and some broken lightbulbs");

	g.make_room("back_porch", "porch", "a small porch", "on")
		.add_item(new Noun("raccoon", [], "raccoon",
						  "The raccoon stands up on its hind legs and shakes its tiny fist at you in a menacing way.  Its eyes gleam with sinister intent."));

	g.make_room("patio", "patio", 
				"a small patio.  The ground is covered in stone tiles",
				"on");

	g.make_room("stop", "streetcar stop",
				"the corner of two big streets.  The light is red in both directions, you better not cross.\nIn the distance you see a streetcar approaching", "at");

	g.make_room("stop1", "streetcar stop",
				"the corner of two big streets.  The light is green, you could cross the street now if you wanted.  The streetcar is getting closer.", "at");

	g.make_room("stop2", "streetcar stop",
				"the corner of two big streets.  The streetcar is here, you could board it.",
				"at");

	g.make_room("bloor@bathurst", "the corner of Bloor and Bathurst",
				"the corner of Bloor and Bathurst, in front of Honest Eds department store", "on");

	return g;
}

function add_streetcar_route(g) {
	var riding_id;
	var stop_id = null;
	_.forEach(["Ulster Street", "Harbord Street", "Bloor Street"],
			  (crossstreet, idx, col) => {
				  riding_id = "streetcar" + idx;

				  g.make_room(riding_id, "streetcar",
							  "the streetcar, heading north up Bathurst Street.  Next stop: " + crossstreet,
							  "riding");

				  if (stop_id) {
					  g.add_transition_arc("wait", stop_id, riding_id, "the streetcar begins moving again");
				  }

				  g.add_transition_arc("exit", riding_id, riding_id, 
									   (idx == 0 ? 
									   "You try to get off, but a car comes speeding up the road, ignoring the open door.  The TTC driver blares this horm in anger, but it's still not safe to get off" : 
									   "You try to get off, but the streetcar is too crowded.  Though you push and shove, the doors close before you can get off."));

				  stop_id = "streetcar@" + crossstreet;
				  
				  g.make_room(stop_id, "stopped at " + crossstreet,
							  "the streetcar, stopped at " + crossstreet, "on");

				  g.add_transition_arc("wait", riding_id, stop_id, 
									   "the streetcar continues north, then stops. " +
									   (idx == 0 ? "  Many people get on." : "  Even more people get on."));
				  });
				  
	g.add_transition_arc("board", "stop2", "streetcar0",
						 "You step into the streetcar, and it heads north");
	
	g.add_transition_arc("exit", stop_id, "bloor@bathurst", "Pushing hard, you finally force your way off the streetcar");
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
	// jump, smash, stomp, break, kick porch
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


exports.create = (g) => {
	add_rooms(g);
    add_streetcar_route(g);
	add_arcs(g);

	add_actions(g);

	g.goto("sidewalk");
	return g;
}
