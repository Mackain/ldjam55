// Define configuration object for the game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

// Create a new Phaser game instance with the defined configuration
const game = new Phaser.Game(config);

// Preload function to load game assets
function preload() {
    // Load the wizard image
    this.load.image('wizard', './assets/wiz1.png');
}

// Create function to set up the game scene
function create() {
    // Add the wizard image to the center of the screen
    this.add.image(400, 300, 'wizard');
}