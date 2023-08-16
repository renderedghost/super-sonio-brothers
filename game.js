// Constants for configuration values
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const JUMP_VELOCITY = -330;
const MOVE_VELOCITY = 160;

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Phaser Game instance
const game = new Phaser.Game(config);

// Preloading assets
function preload() {
    this.load.image('sky', 'path/to/sky.png');
    this.load.image('ground', 'path/to/ground.png');
    this.load.image('star', 'path/to/star.png');
    this.load.spritesheet('dude', 'path/to/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
}

// Creating the game scene
function create() {
    // Add the sky
    this.add.image(400, 300, 'sky');

    // Add the platforms as a static group
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Add the player
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Add collisions between player and platforms
    this.physics.add.collider(this.player, platforms);

    // Set up the keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create animations for the player
    createAnimations.call(this);
}

// Separate function to handle the creation of animations
function createAnimations() {
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'duck',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 11 }),
        frameRate: 20,
        repeat: -1
    });
}

// Function to handle user input and control the player
function handleInput() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-MOVE_VELOCITY);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(MOVE_VELOCITY);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(JUMP_VELOCITY);
    }

    if (this.cursors.down.isDown) {
        this.player.anims.play('duck', true);
    } else {
        if (this.player.anims.getCurrentKey() === 'duck') {
            this.player.anims.stop();
            this.player.setTexture('dude', 4);
        }
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.player.anims.play('attack', true);
    } else {
        if (this.player.anims.getCurrentKey() === 'attack') {
            this.player.anims.stop();
            this.player.setTexture('dude', 4);
        }
    }
}

// Updating the game scene
function update() {
    handleInput.call(this);
}