//定义常量
var Black = 1;
var White = 2;
var empty = 0;
var w = 80;
var h = 80;

var stone = new Array();
var curstone = Black;
var ctx = $("myCanvas").getContext('2d');
var whiteStone = $("whitestone");
var blcakStone = $("blackstone");
var board = $("board");
var info = $("info");
var message_txt = $("message_txt");

function $(name){
    return document.getElementById(name);
}

function init(){
    initLevel(); //初始化开始时的四个棋子
    showMoveInfo(); //显示移动信息
    $("myCanvas").addEventListener("mousedown",doMouseDown,false);
}

//初始化棋盘
function  initLevel(){
    var i,j;
    for(i=0;i<=8;i++){
        stone[i] = new Array();
        for (j=0;j<=8;j++){
            stone[i][j] = empty;
        }
    }

    stone [3][3] = White;
    stone [4][4] = White;
    stone [3][4] = Black;
    stone [4][3] = Black;

    DrawMap();

    message_txt.innerHTML = "轮到邵宇芳";
}

function DrawMap(){
    ctx.clearRect(0,0,720,720);
    ctx.drawImage(board, 0, 0, board.width, board.height);
    for(i = 0 ;i<stone.length; i++ ){
        for (j = 0; j<stone.length;j++){
            var pic;
            switch (stone[i][j]){
                case empty:
                    break;
                case Black:
                    pic = blcakStone;
                    ctx.drawImage(pic,w*j,h*i,pic.width,pic.height);
                    break;
                case White:
                    pic = whiteStone;
                    ctx.drawImage(pic,w*j,h*i,pic.width,pic.height);
                    break;
            }
        }
    }
}

function showMoveInfo(){
    if(curstone == Black){
        message_txt.innerHTML = "轮到邵宇芳";
    }else{
        message_txt.innerHTML = "轮到王一博";
    }
}

function doMouseDown(event){
    var x = event.pageX;
    var y = event.pageY;
    var canvas = event.target;
    var loc = getPointOnCanvas(canvas,x,y);
    clickStone(loc);
}

function getPointOnCanvas(canvas,x,y){
    var bbox = canvas.getBoundingClientRect();
    return {x: x-bbox.left*(canvas.width/bbox.width),y: y-bbox.top*(canvas.height/bbox.height)}
}

function clickStone(thisStone){
    var x1,y1;
    x1 = Math.round((thisStone.y - 40)/80);
    y1 = Math.round((thisStone.x - 40)/80);
    console.log(x1,y1);
    if(can_go(x1,y1)){
        stone[x1][y1] = curstone;
        changeStones(x1,y1);
        DrawMap();

    //判断对方是否有棋可下
        if(curstone==White&&checkNext(Black) ){
            curstone = Black;
            message_txt.innerHTML = "该黑棋走了";
        }else if(curstone==Black&&checkNext(White)){
            curstone = White;
                message_txt.innerHTML = "该白棋走了";
        }else if(checkNext(curstone)){
            message_txt.innerHTML = "对面无棋可走，请继续";
        }else{
            isLoseWin()
        }    
    }else{
        message_txt.innerHTML = "不能落子";
    }
}

//判断上下左右等八个方向可否落子
function can_go(x,y){
    if(checkDirect(x,y,-1,0)){
        return true;
    }
    if(checkDirect(x,y,-1,-1)){
        return true;
    }
    if(checkDirect(x,y,1,0)){
        return true;
    }
    if(checkDirect(x,y,1,1)){
        return true;
    }
    if(checkDirect(x,y,0,-1)){
        return true;
    }
    if(checkDirect(x,y,1,1)){
        return true;
    }
    if(checkDirect(x,y,0,1)){
        return true;
    }
    if(checkDirect(x,y,-1,1)){
        return true;
    }
    return false;
}

function checkDirect(x,y,dx,dy){
    var flag = false
    x = x+dx;
    y = y+dy;
    while(InBoard(x,y)&&!Ismychess(x,y)&&stone[x][y] != empty){
        x+=dx;
        y+=dy;
        flag = true; //形成了夹击之势
    }
    if(InBoard(x,y)&&Ismychess(x,y)&&flag){
        return true;
    }
    return false;
}
/**
 * 这个函数有问题呢
 * @param {} st 
 */
function checkNext(st){
    old = curstone;
    curstone = st;
    if(can_Num()>0){
        curstone = old ; 
        return true;
    }else{
        curstone = old;
        return false;
    }
}

function can_Num(){
    var i,j;
    var n = 0;
    for(i=0;i<=8;i++){
        for(j=0;j<=8;j++){
            if(stone[i][j]==empty&&can_go(i,j)){
                n+=1;
            }
        }
    }
    return n
}

function changeStones(x,y){
    if(checkDirect(x,y,-1,0)){
        DirectReverse(x,y,-1,0);
    }
    if(checkDirect(x,y,-1,-1)){
        DirectReverse(x,y,-1,-1);
    }
    if(checkDirect(x,y,1,0)){
        DirectReverse(x,y,1,0);
    }
    if(checkDirect(x,y,1,1)){
        DirectReverse(x,y,1,1);
    }
    if(checkDirect(x,y,0,-1)){
        DirectReverse(x,y,0,-1);
    }
    if(checkDirect(x,y,1,1)){
        DirectReverse(x,y,1,1);
    }
    if(checkDirect(x,y,0,1)){
        DirectReverse(x,y,0,1);
    }
    if(checkDirect(x,y,-1,1)){
        DirectReverse(x,y,-1,1);
    }
}

function DirectReverse(x1,y1,dx,dy){
    var flag = false
    x = x1+dx;
    y = y1+dy;
    while(InBoard(x,y)&&!Ismychess(x,y)&&stone[x][y] != empty){
        x+=dx;
        y+=dy;
        flag = true; //形成了夹击之势
    }
    if(InBoard(x,y)&&Ismychess(x,y)&&flag){
        do{
            x-=dx;
            y-=dy;
            if(x!=x1||y!=y1){
                change(x,y);
            }
        }while((x!=x1||y!=y1));
    }
}

function change(x,y){
    if(stone[x][y] == Black){
        stone[x][y] = White;
    }else{
        stone[x][y] = Black;
    }
}

function Ismychess(x,y){
    return stone[x][y]==curstone;
}

function InBoard(x,y){
    if(x>=0&&x<=8 && y>=0&&y<=8){
        return true;
    }
    return false;
}

function DoHelp(){
    var i,j;
    var n = 0;
    for(i=0;i<=8;i++){
        for(j=0;j<=8;j++){
            if(stone[i][j]==empty&&can_go(i,j)){
                n+=1;
                pic = info;
                ctx.drawImage(pic,w*j+20,h*i+20,pic.width,pic.height);
            }
        }
    }
}

function isLoseWin(){
    var whitenum = 0;
    var blacknum = 0;
    var n=0,x,y;
    for(i=0;i<=8;i++){
        for(j=0;j<=8;j++){
            if(stone[i][j]!=empty){
                n+=1;
               if(stone[i][j]==Black){
                   blacknum+=1;
               }else{
                   whitenum+=1;
               }
            }
        }
    }

    if(blacknum>whitenum){
        message_txt.innerHTML = "黑棋赢了！黑方:"+String(blacknum)+"白方: "+String(whitenum);
    }else{
        message_txt.innerHTML = "白棋赢了!黑方:"+String(blacknum)+"白方: "+String(whitenum);
    }
}