// Constants for configuration values
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const JUMP_VELOCITY = -330;
const MOVE_VELOCITY = 160;
const ANIM_KEYS = {
    LEFT: 'left',
    RIGHT: 'right',
    TURN: 'turn',
    DUCK: 'duck',
    ATTACK: 'attack'
};

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
        update: update,
        handleInput: handleInput,

        createSky: function () {
            this.add.image(400, 300, 'sky');
        },

        createPlatforms: function () {
            this.platforms = this.physics.add.staticGroup();
            this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
            this.platforms.create(600, 400, 'ground');
            this.platforms.create(50, 250, 'ground');
            this.platforms.create(750, 220, 'ground');
        },

        createPlayer: function () {
            this.player = this.physics.add.sprite(100, 450, 'dude');
            this.player.setBounce(0.2);
            this.player.setCollideWorldBounds(true);
        },

        setupCollisions: function () {
            this.physics.add.collider(this.player, this.platforms);
        },

        setupControls: function () {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }
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
    // Consider adding error handling for asset loading
}

function create() {
    this.createSky();
    this.createPlatforms();
    this.createPlayer();
    this.setupCollisions();
    this.setupControls();
    createAnimations.call(this);
}

function createAnimations() {
    this.anims.create({
        key: ANIM_KEYS.LEFT,
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: ANIM_KEYS.TURN,
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: ANIM_KEYS.RIGHT,
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: ANIM_KEYS.DUCK,
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: ANIM_KEYS.ATTACK,
        frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 11 }),
        frameRate: 20,
        repeat: -1
    });
}

function handleInput() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-MOVE_VELOCITY);
        this.player.anims.play(ANIM_KEYS.LEFT, true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(MOVE_VELOCITY);
        this.player.anims.play(ANIM_KEYS.RIGHT, true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play(ANIM_KEYS.TURN);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(JUMP_VELOCITY);
    }

    if (this.cursors.down.isDown) {
        this.player.anims.play(ANIM_KEYS.DUCK, true);
    } else {
        if (this.player.anims.getCurrentKey() === ANIM_KEYS.DUCK) {
            this.player.anims.stop();
            this.player.setTexture('dude', 4);
        }
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.player.anims.play(ANIM_KEYS.ATTACK, true);
    } else {
        if (this.player.anims.getCurrentKey() === ANIM_KEYS.ATTACK) {
            this.player.anims.stop();
            this.player.setTexture('dude', 4);
        }
    }
}

function update() {
    this.handleInput();
}