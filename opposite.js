exports.direction = (dir) => opposites[dir];

opposites = {};

function add_pair(a,b) {
	opposites[a]=b;
	opposites[b]=a;
}

add_pair("up", "down");
add_pair("left", "right");
add_pair("in", "out");
add_pair("north", "south");
add_pair("east", "west");
add_pair("left", "right");


