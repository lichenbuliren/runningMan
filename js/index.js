var fps = document.getElementById('showFPS'),
    countCoin = document.getElementById('coins');

var canvas,
    stage,
    CANVAS_W,
    CANVAS_H,
    loader;

var man,
    ground,
    sky,
    kuang;

var mapIndex = 0,       //地图序列
    Mix = 0,            //地图数组的索引
    allStones = [],     //存放所有的石头
    allCoins = [],      //所有金币
    lastStone = null;   //存放最后一个石头

var progressBar = new ProgressBar({
    label: 'Loading...',
    color: '#fff',
    bgColor: 'red'
});

init();

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = CANVAS_W = window.innerWidth;
    canvas.height = CANVAS_H = window.innerHeight;

    stage = new createjs.Stage(canvas);
    var progressBarBounds = progressBar.getBounds();
    progressBar.x = (CANVAS_W - progressBarBounds.width | 0) / 2;
    progressBar.y = (CANVAS_H - progressBarBounds.height | 0) / 2;

    var basePath = 'images/';
    var manifest = [{
        src: 'bg.png',
        id: 'bg'
    }, {
        src: 'coins.png',
        id: 'coins'
    }, {
        src: 'ground.png',
        id: 'ground'
    }, {
        src: 'high.jpg',
        id: 'high'
    }, {
        src: 'man.png',
        id: 'man'
    }];

    loader = new createjs.LoadQueue(false, basePath);
    loader.on('progress', handlerProgress);
    loader.on('complete', handlerComplete);
    loader.loadManifest(manifest);

    //地图数据，mapData为石头数据，coinCode为金币数据
    var mapData = [
        "AAAACBBAAACABBAAACAABBBAAAABAAAAAACABCABCABCAAAABBBBBBAAAAACAAAAAAAAAAAABBBBBBAAAAAACACACACACAAAABBBBAAAAACAAAAAAAAAAAABBBBBBAAAAAACACACACACAABBAAAAAAABBA",
        "AAAAAAAACAABAAAAAAAAAAAAAAABBBBBBCBBBBBBBBAAAAAAAAAAAAAAAAAAAAAAAAACACACACACACACACACACBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBCBCBCBCAAAAAAAAAAAAAAAAAA",
        "AAAAAAAACAABAAAAAAAAAAAACACACACACACACACABAABABABABABABABACBCBCBCBCBCBCBCBCBCBCBCBCBCBCBCABABACBCBCACACACACACACACACACACACACACACACACACACACACACAAAAAAAAAAAAAAAA"
    ];
    var coinCode = [
        "--------##########----------------############-#--#---##############-----------------##########-#-#-#-#-#-#-#-##-------################-------------###",
        "--#--#-------####----------##----###-----####-#--#---####-#-#-#-######------####------#####-#-#-#-#-#-#-#-##-------################---############--###",
        "-------#--#-------####----------##----##--##############---------######------####------#####-#-#-#-#-#-#-#-##----------################-------------###"
    ];
    stage.addChild(progressBar);
    stage.update();

    // 素材加载中
    function handlerProgress(e) {
        var percent = e.progress * 100 | 0;
        progressBar.progress(percent, stage);
    }

    //  素材加载完毕事件
    function handlerComplete(e) {
        var manImage = loader.getResult('man'),
            lowGround = loader.getResult('ground'),
            highGround = loader.getResult('high'),
            bgImage = loader.getResult('bg'),
            coins = loader.getResult('coins');
        // 创建天空背景图
        var sky = new createjs.Shape();
        sky.graphics.beginBitmapFill(bgImage).drawRect(0, 0, CANVAS_W, CANVAS_H);
        sky.setTransform(0, 0, 1, CANVAS_H / bgImage.height);
        stage.addChild(sky);

        man = new Man(200, 326, manImage);

        // 该框为判定角色区域
        kuang = new createjs.Shape();
        kuang.graphics.beginStroke('rgba(255,0,0,0.5').drawRect(0, 0, man.size.w, man.picsize().h * 1.5);

        initMap(lowGround, highGround, coins);

        createjs.Ticker.timeingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', tick);

        window.addEventListener("keydown", function(event) {
            event = event || window.event;
            if (event.keyCode === 32 && man.jumpNum < man.jumpMax) {
                man.jump();
            }
        });

        window.addEventListener("touchstart", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (man.jumpNum < man.jumpMax) {
                man.jump();
            }
        });
    }


    // 初始化地图
    function initMap(lowGround, highGround, coins) {
        allStones.length = 0;
        var stoneImage = {'A': lowGround,'B': highGround},
            kind = null;

        //  把需要用到的石头预先放入容器中准备好
        for (var i = 0; i < 30; i++) {
            switch(i) {
                case 0:
                    kind = 'A';
                    break;
                case 10:
                    kind = 'B';
                    break;
                case 30:
                    kind = 'C';
                    break;
                default:
                    kind = 'C';
                    break;
            }
            var st = new Stone(CANVAS_W,kind,stoneImage,CANVAS_H);
            allStones.push(st);
        }

        // 把需要用到的金币预先放入容器中
        for(var i=0;i < 10; i++){
            var coin = new Coin(coins);
            allCoins.push(coin);
        }

        // 随机地图序列，总共有三幅地图
        Mix = Math.floor(Math.random()*mapData.length);
        for(var i = 0; i < 8; i++){
            setStone(false);
        }

        for(var i=0;i<allStones.length;i++){
            stage.addChild(allStones[i]);
        }

        for(var i=0;i<allCoins.length;i++){
            stage.addChild(allCoins[i]);
        }
    }

    // 添加陆地石头
    function setStone(remove){
        var arg = mapData[Mix].charAt(mapIndex),
            coarg = coinCode[Mix].charAt(mapIndex),
            cc = null;

        // 显示金币
        if(coarg == '#'){
            for(var i = 0;i < allCoins.length; i++){
                if(!allCoins[i].visible){
                    cc = allStones[i];
                    cc.visible = true;
                    break;
                }
            }
        }

        for (var i = 0; i < allStones.length; i++) {
            if(!allStones[i].visible && allStones[i].kind == arg){
                var st = allStones[i];
                st.visible = true;
                st.x = lastStone === null ? 0:lastStone.x + lastStone.w;
                if(cc){
                    cc.x = lastStone === null ? allStones[i].w/2 - cc.size().w/2: lastStone.x + lastStone.w + allStones[i].w/2 - cc.size().w/2;
                    cc.y = arg === "C"? CANVAS_H - loader.getResult('high').height - 50: allStones[i].y - cc.size().h/2 - 50;
                }

                lastStone = st;
                break;
            }
        }

        mapIndex++;
        if(mapIndex >= mapData[Mix].length){
            Mix = Math.floor(Math.random()*mapData.length);
            mapIndex = 0;
        }
    }

    function tick(event){
        stage.update(event);
    }
}