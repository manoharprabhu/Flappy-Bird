var game = new Phaser.Game(400, 600, Phaser.AUTO, 'game-container');
var bird, cursors, pipes, isGameOver = false,floor;
;

var gameState = {

	preload : function() {
		this.load.image('bird_2', 'assets/img/bird_2.png');
		this.load.image('bird_1', 'assets/img/bird_1.png');
		this.load.image('bird_3', 'assets/img/bird_3.png');
		this.load.image('pipe_end', 'assets/img/pipe_end.png');
		this.load.image('pipe', 'assets/img/pipe.png');
	},

	create : function() {
		game.stage.backgroundColor = '#3BB9FF';
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.setBounds(0, 0, 20000, 600);
		bird = game.add.sprite(150, 300, 'bird_2');
		bird.scale.x = 2;
		bird.scale.y = 2;
		bird.anchor.set(0.5);
		this.physics.enable(bird, Phaser.Physics.ARCADE);
		bird.body.collideWorldBounds = true;
		bird.body.velocity.x = 100;
		bird.body.allowRotation = true;
		this.physics.arcade.gravity.y = 500;
		this.camera.follow(bird);
		this.createPipes();
		
		floor = game.add.tileSprite(0, this.world.bounds.height-game.cache.getImage('pipe_end').height, this.world.bounds.width, game.cache.getImage('pipe_end').height, 'pipe_end');
		this.physics.enable(floor,Phaser.Physics.ARCADE);
		floor.enableBody = true;
			floor.body.immovable = true;
			floor.body.allowGravity = false;
	},

	update : function() {
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !isGameOver) {
			bird.body.velocity.y = -200;
			bird.loadTexture('bird_3',0);
			setTimeout(function(){bird.loadTexture('bird_2',0);},500);
		}
		
		if(bird.body.velocity.y > 0){
			bird.loadTexture('bird_1',0);
		}
		
		this.physics.arcade.collide(bird, pipes, this.hitPipes, null, this);
		this.physics.arcade.collide(bird, floor, this.hitPipes, null, this);
		
	},

	hitPipes : function() {
		bird.body.velocity.x = 0;
		bird.body.velocity.y = 0;
		this.physics.arcade.gravity.y = 0;
		isGameOver = true;
		setTimeout(function() {
			this.game.state.start('main');
			isGameOver = false;
		}, 1000);

	},

	createPipes : function() {
		pipes = game.add.group();
		pipes.enableBody = true;
		pipes.physicsBodyType = Phaser.Physics.ARCADE;

		for ( i = 0; i < 50; i++) {
			var height = Math.floor((Math.random() * 10) + 20);
			this.createPipeSystemAt((i * 210) + 500, height);
		}
	},

	createPipeSystemAt : function(positionX, height) {
		var topPipe, bottomPipe;
		for ( loopI = 0; loopI < height; loopI++) {
			if (loopI < height - 1) {
				topPipe = pipes.create(positionX, (12 * loopI), 'pipe');
			} else {
				topPipe = pipes.create(positionX - 2, (12 * loopI), 'pipe_end');
			}
			topPipe.scale.x = 2;
			topPipe.body.immovable = true;
			topPipe.body.allowGravity = false;
		}

		height = 43 - height;
		for ( loopI = 0; loopI < height; loopI++) {
			if (loopI < height - 1) {
				bottomPipe = pipes.create(positionX, 600 - (12 * loopI), 'pipe');

			} else {
				bottomPipe = pipes.create(positionX - 2, 600 - (12 * loopI), 'pipe_end');
			}
			bottomPipe.scale.x = 2;
			bottomPipe.body.immovable = true;
			bottomPipe.body.allowGravity = false;
		}

	}
};

game.state.add('main', gameState);
game.state.start('main');
