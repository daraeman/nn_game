const viewport_width = 19;
const viewport_height = 11;
const grid_width = 21;
const grid_height = 13;
const grid_square_length = 50;
const game_height_pixels = ( grid_height * grid_square_length );
const game_width_pixels = ( grid_width * grid_square_length );
const game = new Phaser.Game( ( viewport_width * grid_square_length ), ( viewport_height * grid_square_length ), Phaser.CANVAS, "container", { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image( "space", "img/ascii/space.png" );
	game.load.image( "ship", "img/ascii/ship.png" );
	game.load.image( "grid", "img/ascii/grid_square.png" );
	game.load.image( "planet_a", "img/ascii/a.png" );
	game.load.image( "planet_b", "img/ascii/b.png" );

}

let cursors;
let ship;
let planet_a;
let planet_b;
let ship_width = 50;
let ship_height = ship_width;
let max_fuel = 20;
let fuel = 20;

function addGrid() {
	game.add.tileSprite( 0, 0, game_width_pixels, game_height_pixels, "grid" );
}

function addPlanets() {
	planet_a = game.add.sprite( ( 1 * grid_square_length ), ( 5 * grid_square_length ), "planet_a" );
	addPlanetInfo( planet_a );
	planet_b = game.add.sprite( ( 17 * grid_square_length ), ( 5 * grid_square_length ), "planet_b" );
	addPlanetInfo( planet_b );
}

function addPlanetInfo( ship ) {
	let style = { font: "16px Arial", fill: "white" };
	text = game.add.text( 0, 0, "test text", style );
	text.anchor.set( 0.5 );
	text.x = ( ship.x + ( ship.width / 2) );
	text.y = ( ship.y - 10 );
}

function addShip() {
	ship = game.add.sprite( ( ( 2 * grid_square_length ) - ( ship_width * 0.5 ) ), ( ( 6 * grid_square_length ) - ( ship_height * 0.5 ) ), "ship" );
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
		if ( needsFuel() && ! hasFuel() )
			return;
		ship.y -= ( ( ship.y - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		ship.angle = 270;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
	}, this );

	// down
	game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() )
			return;
		ship.y += ( ( ship.y + grid_square_length ) > game_height_pixels ) ? 0 : grid_square_length;
		ship.angle = 90;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
	}, this );

	// right
	game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() )
			return;
		ship.x += ( ( ship.x + grid_square_length ) > game_width_pixels ) ? 0 : grid_square_length;
		ship.angle = 0;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
	}, this );

	// left
	game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => {
		checkPosition();
		if ( needsFuel() && ! hasFuel() )
			return;
		ship.x -= ( ( ship.x - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		ship.angle = 180;
		updateCamera( ( ship.x - ( grid_square_length / 2 ) ), ( ship.y - ( grid_square_length / 2 ) ) );
	}, this );
}

function updateFuel( increment, set ) {
	if ( set )
		fuel = increment;
	else
		fuel += increment;

	if ( fuel < 0 )
		fuel = 0;
	
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
		updateFuel( -1 );
}

function create() {

	//game.world.resize( ( grid_width * grid_square_length ), ( grid_height * grid_square_length ) );

	game.world.setBounds( 0, 0, game_width_pixels, game_height_pixels );

	//  This will run in Canvas mode, so let"s gain a little speed and display
	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;

	//  We need arcade physics
	game.physics.startSystem( Phaser.Physics.ARCADE );

	//  A spacey background
	game.add.tileSprite( 0, 0, game_width_pixels, game_height_pixels, "space" );

	addGrid();
	addPlanets();
	addShip();
	addControls();

}

function update() {

}


function render() {}
