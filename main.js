/**
* @author : Albi Zeka
*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

    function preload () {
    	game.load.image('sky', 'assets/sky.png');
    	game.load.image('ground', 'assets/platform.png');
    	game.load.image('star', 'assets/star.png');
        game.load.image('bullet', 'assets/aqua_ball.png');
    	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    }

    var stars;
    var score = 0;
    var scoreText;

    var thNature = false;

    //for bullets
    var bullets;

    var fireRate = 100;
    var nextFire = 0;

    function create () {

        // Adding the score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    	// enable arcade physics to game
    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	// add of background
    	game.add.sprite(0, 0, 'sky');

    	// platforms
    	platforms = game.add.group();

        // Stars
        stars = game.add.group();

        stars.enableBody = true;

    	//  We will enable physics for any object that is created in this group
    	platforms.enableBody = true;

    	// Here we create the ground
    	var ground = platforms.create(0, game.world.height - 64, 'ground');

    	// Scale to fit the width of the game
    	ground.scale.setTo(2,2);

    	// This stops it when u falling away when you jump
    	ground.body.immovable = true;

    	//Let's create 2 ledges
    	var ledge = platforms.create(400, 400, 'ground');

    	ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;

        /* ============================================================== */
        // Now we're creating the player
         player = game.add.sprite(32, game.world.height - 150, 'dude');

         //We need to enable physics to player
         game.physics.arcade.enable(player);

         //  Player physics properties. Give the little guy a slight bounce.
         player.body.bounce.y = 0.2;
         player.body.gravity.y = 300;
         player.body.collideWorldBounds = true;

         //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        //Player controles
        cursors = game.input.keyboard.createCursorKeys();

        // We'll create 12 stars
        for (var i=0; i<12; i++) {

            // Create a star inside of the stars group
            var star = stars.create(i * 70, 0, 'star');

            // Let gravity do its things
            star.body.gravity.y = 6;

            //  This just gives each star a slightly random bound value
            star.body.bounce.y = 0.7 + Math.random() * 0.2; 
        }


        // CREATING BULLETS
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
    }

    function update () {

        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        game.physics.arcade.overlap(bullets, stars, shootStar, null, this);

    	//  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);

        //	reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) 
        {
        	//Move to the left
        	player.body.velocity.x = -150;

        	player.animations.play('left');
        }
        else if (cursors.right.isDown) 
        {
        	// Move player to right
        	player.body.velocity.x = 150;

        	player.animations.play('right');
        }
        else 
        {
        	//Stand still
        	player.animations.stop();

        	player.frame = 4;
        }

        // Allow the player to jump if they're touching the ground
        if (cursors.up.isDown && player.body.touching.down) 
        {
        	player.body.velocity.y = -350;
        }

        // Shoot
        if (game.input.activePointer.isDown) 
        {
            fire();
        }
    }

    function collectStar (player, star) {

        // Removes the star from the screen
        star.kill();

        // Add and update score
        score += 10;
        scoreText.text = 'Score'+ score;
    }

    function shootStar (bullets, star) {
        star.kill();

        score += 10;
        scoreText.text = 'Scopre'+ score;
    }

    function fire() {
        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstDead();

            bullet.reset(player.x - 8, player.y - 8);

            game.physics.arcade.moveToPointer(bullet, 300);
        }
}