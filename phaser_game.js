
const rocks = ['sandstone','halite','quartzite','pumice','limestone',
               'granite','obsidian','marble','gneiss'];


function drawBubble(parent, x, y, width, height, color) {
    var bubble = parent.add.graphics({ x: x, y: y });

    //  Bubble shadow
    //bubble.fillStyle(0x222222, 0.5);
    //bubble.fillRoundedRect(6, 6, width, height, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(6, Phaser.Display.Color.ValueToColor(color).color, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, width, height, 16);
    bubble.fillRoundedRect(0, 0, width, height, 16);

    return bubble;
}
            
function createTextBubble(parent, x, y, text, fontSize, color, callback) {
    const textSettings = { fontFamily: 'Helvetica Neue', fontSize: fontSize, color: color, align: 'center' };
    const pad = 15;

    //infoBubble = drawBubble(x, y, width, height);
    let dummyContent = parent.add.text(0, 0, text, textSettings);
    let bounds = dummyContent.getBounds();
    dummyContent.destroy();

    let bubble = drawBubble(parent, x, y, bounds.width + pad * 2, bounds.height + pad * 2, color);
    let content = parent.add.text(x + pad, y + pad, text, textSettings);

    let shape = parent.add.rectangle(x, y, bounds.width + pad * 2, bounds.height + pad * 2).setOrigin(0,0);
    shape.setInteractive();
    shape.on('pointerdown', callback);

    return {bubble, content, shape};
}
               
class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    preload () {
        this.load.image('title', 'title.png');
    }

    create() {
        let { width, height } = this.sys.game.canvas;
        this.add.image(width/2, height/2, 'title');

        createTextBubble(this, 250, height - 75, ' Image Sources ', 15, '#AAAAAA', () => this.scene.start('image_sources'));
    
        createTextBubble(this, width / 2 - 150, height / 2 + 150, '  Click to Begin  ', 40, '#4585BF', () => this.scene.start('sort_page'));
    }
}
               
class ImageSources extends Phaser.Scene {
    constructor() {
        super('image_sources');
    }

    preload () {
        this.load.image('image_sources', 'image_sources.png');
    }

    create() {
        let { width, height } = this.sys.game.canvas;
        this.add.image(width/2, height/2, 'image_sources');

        createTextBubble(this, 270, height - 100, '  Back  ', 30, '#4585BF', () => this.scene.start('title'));
    }
}
               
class SortPage extends Phaser.Scene {
    constructor() {
        super('sort_page');
    }

    preload () {
        this.load.image('sort_page', 'sort_page.png');
        
        rocks.forEach(rock => {
            this.load.image(rock, rock + '.png');
        })
    }

    create() {
        let { width, height } = this.sys.game.canvas;
        this.add.image(width/2, height/2, 'sort_page');

        createTextBubble(this, width - 350, height - 100, '  Next  ', 30, '#4585BF', () => this.scene.start('game'));

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

        this.input.on('dragstart', function (pointer, gameObject) {});

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function (pointer, gameObject) {});    
    }
}

class Game extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload () {
        this.load.image('background', 'background.png');
    }

    create () {
        let { width, height } = this.sys.game.canvas;
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

        this.input.on('dragstart', function (pointer, gameObject) {});

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function (pointer, gameObject) {});

        let {bubble, content, shape} = createTextBubble(
            this, 20, height / 2 - 30,
            ' Read the rock formation descriptions. Then drag each rock to where you think it formed ',
            33, '#4585BF', () => {});
        
        let timer = this.time.delayedCall(5000, 
            function(bubble, content, shape) {
                if (bubble) {
                    bubble.destroy();
                    content.destroy();
                    shape.destroy();
                }
            },
            [bubble, content, shape], this);  // delay in ms
    }
}

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1405,
        height: 748
    },
    backgroundColor: '#ffffff',
    scene: [Title, ImageSources, SortPage, Game]
};

let game = new Phaser.Game(config);
