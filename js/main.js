var game = new Phaser.Game(400, 600, Phaser.AUTO, 'game-container');
var bird, cursors, pipes, isGameOver = false, floor, score, birdChangeTimer;
var coins, finishLine,birdInterval;
var numberOfPipes = 40;
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
		this.stage.backgroundColor = '#3BB9FF';
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.setBounds(0, 0, 400, 600);
		bird = game.add.sprite(50, 300, 'bird_2');
		bird.scale.x = 2;
		bird.scale.y = 2;
		bird.anchor.set(0.5);
		this.physics.enable(bird, Phaser.Physics.ARCADE);
		bird.body.collideWorldBounds = true;
		bird.body.drag.y = 450;
		bird.body.mass = 0;
		this.physics.arcade.gravity.y = 1700;
		this.createPipes();
		this.createFloor();
		this.createFinishLine();
		score = this.add.text(185, 40, '0', {
			font : '45px Arial Bold',
			fill : '#fff',
			align : 'center'
		});
		score.anchor.setTo(0.5, 0);
		var key = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		key.onDown.add(function(key) {
			if (isGameOver == false) {
				bird.body.velocity.y = -500;
				bird.loadTexture('bird_3', 0);
				clearTimeout(birdChangeTimer);
				birdChangeTimer = setTimeout(function() {
					bird.loadTexture('bird_1', 0);
				}, 200);
			}

		}, this);

	},

	update : function() {

		//console.log(bird.body.position.x);

		this.physics.arcade.collide(bird, pipes, this.hitPipes, null, this);
		this.physics.arcade.collide(bird, floor, this.hitPipes, null, this);
		this.physics.arcade.collide(bird, coins, this.hitCoin, null, this);
		this.physics.arcade.collide(bird, finishLine, this.finishGame, null, this);
		
		

	},

	createFloor : function() {
		floor = game.add.tileSprite(0, this.world.bounds.height - game.cache.getImage('pipe_end').height, 180 * numberOfPipes + 500, game.cache.getImage('pipe_end').height, 'pipe_end');
		this.physics.enable(floor, Phaser.Physics.ARCADE);
		floor.enableBody = true;
		floor.body.immovable = true;
		floor.body.allowGravity = false;
		floor.body.velocity.x = -150;

	},
	createFinishLine : function() {
		finishLine = game.add.tileSprite(180 * numberOfPipes + 500, 0, game.cache.getImage('pipe_end').height, 600, 'pipe_end');
		this.physics.enable(finishLine, Phaser.Physics.ARCADE);
		finishLine.enableBody = true;
		finishLine.body.immovable = true;
		finishLine.body.allowGravity = false;
		finishLine.body.velocity.x = -150;

	},

	hitPipes : function() {
		bird.body.velocity.x = 0;
		bird.body.velocity.y = 0;
		this.physics.arcade.gravity.y = 0;
		isGameOver = true;
		game.paused = true;
		game.stage.backgroundColor = '#FAC5C9';
		bird.loadTexture('bird_4', 0);
		clearTimeout(birdChangeTimer);
		setTimeout(function() {

			this.game.state.start('main');
			game.paused = false;
			isGameOver = false;
		}, 1000);

	},
	finishGame : function() {
		bird.body.velocity.x = 0;
		bird.body.velocity.y = 0;
		this.physics.arcade.gravity.y = 0;
		isGameOver = true;
		game.paused = true;
		game.stage.backgroundColor = '#00FF00';
		score.text = score.text + '\n YOU WIN';
		setTimeout(function() {
			this.game.state.start('main');
			game.paused = false;
			isGameOver = false;
		}, 4000);
	},

	hitCoin : function(b, c) {
		score.text = (parseInt(score.text) + 1);
		c.kill();

	},

	createPipes : function() {
		pipes = game.add.group();
		pipes.enableBody = true;
		pipes.physicsBodyType = Phaser.Physics.ARCADE;

		coins = game.add.group();
		coins.enableBody = true;
		coins.physicsBodyType = Phaser.Physics.ARCADE;

		for ( i = 0; i < numberOfPipes; i++) {
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

		coin = coins.create(positionX, (height * 16) + 30);
		coin.scale.x = 6;
		coin.scale.y = 6;

		coin.body.mass = 0;
		coin.body.immovable = false;
		coin.body.checkCollision = false;
		coin.body.allowGravity = false;
		coin.body.velocity.x = -150;

	}
};

var mainMenu = {
	
	
	preload: function() {
		this.load.image('bird_2', 'assets/img/bird_2.png');
		this.load.image('bird_3', 'assets/img/bird_3.png');
	},
	create: function() {
		this.stage.backgroundColor = '#3BB9FF';
		
		var menuText,flipBool = true;
		menuText = this.add.text(200, 100, '0', {
			font : '38px Helvetica Bold',
			fill : '#e34e46',
			align : 'center'
		});
		
		menuText.anchor.set(0.5,0);
		menuText.text = "Flappy Bird";
		
		
		bird = game.add.sprite(200, 200, 'bird_2');
		bird.scale.x = 4;
		bird.scale.y = 4;
		bird.anchor.set(0.5);
		
		
		menuText = this.add.text(200, 250, '0', {
			font : '24px Arial Bold',
			fill : '#fff',
			align : 'center'
		});
		
		menuText.anchor.set(0.5,0);
		menuText.text = "Press Space to flap wings.\n Avoid the pipes.";
		
		
		menuText = this.add.text(200, 400, '0', {
			font : '36px Arial Bold',
			fill : '#fff',
			align : 'center'
		});
		
		menuText.anchor.set(0.5,0);
		menuText.text = "Press Space to start.";
		
		birdInterval = setInterval(function(){
			if(flipBool){
				bird.loadTexture('bird_3',0);
			} else {
				bird.loadTexture('bird_2',0);
			}
			flipBool = !flipBool;
		},200);
		
		
		var key = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		key.onDown.add(function(key) {
			clearInterval(birdInterval);
			game.state.start('main');
		}, this);
	}
};

game.state.add('main', gameState);
game.state.add('menu', mainMenu);
game.state.start('menu');
