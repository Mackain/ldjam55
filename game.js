const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
  })

  let platforms

function preload () {
    game.load.image('wiz1', './assets/wiz1.png')
    game.load.image('wiz2', './assets/wiz2.png')
    game.load.image('wiz_cast1', './assets/wiz_cast1.png')
    game.load.image('wiz_cast2', './assets/wiz_cast2.png')
    game.load.image('wiz_manual', './assets/wiz_manual.png')
    game.load.image('wall_tile', './assets/wall_tile.png')
}
function create () {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.add.sprite(0, 0, 'wall_tile')

    // platforms = game.add.group()
    // platforms.enableBody = true

    // const ground = platforms.create(0, game.world.height - 64, 'ground')
    // ground.scale.setTo(2, 2)
    // ground.body.immovable = true

    // let ledge = platforms.create(400, 450, 'ground')
    // ledge.body.immovable = true
    // ledge = platforms.create(-75, 350, 'ground')
    // ledge.body.immovable = true
}

function update () {}