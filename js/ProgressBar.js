/**
 * 加载进度条对象
 * 继承Createjs.Container对象
 */
(function(){
    function ProgressBar(opts){
        this.Container_constructor();
        this.label = opts.label || 'Loading...';
        this.color = opts.color || '#fff';
        this.bgColor = opts.bgColor || '#000';
        this.percent = opts.percent || '0';
        this.init();
    }

    var progressBar = createjs.extend(ProgressBar,createjs.Container);

    progressBar.init = function(){
        var text = new createjs.Text(this.label + ' ' + this.percent + '%','20px Arial',this.color);
        text.name = 'text';
        text.Baseline = 'top';
        text.textAlign = 'center';

        var width = text.getMeasuredWidth() + 30;
        var height = text.getMeasuredHeight() + 20;

        text.x = width/2;
        text.y = 10;

        var background = new createjs.Shape();
        background.graphics.beginFill(this.bgColor).drawRect(0,0,width,height);
        this.addChild(background,text);
        this.setBounds(0,0,width,height);
    }

    ProgressBar.prototype.progress = function(percent,stage){
        var oldPercent = this.percent;
        if(oldPercent > percent) return false;
        var textShape = this.getChildByName('text');
        while(oldPercent < percent){
            oldPercent++;
            textShape.text = this.label + ' ' + oldPercent + '%';
            stage.update();
        }
        this.percent = percent;
    }

    window.ProgressBar = createjs.promote(ProgressBar,'Container');
})();