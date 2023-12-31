import Phaser from "phaser";

export default class Game extends Phaser.Scene {
    init() {
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)

        this.leftScore = 0
        this.rightScore = 0

    }
    create() {
        this.physics.world.setBounds(-100, 0, 1000, 500)

        this.ball = this.add.circle(400, 250, 10, 0xffffff, 1)
        this.physics.add.existing(this.ball)
        this.ball.body.setBounce(1, 1)
        
        this.ball.body.setCollideWorldBounds(true, 1, 1)
        
        this.resetBall()
        
        this.paddleLeft = this.add.rectangle(50, 250, 30, 100, 0xffffff, 1)
        this.physics.add.existing(this.paddleLeft, true)
        
        
        this.paddleRight = this.add.rectangle(750, 250, 30, 100, 0xffffff, 1)
        this.physics.add.existing(this.paddleRight, true)
        
        
        this.physics.add.collider(this.paddleLeft, this.ball)
        this.physics.add.collider(this.paddleRight, this.ball)

        this.leftScoreLabel = this.add.text(300, 125, '0', {
            fontSize: 48,
        })
            .setOrigin(0.5,0.5)
            
        this.rightScoreLabel = this.add.text(500, 125,'0', {
            fontSize: 48,
        })
        .setOrigin(-0.5,0.5)
        
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    update() {
        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body = this.paddleLeft.body
        
        if (this.cursors.up.isDown) {
            this.paddleLeft.y -= 10
            body.updateFromGameObject()
        } else if (this.cursors.down.isDown) {
            this.paddleLeft.y += 10
            body.updateFromGameObject()
        }
        
        const diff = this.ball.y - this.paddleRight.y
        if (Math.abs(diff) < 10) {
            return
        }
        
        const aiSpeed = 3
        if (diff < 0) {
            // ball is above paddle
            this.paddleRightVelocity.y = -aiSpeed
            if (this.paddleRightVelocity.y < -10) {
                this.paddleRightVelocity.y = -10
            }
        } else if (diff > 0) {
            // ball is below paddle            
            this.paddleRightVelocity.y = aiSpeed
            if (this.paddleRightVelocity.y > 10) {
                this.paddleRightVelocity.y = 10
            }
        }
        
        this.paddleRight.y += this.paddleRightVelocity.y
        this.paddleRight.body.updateFromGameObject()
        
        if (this.ball.x < -30) {
            // scored on left side
            this.resetBall()
            this.IncrementRightScore()
        } else if (this.ball.x > 830) {
            // scored on right side
            this.resetBall()
            this.IncrementLeftScore()
        }
    }
    
    IncrementLeftScore() {
        this.leftScore += 1
        this.leftScoreLabel.text = this.leftScore
    }

    IncrementRightScore() {
        this.rightScore += 1
        this.rightScoreLabel.text = this.rightScore
    }

    resetBall() {
        this.ball.setPosition(400,250)
        const angle = Phaser.Math.Between(0, 360)
        const vec = this.physics.velocityFromAngle(angle, 350)

        this.ball.body.setVelocity(vec.x, vec.y)
    }
}