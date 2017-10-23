const menu_width_pixels = 150;
const viewport_width = 19;
const viewport_height = 11;
const grid_width = 29;
const grid_height = 13;
const grid_square_length = 50;
const game_height_pixels = ( grid_height * grid_square_length );
const game_width_pixels = ( grid_width * grid_square_length );
const viewport_height_pixels = ( viewport_height * grid_square_length );
const viewport_width_pixels = ( viewport_width * grid_square_length );
const game = new Phaser.Game( ( viewport_width * grid_square_length ), ( viewport_height * grid_square_length ), Phaser.CANVAS, "container", { preload: preload, create: create, update: update, render: render });

function preload() {

	// map
	game.load.image( "space", "img/space.png" );
	game.load.image( "ship", "img/ship.png" );
	game.load.image( "grid", "img/grid_square.png" );
	game.load.image( "planet_a", "img/planet_a.png" );
	game.load.image( "planet_b", "img/planet_b.png" );
	game.load.image( "fog_of_war", "img/fog_of_war.png" );

	// menu
	game.load.image( "menu_background", "img/menu_background.png" );
	game.load.image( "menu_fuel_border_cap_right", "img/menu_fuel_border_cap_right.png" );
	game.load.image( "menu_fuel_border_cap_left", "img/menu_fuel_border_cap_left.png" );
	game.load.image( "menu_fuel_border_mid", "img/menu_fuel_border_mid.png" );
	game.load.image( "menu_fuel_full", "img/menu_fuel_full.png" );
	game.load.image( "menu_fuel_next", "img/menu_fuel_next.png" );
	game.load.image( "menu_fuel_empty", "img/menu_fuel_empty.png" );

}

let cursors;
let ship;
let planet_a;
let planet_b;
let ship_width = 50;
let ship_height = ship_width;
let max_fuel = 20;
let fuel_per_square = 1;
let fuel = 20;
let fog_of_war_radius = 5;
let fog_of_war_radius_pixels = ( fog_of_war_radius * grid_square_length );
let sprites = {};

let map_group;
let grid_group;
let planets_group;
let ship_group;
let fog_of_war_group;
let menu_group;

let menu_fuel_full;
let menu_fuel_next;
let menu_fuel_empty;

const menu_fuel_width = 128;
const pixels_per_fuel = ( menu_fuel_width / max_fuel );

function addMenu() {

	// background
	let background = game.add.tileSprite( 0, 0, menu_width_pixels, viewport_height_pixels, "menu_background" );

	// fuel
	let fuel_style = { font: "14px Arial", fill: "white" };
	let fuel_text = game.add.text( 10, 10, "Fuel", fuel_style );
	let fuel_border_left = game.add.sprite( 10, 30, "menu_fuel_border_cap_left" );
	let fuel_border_right = game.add.sprite( 125, 30, "menu_fuel_border_cap_right" );
	let fuel_border_mid = game.add.tileSprite( 25, 30, 100, 15, "menu_fuel_border_mid" );

	menu_fuel_empty = game.add.tileSprite( 11, 31, menu_fuel_width, 13, "menu_fuel_empty" );
	menu_fuel_next = game.add.tileSprite( 11, 31, 1, 13, "menu_fuel_next" );
	menu_fuel_full = game.add.tileSprite( 11, 31, 1, 13, "menu_fuel_full" );
	menu_fuel_full.visible = false;
	menu_fuel_next.visible = false;

	menu_group.add( background );
	menu_group.add( fuel_text );
	menu_group.add( fuel_border_left );
	menu_group.add( fuel_border_right );
	menu_group.add( fuel_border_mid );
	menu_group.add( menu_fuel_empty );
	menu_group.add( menu_fuel_next );
	menu_group.add( menu_fuel_full );

	menu_group.fixedToCamera = true;	
}

function updateMenuFuel() {
	console.log( "updateMenuFuel" )
	let fuel_left = ( fuel / fuel_per_square );
	console.log( "fuel_left", fuel_left )
	menu_fuel_full.width = ( Math.max( 0, ( fuel_left - 1 ) ) * pixels_per_fuel );
	menu_fuel_next.width = ( fuel_left * pixels_per_fuel );
	menu_fuel_full.visible = ( menu_fuel_full.width > 0 );
	menu_fuel_next.visible = ( menu_fuel_next.width > 0 );
}

function addGrid() {
	grid_group.add( game.add.tileSprite( menu_width_pixels, 0, game_width_pixels, game_height_pixels, "grid" ) );
}

function addFogOfWar() {
	sprites.fog_of_war = [];
	for ( let x = 0; x < grid_width; x++ ) {
		sprites.fog_of_war.push( [] );
		for ( let y = 0; y < grid_height; y++ ) {
			let sprite = game.add.sprite( ( x * grid_square_length ), ( y * grid_square_length ), "fog_of_war" );
			sprites.fog_of_war[ x ].push( sprite );
			fog_of_war_group.add( sprite );
		}
	}
}

function addPlanets() {
	planet_a = game.add.sprite( ( ( 1 * grid_square_length ) + menu_width_pixels ), ( 5 * grid_square_length ), "planet_a" );
	planet_group.add( planet_a );
	addPlanetInfo( planet_a );
	planet_b = game.add.sprite( ( ( 17 * grid_square_length ) + menu_width_pixels ), ( 5 * grid_square_length ), "planet_b" );
	planet_group.add( planet_b );
	addPlanetInfo( planet_b );
}

function addPlanetInfo( ship ) {
	let style = { font: "16px Arial", fill: "white" };
	text = game.add.text( 0, 0, "test text", style );
	text.anchor.set( 0.5 );
	text.x = ( ship.x + ( ship.width / 2 ) );
	text.y = ( ship.y - 10 );
	planet_group.add( text );
}

function addShip() {
	ship = game.add.sprite( ( ( ( 2 * grid_square_length ) - ( ship_width * 0.5 ) ) + menu_width_pixels ), ( ( 6 * grid_square_length ) - ( ship_height * 0.5 ) ), "ship" );
	ship_group.add( ship );
	ship.anchor.set( 0.5 );
}

const camera_bounds = {
	x: {
		min: ( ( game.width / 2 ) - grid_square_length ),
		max: ( game_width_pixels - ( game.width / 2 ) ),
	},
	y: {
		min: ( ( game.height / 2 ) - grid_square_length ),
		max: ( game_height_pixels - ( game.height / 2 ) ),
	}
};
function updateCamera( x, y ) {
	if ( y > camera_bounds.y.min ) {
		if ( y < camera_bounds.y.max )
			game.camera.y = ( y - ( game.height / 2 ) + ( grid_square_length / 2 ) );
		else
			game.camera.y = ( camera_bounds.y.max - ( game.height / 2 ) + ( grid_square_length / 2 ) );
	}
	else {
		game.camera.y = 0;
	}
	if ( x > camera_bounds.x.min ) {
		if ( x < camera_bounds.x.max )
			game.camera.x = ( x - ( game.width / 2 ) + ( grid_square_length / 2 ) );
		else
			game.camera.x = ( camera_bounds.x.max - ( game.width / 2 ) + ( grid_square_length / 2 ) );
	}
	else {
		game.camera.x = 0;
	}
}

function addControls() {

	// up
	game.input.keyboard.addKey( Phaser.Keyboard.UP ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() ) {
			console.log( "No Fuel" );
			return;
		}
		ship.y -= ( ( ship.y - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		ship.angle = 270;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
		updateFogOfWar();
	}, this );

	// down
	game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() ) {
			console.log( "No Fuel" );
			return;
		}
		ship.y += ( ( ship.y + grid_square_length ) > game_height_pixels ) ? 0 : grid_square_length;
		ship.angle = 90;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
		updateFogOfWar();
	}, this );

	// right
	game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() ) {
			console.log( "No Fuel" );
			return;
		}
		ship.x += ( ( ship.x + grid_square_length ) > game_width_pixels ) ? 0 : grid_square_length;
		ship.angle = 0;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
		updateFogOfWar();
	}, this );

	// left
	game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() ) {
			console.log( "No Fuel" );
			return;
		}
		ship.x -= ( ( ship.x - grid_square_length ) < menu_width_pixels ) ? 0 : grid_square_length;
		ship.angle = 180;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
		updateFogOfWar();
	}, this );
}

function updateFuel( increment, set ) {
	if ( set )
		fuel = increment;
	else
		fuel += increment;

	if ( fuel < 0 )
		fuel = 0;

	updateMenuFuel();

	console.log( "Fuel [%s]", fuel );
}

function needsFuel() {
	return true;
}

function hasFuel() {
	return ( fuel > 0 );
}

function arrivePlanet() {
	updateFuel( max_fuel, true );
}

function checkPosition() {

	if ( ship.overlap( planet_a ) )
		arrivePlanet();
	else if ( ship.overlap( planet_b ) )
		arrivePlanet();
	else
		updateFuel( -( fuel_per_square ) );
}

/*
	checks fog_of_war_radius + 1 squares around ship and updates visibility
	the "+ 1" is to hide the previous moves squares that are no longer in range
	if one pixel is within the radius, the square is revealed
*/
function updateFogOfWar() {
	let ship_x = ( ship.x - ( grid_square_length / 2 ) );
	let ship_y = ( ship.y - ( grid_square_length / 2 ) );
	let min_x_pixels = Math.max( menu_width_pixels, ( ship_x - fog_of_war_radius_pixels - grid_square_length ) );
	let min_y_pixels = Math.max( 0, ( ship_y - fog_of_war_radius_pixels - grid_square_length ) );
	let max_x_pixels = Math.min( game_width_pixels, ( ship_x + fog_of_war_radius_pixels + grid_square_length ) );
	let max_y_pixels = Math.min( game_height_pixels, ( ship_y + fog_of_war_radius_pixels + grid_square_length ) );
	let min_x = Math.ceil( min_x_pixels / grid_square_length );
	let min_y = Math.ceil( min_y_pixels / grid_square_length );
	let max_x = Math.floor( max_x_pixels / grid_square_length );
	let max_y = Math.floor( max_y_pixels / grid_square_length );
	for ( let x = min_x; x < max_x; x++ ) {
		for ( let y = min_y; y < max_y; y++ ) {
			let closest_x = ( ship_x > x ) ? ( x * grid_square_length ) : ( ( x - 1 ) * grid_square_length );
			let closest_y = ( ship_y > y ) ? ( y * grid_square_length ) : ( ( y - 1 ) * grid_square_length );
			let is_inside = ( ( Math.pow( ( closest_x - ship_x ), 2 ) + Math.pow( ( closest_y - ship_y ), 2 ) ) < Math.pow( fog_of_war_radius_pixels, 2 ) );
			sprites.fog_of_war[ x ][ y ].visible = ! is_inside;
		}
	}
}

function create() {
	map_group = game.add.group();
	grid_group = game.add.group();
	planet_group = game.add.group();
	ship_group = game.add.group();
	fog_of_war_group = game.add.group();
	menu_group = game.add.group();

	game.world.setBounds( 0, 0, game_width_pixels, game_height_pixels );

	//  This will run in Canvas mode, so let"s gain a little speed and display
	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;

	//  We need arcade physics
	game.physics.startSystem( Phaser.Physics.ARCADE );

	//  A spacey background
	map_group.add( game.add.tileSprite( menu_width_pixels, 0, game_width_pixels, game_height_pixels, "space" ) );

	addGrid();
	addPlanets();
	addFogOfWar();
	addShip();
	addControls();
	addMenu();
	updateFogOfWar();
}

function update() {

}


function render() {
}
