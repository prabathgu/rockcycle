var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1405,
        height: 748
    },
    scene: {
        preload: preload,
        create: create,
        extend: {
        }
    }
};

var game = new Phaser.Game(config);

const rocks = ['sandstone','halite','quartzite','pumice','limestone',
               'granite','obsidian','marble','gneiss'];

function preload () {
    this.load.image('background', 'background.png');
    
    rocks.forEach(rock => {
        console.log(rock);
        this.load.image(rock, rock + '.png');
    })
}

function create () {
    let { width, height } = this.sys.game.canvas;
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#ffffff");
    this.bg = this.add.image(width/2, height/2, 'background');
    this.bg.displayWidth = 1000;
    this.bg.displayHeight = height;

    let yStep = height / 5;
    let x = 0, y = 0;
    rocks.forEach(rock => {
        let image = this.add.sprite(x, y, rock).setOrigin(0, 0).setInteractive();
        this.input.setDraggable(image);

        y += yStep;
        if (y >= height) {
            y = 0;
            x = width - 200;
        }
    });

    //  The pointer has to move 16 pixels before it's considered as a drag
    this.input.dragDistanceThreshold = 16;

    this.input.on('dragstart', function (pointer, gameObject) {
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject) {
    });
}

