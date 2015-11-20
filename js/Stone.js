(function(){
    var SPEED = 4;

    function Stone(x,kind,allImage,CANVAS_H){
        this.Shape_constructor();
        this.x = x;
        this.kind = kind;
        this.allImage = allImage;
        this.CANVAS_H = CANVAS_H;
        this.init();
    }

    var sp = createjs.extend(Stone,createjs.Shape);

    sp.init = function(){
        if(this.kind !== 'C'){
            this.h = this.allImage[this.kind].height;
            this.w = this.allImage[this.kind].width*2;
            this.y = this.CANVAS_H - this.h;
            this.graphics.beginBitmapFill(this.allImage[this.kind]).drawRect(0,0,this.w,this.h);
            this.setTransform(this.x,this.y,1,1);
        }else{
            this.h = -1000;
            this.w = 170;
            this.y = this.CANVAS_H - this.h;
            this.graphics.beginFill('#000').drawRect(0,0,this.w,this.h);
            this.setTransform(this.x,this.y,1,1);
        }
        this.visible = false;
        this.cache(0,0,this.w,this.h);
    }

    Stone.prototype.update = function(){
        this.x -= SPEED;
    }

    window.Stone = createjs.promote(Stone,'Shape');
})();