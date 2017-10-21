const viewport_width = 19;
const viewport_height = 11;
const grid_width = 200;
const grid_height = 200;
const grid_square_length = 50;
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
	for ( let x = 0; x < grid_width; x++ ) {
		for ( let y = 0; y < grid_width; y++ ) {
			game.add.sprite( ( x * grid_square_length ), ( y * grid_square_length ), "grid" );
		}
	}
}

function addPlanets() {
	game.add.sprite( ( 1 * grid_square_length ), ( 5 * grid_square_length ), "planet_a" );
	game.add.sprite( ( 17 * grid_square_length ), ( 5 * grid_square_length ), "planet_b" );
}

function addShip() {
	sprite = game.add.sprite( ( ( 2 * grid_square_length ) - ( ship_width * 0.5 ) ), ( ( 6 * grid_square_length ) - ( ship_height * 0.5 ) ), "ship" );
	sprite.anchor.set( 0.5 );
	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.body.drag.set( 100 );
	sprite.body.maxVelocity.set( 200 );
}

function addControls() {

	// up
	game.input.keyboard.addKey( Phaser.Keyboard.UP ).onDown.add( () => {
		sprite.y -= ( ( sprite.y - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		sprite.angle = 270;
	}, this );

	// down
	game.input.keyboard.addKey( Phaser.Keyboard.DOWN ).onDown.add( () => {
		sprite.y += ( ( sprite.y + grid_square_length ) > ( grid_height * grid_square_length ) ) ? 0 : grid_square_length;
		sprite.angle = 90;
	}, this );

	// right
	game.input.keyboard.addKey( Phaser.Keyboard.RIGHT ).onDown.add( () => {
		sprite.x += ( ( sprite.x + grid_square_length ) > ( grid_width * grid_square_length ) ) ? 0 : grid_square_length;
		sprite.angle = 0;
	}, this );

	// left
	game.input.keyboard.addKey( Phaser.Keyboard.LEFT ).onDown.add( () => {
		sprite.x -= ( ( sprite.x - grid_square_length ) < 0 ) ? 0 : grid_square_length;
		sprite.angle = 180;
	}, this );
}

function create() {

	game.world.resize( (grid_width * 400), (grid_height * 400) );

	//  This will run in Canvas mode, so let"s gain a little speed and display
	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;

	//  We need arcade physics
	game.physics.startSystem( Phaser.Physics.ARCADE );

	//  A spacey background
	game.add.tileSprite( 0, 0, game.width, game.height, "space" );

	addGrid();
	addPlanets();
	addShip();
	addControls();

}

function update() {}


function render() {}
