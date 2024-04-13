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
let isCasting = false
let isCasted = false
let speed = 2
let castingRampSize = 0
let score = 0;
let scoreText;
let castingRampText

let platforms

// Preload function to load game assets
function preload() {
    // platforms = game.add.group()

    // Load the wizard image
    this.load.image('wizard1', './assets/wiz1.png');
    this.load.image('wizard2', './assets/wiz2.png');
    this.load.image('wizard_cast1', './assets/wiz_cast1.png');
    this.load.image('wizard_cast2', './assets/wiz_cast2.png');
    this.load.image('wizard_manual', './assets/wiz_manual.png');
    this.load.image('wall_tile', './assets/wall_tile.png');
    this.load.image('foreground', './assets/foreground.png');
    this.load.image('floor', './assets/floor.png');
    this.load.image('ramp_sum1', './assets/ramp_summoning1.png');
    this.load.image('ramp_sum2', './assets/ramp_summoning2.png');
    this.load.image('ramp', './assets/ramp_solid.png');
}

// Create function to set up the game scene
function create() {
    // Add the wizard sprite to the center of the screen
    invisibleFloor = this.physics.add.staticSprite(400, config.height - 100, 'floor')
    this.add.sprite(400, 300, 'foreground')
    this.anims.create({
        key: 'wizard_anim',
        frames: [{key: 'wizard1'}, {key: 'wizard2'}],
        frameRate: 12,
        repeat: -1
    })
    this.anims.create({
        key: 'casting_anim',
        frames: [{key: 'wizard_cast1'}, {key: 'wizard_cast2'}],
        frameRate: 12,
        repeat: -1
    })
    this.anims.create({
        key: 'summon_ramp_anim',
        frames: [{key: 'ramp_sum1'}, {key: 'ramp_sum2'}],
        frameRate: 24,
        repeat: -1
    })
    
    wizard = this.physics.add.sprite(200, 100, 'wizard1')
    wizard.anims.play('wizard_anim')
    
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    spawning_ramp = this.add.sprite(400, 100, 'ramp_sum1');
    spawning_ramp.anims.play('summon_ramp_anim')
    spawning_ramp.setVisible(false);
    ramp = this.add.sprite(400, 100, 'ramp');
    ramp.setVisible(false);


    // Create a new sprite group to hold the sprites
    spriteGroup = this.physics.add.group();
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    castingRampText = this.add.text(16, 45, 'Size: 0', { fontSize: '32px', fill: '#fff' });
}

// Update function called every frame
function update() {
    // Add additional game logic here
    this.physics.world.collide(wizard, invisibleFloor);
    
    if (spaceKey.isDown) {
        if (!isCasting){
            isCasting = true
            wizard.anims.play('casting_anim')
        }
        castingRampSize++
    } else {
        if (isCasting){
            isCasting = false
            wizard.anims.play('wizard_anim')
            spawning_ramp.setVisible(false);
        }
    }

    if (isCasting){
        isCasted = true;
        spawning_ramp.x = wizard.x + 150
        spawning_ramp.y = wizard.y
        spawning_ramp.setVisible(true);
    } else if (isCasted){
        ramp.x = spawning_ramp.x
        ramp.y = spawning_ramp.y
        ramp.setScale(castingRampSize * 0.01)
        ramp.setVisible(true)
        isCasted = false
        castingRampSize = 0
    }

    ramp.x -= speed
    scoreText.setText('Score: ' + score);
    castingRampText.setText('Size: ' + castingRampSize);
    spawning_ramp.setScale(castingRampSize * 0.01)
    

    // if (Phaser.Input.Keyboard.isUp(spaceKey)) {
    //     // Create a new sprite at a random position
    //     let newX = spawning_ramp.x;
    //     let newY = spawning_ramp.y
    // }

}
