var fps = document.getElementById('showFPS'),
    countCoin = document.getElementById('coins');

var canvas,
    stage,
    CANVAS_W,
    CANVAS_H,
    loader;

var man,
    ground,
    sky;

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
        ],
        coinCode = [
            "--------##########----------------############-#--#---##############-----------------##########-#-#-#-#-#-#-#-##-------################-------------###",
            "--#--#-------####----------##----###-----####-#--#---####-#-#-#-######------####------#####-#-#-#-#-#-#-#-##-------################---############--###",
            "-------#--#-------####----------##----##--##############---------######------####------#####-#-#-#-#-#-#-#-##----------################-------------###"
        ]

    stage.addChild(progressBar);
    stage.update();
}

function handlerProgress(e) {
    var percent = e.progress * 100 | 0;
    progressBar.progress(percent, stage);
}

function handlerComplete(e) {
    console.log('manifest is load completed: ');
    var manImage = loader.getResult('man'),
        lowGround = loader.getResult('ground'),
        highGround = loader.getResult('high'),
        bgImage = loader.getResult('bg'),
        coins = loader.getResult('coin');

    // create sky
    var sky = new createjs.Shape();
    sky.graphics.beginFill(bgImage).drawRect(0, 0, CANVAS_W, CANVAS_H);
    sky.setTransform(0, 0, 1, CANVAS_W / bgImage.height);
    stage.addChild(sky);

    man = new Man(200, 326, manImage);

    // 该框为判定角色区域
    var kuang = new createjs.shape();
    kuang.graphics.beginStroke('rgba(255,0,0,0.5').drawRect(0, 0, man.size.w, man.picsize().h * 1.5);

    initMap(lowGround, highGround, coins);

    createjs.Ticker.timeingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
    createjs.addEventListener('tick', tick);

    window.addEventListener("keydown", function(event) {
        event = event || window.event;
        if (event.keyCode === 32 && man.jumpNum < man.jumpMax) {
            man.jump();
        }
    })

    window.addEventListener("touchstart", function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (man.jumpNum < man.jumpMax) {
            man.jump();
        }
    })
}

function initMap(lowGround, highGround, coins) {

}