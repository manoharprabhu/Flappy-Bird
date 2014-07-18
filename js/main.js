var game = new Phaser.Game(400, 600, Phaser.AUTO, 'game-container');
var bird, cursors, pipes, isGameOver = false, floor, score,birdChangeTimer;
var coin;
var gameState = {

	preload : function() {
		this.load.image('bird_2', 'assets/img/bird_2.png');
		this.load.image('bird_1', 'assets/img/bird_1.png');
		this.load.image('bird_3', 'assets/img/bird_3.png');
		this.load.image('bird_4', 'assets/img/bird_4.png');
		this.load.image('pipe_end', 'assets/img/pipe_end.png');
		this.load.image('pipe', 'assets/img/pipe.png');
	},

	create : function() {
		game.stage.backgroundColor = '#3BB9FF';
		game.time.advancedTiming = true;
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.setBounds(0, 0, 400, 600);
		bird = game.add.sprite(50, 300, 'bird_2');
		bird.scale.x = 2;
		bird.scale.y = 2;
		bird.anchor.set(0.5);
		this.physics.enable(bird, Phaser.Physics.ARCADE);
		bird.body.collideWorldBounds = true;
		bird.body.drag.y = 450;
		this.physics.arcade.gravity.y = 1700;
		this.createPipes();
		this.createFloor();

		score =  this.add.text(185, 40, '0', { font: '34px Arial Bold', fill: '#fff' });
		
		var key = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		key.onDown.add(function(key) {
			if (isGameOver == false) {
				bird.body.velocity.y = -500;
				bird.loadTexture('bird_3', 0);
				birdChangeTimer = setTimeout(function() {
					bird.loadTexture('bird_2', 0);
				}, 500);
			}

		}, this);

	},

	update : function() {
		
		//console.log(bird.body.position.x);

		this.physics.arcade.collide(bird, pipes, this.hitPipes, null, this);
		this.physics.arcade.collide(bird, floor, this.hitPipes, null, this);
		this.physics.arcade.collide(bird, coin, this.hitCoin, null, this);

	},

	createFloor : function() {
		floor = game.add.tileSprite(0, this.world.bounds.height - game.cache.getImage('pipe_end').height, this.world.bounds.width * 50, game.cache.getImage('pipe_end').height, 'pipe_end');
		this.physics.enable(floor, Phaser.Physics.ARCADE);
		floor.enableBody = true;
		floor.body.immovable = true;
		floor.body.allowGravity = false;
		floor.body.velocity.x = -150;

	},

	hitPipes : function() {
		bird.body.velocity.x = 0;
		bird.body.velocity.y = 0;
		this.physics.arcade.gravity.y = 0;
		isGameOver = true;
		game.paused = true;
		game.stage.backgroundColor = '#FF4444';
		bird.loadTexture('bird_4', 0);
		clearTimeout(birdChangeTimer);
		setTimeout(function() {

			this.game.state.start('main');
			game.paused = false;
			isGameOver = false;
		}, 1000);

	},
	
	hitCoin: function(b,c){
		score.text = (parseInt(score.text) + 1);
		c.kill();

	},

	createPipes : function() {
		pipes = game.add.group();
		pipes.enableBody = true;
		pipes.physicsBodyType = Phaser.Physics.ARCADE;
		
		coin = game.add.group();
		coin.enableBody = true;
		coin.physicsBodyType = Phaser.Physics.ARCADE;
		

		for ( i = 0; i < 50; i++) {
			var height = Math.floor((Math.random() * 15 + 10));
			this.createPipeSystemAt((i * 180) + 500, height);
		}
	},

	createPipeSystemAt : function(positionX, height) {
		var topPipe, bottomPipe, cap;

		topPipe = pipes.create(positionX, 0, 'pipe');
		topPipe.scale.x = 2;
		topPipe.scale.y = height;
		topPipe.body.immovable = true;
		topPipe.body.allowGravity = false;
		topPipe.body.velocity.x = -150;

		bottomPipe = pipes.create(positionX, (height * 16) + 120, 'pipe');
		bottomPipe.scale.x = 2;
		bottomPipe.scale.y = 50 - height;
		bottomPipe.body.immovable = true;
		bottomPipe.body.allowGravity = false;
		bottomPipe.body.velocity.x = -150;

		cap = pipes.create(positionX - 2, height * 16, 'pipe_end');
		cap.scale.x = 2;
		cap.body.immovable = true;
		cap.body.allowGravity = false;
		cap.body.velocity.x = -150;

		cap = pipes.create(positionX - 2, (height * 16) + 120, 'pipe_end');
		cap.scale.x = 2;
		cap.body.immovable = true;
		cap.body.allowGravity = false;
		cap.body.velocity.x = -150;
		
		c = coin.create(positionX, (height * 16) + 30);
		c.scale.x = 6;
		c.scale.y = 6;
		
		c.body.mass = 0;
		c.body.immovable = false;
		c.body.checkCollision = false;
		c.body.allowGravity = false;
		c.body.velocity.x = -150;
		
		
	}
};

game.state.add('main', gameState);
game.state.start('main');
