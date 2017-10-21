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

let sprite;
let cursors;
let ship_width = 50;
let ship_height = ship_width;

function addGrid() {
	game.add.tileSprite( 0, 0, game_width_pixels, game_height_pixels, "grid" );
}

function addPlanets() {
	game.add.sprite( ( 1 * grid_square_length ), ( 5 * grid_square_length ), "planet_a" );
	game.add.sprite( ( 17 * grid_square_length ), ( 5 * grid_square_length ), "planet_b" );
}

function addShip() {
	sprite = game.add.sprite( ( ( 2 * grid_square_length ) - ( ship_width * 0.5 ) ), ( ( 6 * grid_square_length ) - ( ship_height * 0.5 ) ), "ship" );
	sprite.anchor.set( 0.5 );
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
		sprite.y -= ( ( sprite.y - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		sprite.angle = 270;
		updateCamera( ( sprite.x - ( grid_square_length / 2 ) ), ( sprite.y - ( grid_square_length / 2 ) ) );
	}, this );

	// down
	game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => {
		sprite.y += ( ( sprite.y + grid_square_length ) > game_height_pixels ) ? 0 : grid_square_length;
		sprite.angle = 90;
		updateCamera( ( sprite.x - ( grid_square_length / 2 ) ), ( sprite.y - ( grid_square_length / 2 ) ) );
	}, this );

	// right
	game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => {
		sprite.x += ( ( sprite.x + grid_square_length ) > game_width_pixels ) ? 0 : grid_square_length;
		sprite.angle = 0;
		updateCamera( ( sprite.x - ( grid_square_length / 2 ) ), ( sprite.y - ( grid_square_length / 2 ) ) );
	}, this );

	// left
	game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => {
		sprite.x -= ( ( sprite.x - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		sprite.angle = 180;
		updateCamera( ( sprite.x - ( grid_square_length / 2 ) ), ( sprite.y - ( grid_square_length / 2 ) ) );
	}, this );
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

function update() {}


function render() {}
