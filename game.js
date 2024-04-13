// Define configuration object for the game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 } // Set gravity to make the wizard fall down
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create a new Phaser game instance with the defined configuration
const game = new Phaser.Game(config);

// Declare variables
let wizard;

// Preload function to load game assets
function preload() {
    // Load the wizard image
    this.load.image('wizard', './assets/wiz1.png');
}

// Create function to set up the game scene
function create() {
    // Add the wizard sprite to the center of the screen
    wizard = this.physics.add.sprite(400, 100, 'wizard');
}

// Update function called every frame
function update() {
    // Add additional game logic here
}
