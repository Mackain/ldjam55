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
    },scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
let isCasting = false;
let isCasted = false;
let speed = 4;
let castingRampSize = 0;
let rampSize = 0;
let score = 0;
let scoreText;
let framerate = 12;
let good_boxes;
let bad_boxes;
let whiping = false;
let whiped = false;
let boxMinTime = 2000;
let boxMaxTime = 4000;
let air = true;
let bumping = false;
let booted = true;
let game_over

let music
let splashMusic


// Preload function to load game assets
function preload() {
    // platforms = game.add.group()

    // Load the wizard image
    this.load.image('wizard1', './assets/wiz1.png');
    this.load.image('wizard2', './assets/wiz2.png');
    this.load.image('wizard_cast1', './assets/wiz_cast1.png');
    this.load.image('wizard_cast2', './assets/wiz_cast2.png');
    this.load.image('wizard_air_cast1', './assets/wiz_air_cast1.png');
    this.load.image('wizard_air_cast2', './assets/wiz_air_cast2.png');
    this.load.image('wizard_manual', './assets/wiz_manual.png');
    this.load.image('wizard_air1', './assets/wiz_air.png');
    this.load.image('wizard_air2', './assets/wiz_air2.png');
    this.load.image('wizard_whiping1', './assets/wiz_whiping1.png');
    this.load.image('wizard_whiping2', './assets/wiz_whiping2.png');
    this.load.image('wizard_whiped', './assets/wiz_whiped.png');
    this.load.image('wizard_bump1', './assets/wiz_bump1.png');
    this.load.image('wizard_bump2', './assets/wiz_bump2.png');
    this.load.image('wall_tile', './assets/wall_tile.png');
    this.load.image('foreground', './assets/foreground.png');
    this.load.image('floor', './assets/floor.png');
    this.load.image('ramp_sum1', './assets/ramp_summoning1.png');
    this.load.image('ramp_sum2', './assets/ramp_summoning2.png');
    this.load.image('ramp', './assets/ramp_solid.png');
    this.load.image('wiz_hitbox', './assets/wiz_hitbox.png');
    this.load.image('bad_box', './assets/bad.png');
    this.load.image('good_box', './assets/good.png');
    this.load.image('killer', './assets/killer.png');
    this.load.image('coin1', './assets/coin1.png');
    this.load.image('coin2', './assets/coin2.png');
    this.load.image('coin3', './assets/coin3.png');
    this.load.image('coin4', './assets/coin4.png');
    this.load.image('splash', './assets/splash.png');
    this.load.image('game_over', './assets/game_over.png');
    this.load.image('fullscreenButton', './assets/fullscreen.png');

    // sound
    this.load.audio('backgroundMusic', './assets/game_music.mp3');
    this.load.audio('menuMusic', './assets/splash_music.mp3');
}

// Create function to set up the game scene
function create() {
    // Add the wizard sprite to the center of the screen
    invisibleFloor = this.physics.add.staticSprite(400, config.height - 100, 'floor');
    this.add.sprite(400, 300, 'foreground');
    this.anims.create({
        key: 'wizard_anim',
        frames: [{key: 'wizard1'}, {key: 'wizard2'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'casting_anim',
        frames: [{key: 'wizard_cast1'}, {key: 'wizard_cast2'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'air_casting_anim',
        frames: [{key: 'wizard_air_cast1'}, {key: 'wizard_air_cast2'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'air_anim',
        frames: [{key: 'wizard_air1'}, {key: 'wizard_air2'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'whiping_anim',
        frames: [{key: 'wizard_whiping1'}, {key: 'wizard_whiping2'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'bumb_anim',
        frames: [{key: 'wizard_bump1'}, {key: 'wizard_bump2'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'whiped_anim',
        frames: [{key: 'wizard_whiped'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'summon_ramp_anim',
        frames: [{key: 'ramp_sum1'}, {key: 'ramp_sum2'}],
        frameRate: framerate * 2,
        repeat: -1
    });

    this.anims.create({
        key: 'wizard_manual',
        frames: [{key: 'wizard_manual'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'good_box_anim',
        frames: [{key: 'coin1'}, {key: 'coin2'}, {key: 'coin3'}, {key: 'coin4'}],
        frameRate: framerate,
        repeat: -1
    });

    this.anims.create({
        key: 'bad_box_anim',
        frames: [{key: 'bad_box'}],
        frameRate: framerate,
        repeat: -1
    });

    good_box_timer = this.time.addEvent({
        delay: Phaser.Math.Between(boxMinTime, boxMaxTime), // Random delay between 2 to 4 seconds
        callback: spawn_good_box,
        callbackScope: this,
        loop: true
    });

    bad_box_timer = this.time.addEvent({
        delay: Phaser.Math.Between(boxMinTime, boxMaxTime), // Random delay between 2 to 4 seconds
        callback: spawn_bad_box,
        callbackScope: this,
        loop: true
    });

    wiz_hitbox = this.physics.add.sprite(100, 300, 'wiz_hitbox');
    wiz_hitbox.setOrigin(0, 1);
    wiz_hitbox.setVisible = false

    wizard = this.add.sprite(100, 300, 'wizard1');
    wizard.anims.play('wizard_anim');
    wizard.setOrigin(0, 1);

    spawning_ramp = this.add.sprite(400, 100, 'ramp_sum1');
    spawning_ramp.anims.play('summon_ramp_anim');
    spawning_ramp.setVisible(false);
    spawning_ramp.setOrigin(0, 1);
    
    ramp = this.physics.add.sprite(-400, 100, 'ramp');
    ramp.body.setAllowGravity(false);
    ramp.setVisible(false);
    ramp.setOrigin(0, 1);

    good_boxes = this.physics.add.group();

    bad_boxes = this.physics.add.group();

    killer = this.physics.add.sprite(-130, 0, 'killer'); //flytta till tyo x = -200 eller nått sen
    killer.setOrigin(0, 0);
    killer.body.setAllowGravity(false);


    
    // Create a new sprite group to hold the sprites
    spriteGroup = this.physics.add.group(); //gammal skit?
    scoreText = this.add.text(16, 16, 'Coin: 0', { fontSize: '32px', fill: '#fff' });

    this.physics.add.overlap(wiz_hitbox, ramp, onWizRampCollision);

    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    // Add the fullscreen button to the upper right corner
    fullscreenButton = this.add.sprite(config.width - 20, 16, 'fullscreenButton').setInteractive();
    fullscreenButton.setOrigin(1, 0); // Set origin to upper right corner

    // Add pointer down event to the button
    fullscreenButton.on('pointerdown', function () {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }, this);
    



    

    // Add background music
    music = this.sound.add('menuMusic');
    music.play({ loop: true });
}

function onWizRampCollision() {
    // This function will be called when sprite1 and sprite2 collide
    if(!whiping) {
        // wiz height over ramp = number of pizels ramp is left of wiz!!!
        if(wiz_hitbox.y > ramp.y - (wiz_hitbox.x + wiz_hitbox.width - ramp.x) + 20) {
            wiz_hitbox.setVelocityY(0);
            wiz_hitbox.setAccelerationY(0);
            //suck my dick Pythagoras!
            wiz_hitbox.y = ramp.y - (wiz_hitbox.x + wiz_hitbox.width - ramp.x) + 20
            wizard.anims.play('wizard_manual')
        }      
    }
}

function onWizGoodBoxCollision(player, good_box) {
    var good_box_index = good_boxes.getChildren().indexOf(good_box);
    let this_box = good_boxes.children.entries[good_box_index];
    this_box .destroy();
    score++;
}

function onWizBadBoxCollision(player, bad_box) {
    if(!whiping){
        whiping = true;
        wizard.anims.play('whiping_anim');
        wiz_hitbox.setVelocityY(-100);
    }
}

function onKillerGoodBoxCollision(player, good_box) {
    var good_box_index = good_boxes.getChildren().indexOf(good_box);
    let this_box = good_boxes.children.entries[good_box_index];
    this_box .destroy();
}

function onKillerBadBoxCollision(player, bad_box) {
    var bad_box_index = bad_boxes.getChildren().indexOf(bad_box);
    let this_box = bad_boxes.children.entries[bad_box_index];
    this_box .destroy();
}

function onKillerWizBoxCollision(player) {
    game_over = this.physics.add.sprite(0, 0, 'game_over');
    game_over.setOrigin(0, 0);
    game_over.body.setAllowGravity(false);
    music.stop();
    game.pause();
}

function touchFloor() {
    if (!whiping && (wizard.anims.currentAnim.key  == "air_anim" || bumping)) {
        bumping = false;
        wizard.anims.play('wizard_anim');
    }

    if (whiping) {
        whiped = true;
        wizard.anims.play('whiped_anim');
    }
}

function spawn_good_box() {
    var good_box = good_boxes.create(config.width+100, Phaser.Math.Between(155, config.height-155), 'good_box');
    good_box.anims.play('good_box_anim', true);
    good_box.body.setAllowGravity(false);
    good_box.setImmovable(true);
    good_box_timer.delay = Phaser.Math.Between(boxMinTime, boxMaxTime);
}

function spawn_bad_box() {
    var bad_box = bad_boxes.create(config.width+100, config.height-155, 'bad_box');
    bad_box.anims.play('bad_box_anim', true);
    bad_box.body.setAllowGravity(false);;
    bad_box.setImmovable(true);
    bad_box_timer.delay = Phaser.Math.Between(boxMinTime, boxMaxTime);
}

// Update function called every frame
function update() {

    // splash screen and pause if started
    if (booted)
    {
        booted = false;
        splash = this.physics.add.sprite(0, 0, 'splash');
        splash.setOrigin(0, 0);
        splash.body.setAllowGravity(false);
        game.pause();


        // Add the fullscreen button to the upper right corner
        fullscreenButton = this.add.sprite(config.width - 20, 16, 'fullscreenButton').setInteractive();
        fullscreenButton.setOrigin(1, 0); // Set origin to upper right corner

        // Add pointer down event to the button
        fullscreenButton.on('pointerdown', function () {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        }, this);
    }


    // Add additional game logic here
    this.physics.world.collide(killer, good_boxes, onKillerGoodBoxCollision, null, this);
    this.physics.world.collide(killer, bad_boxes, onKillerBadBoxCollision, null, this);
    this.physics.world.collide(killer, wiz_hitbox, onKillerWizBoxCollision, null, this);
    this.physics.world.collide(wiz_hitbox, invisibleFloor, touchFloor);
    this.physics.world.collide(wiz_hitbox, good_boxes, onWizGoodBoxCollision, null, this);
    this.physics.world.collide(wiz_hitbox, bad_boxes, onWizBadBoxCollision, null, this);
    if(whiped){
        wiz_hitbox.x -= speed;
    }
    wizard.x = wiz_hitbox.x;
    wizard.y = wiz_hitbox.y;
    air = !this.physics.overlap(wiz_hitbox, ramp) && wiz_hitbox.y != 480

    if(air && !whiping && !bumping && wizard.anims.currentAnim.key  != "air_anim" && wizard.anims.currentAnim.key  != "air_casting_anim") {
        if (wizard.anims.currentAnim.key  == "wizard_manual"){
            wiz_hitbox.y -= 15;
            wiz_hitbox.setVelocityY(-150);
        }
        wizard.anims.play('air_anim');
    }

    if (wiz_hitbox.y < 230 && !bumping) {
        wizard.anims.play('bumb_anim');
        bumping = true;
    }

    if (wiz_hitbox.y == 480 && wizard.anims.currentAnim.key  == "air_casting_anim"){
        wizard.anims.play('casting_anim');
    }
    
    if(!whiping && !bumping) {
        if (spaceKey.isDown) {
            if (!isCasting){
                isCasting = true;
                wizard.anims.play(air ? 'air_casting_anim' : 'casting_anim');
            }
            castingRampSize++;
        } else {
            if (isCasting){
                isCasting = false;
                wizard.anims.play('wizard_anim');
                spawning_ramp.setVisible(false);
            }
        }
        
        if (isCasting){
            isCasted = true;
            spawning_ramp.x = wizard.x + 150;
            spawning_ramp.y = wizard.y + 60;
            spawning_ramp.y = spawning_ramp.y > 480 ? 480 : spawning_ramp.y;
            spawning_ramp.setVisible(true);
        } else if (isCasted){
            if (castingRampSize > 20){
                ramp.x = spawning_ramp.x;
                ramp.y = spawning_ramp.y;
                rampSize = castingRampSize;
                ramp.setScale(castingRampSize * 0.01);
                ramp.setVisible(true);
            }
            isCasted = false;
            castingRampSize = 0;
        }
    }

    if(whiping){
        spawning_ramp.setVisible(false);
    }

    ramp.x -= speed;
    good_boxes.children.entries.forEach(x => x.x -= speed);
    bad_boxes.children.entries.forEach(x => x.x -= speed);
    scoreText.setText('Coin: ' + score);
    spawning_ramp.setScale(castingRampSize * 0.01);

}

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && game.isPaused) {
        resetGame();
    }
});

function resetGame() {

    //play music
    music.stop();
    music = game.sound.add('backgroundMusic');
    music.play({ loop: true });


    game.resume();

    splash.destroy();
    game_over.destroy();
    
    // töm arrayerna (inga boxar)
    good_boxes.children.entries.forEach(b => b.destroy());
    bad_boxes.children.entries.forEach(b => b.destroy());

    //flytta wiz. gör immovable och sen movable lol så han stannar
    wiz_hitbox.x = 100;
    wiz_hitbox.y = 300;
    wizard.anims.play('air_anim');
    whiped = false;
    whiping = false;

    // reset alla params
    score = 0;


}
