(function() {
    var SPEED = 4,
        COIN_STAY_X = 20,
        COIN_STAY_Y = 20,
        COIN_STAY_WIDTH = 30,
        COIN_STAY_HEIGHT = 30,
        COIN_SCALE_X = 0.08,
        COIN_SCALE_Y = 0.08;

    function Coin(image) {
        this.Shape_constructor();
        this.sizeX = COIN_SCALE_X;
        this.sizeY = COIN_SCALE_Y;
        this.image = image;
        this.isget = false;
        this.init();
    }

    var coin = createjs.extend(Coin, createjs.Shape);

    coin.init = function() {
        this.graphics.beginBitmapFill(this.image).drawRect(0, 0, this.image.width, this.image.height);
        this.setTransform(0, 0, COIN_SCALE_X, COIN_SCALE_Y);
        this.visible = false;
    }

    Coin.prototype.update = function() {
        if (this.isget) {
            this.sizeX = this.sizeX + (COIN_STAY_WIDTH / this.image.width - this.sizeX) * 0.1;
            this.sizeY = this.sizeY + (COIN_STAY_HEIGHT / this.image.height - this.sizeY) * 0.1;
            this.setTransform(
                this.x + (COIN_STAY_X - this.x) * 0.1,
                this.y + (COIN_STAY_Y - this.y) * 0.1,
                this.sizeX,
                this.sizeY
            );

            if (Math.abs(this.x - COIN_STAY_X) < 0.5 && Math.abs(this.y - COIN_STAY_Y) < 0.5) {
                this.visible = false;
                this.isget = false;
                this.sizeX = COIN_SCALE_X;
                this.sizy = COIN_SCALE_Y;
                this.setTransform(0, 0, this.sizeX, this.sizeY);
            }
        } else {
            this.x -= SPEED;
            if (this.x < -this.image.width * COIN_SCALE_X) {
                this.visible = false;
            }
        }
    }

    Coin.prototype.size = function() {
        return {
            w: this.image.width * COIN_SCALE_X,
            h: this.image.height * COIN_STAY_Y
        }
    }

    window.Coin = createjs.promote(Coin,'Shape');
})();