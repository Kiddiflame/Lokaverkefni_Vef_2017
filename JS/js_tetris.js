//skilgreina fyrst of fremst svæðið sem ég er að vinna í, þ
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
var gameState = true;
//var Hscore;

var Mbt = document.getElementById('Music_btn');  //Sækir í music takkann
var Sbt = document.getElementById('Start_btn'); //sækir start takkann
var playing = true; //nýti til að stilla music takkan

Mbt.addEventListener("click", function() { //ef playing er stillt á false, er það sett í true og tónlistinn byrjar, ef það er true, er slökkt á því og gert að false
    if (playing == true) 
    {
        pauseAudio();
        playing = false;
    }
    else if(playing == false)
    {
        playAudio();
        playing = true;
    }
}, false);  

//playAudio og pauseAudio eru smá föll til að keikja á tónlistina og slökkva á enni 
function playAudio()
{
document.getElementById("Music_track").play();
}

function pauseAudio()
{
 document.getElementById("Music_track").pause();
}


Sbt.addEventListener("click", function() {
      arena.forEach(row => row.fill(0)); //endurstillir borðið
        player.score = 0; 
        updateScore(); //endurstillir stigin
        gameState = true; //endursetir gameState svo leikurinn getur byrjað
        playerReset(); //birtir fyrsta kubbinn svo leikurinn byrjar aftur

}, false);


//Skilgreinir stærðarskalann fyrir leikjaborðið, hver einn pixell jafngildir 20 pixla í x og y ás
context.scale(20, 20);

function rowClear() {
    var rowCount = 1;
    outer: for (var y = arena.length -1; y > 0; --y) {
        for (var x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 15; //uppfærir notandastig þegar row er "cleared"
        rowCount *= 2;
    }
}

//Skilgreinir collisionDetection detection fyrir kubbanna og leikjavellinn sjálfann
function collisionDetection(arena, player) {
    const playerM = player.matrix;
    const playerO = player.pos;
    for (let y = 0; y < playerM.length; ++y) { //Fer í gegnum alla möguleikanna við snertingu
        for (let x = 0; x < playerM[y].length; ++x) {
            if (playerM[y][x] !== 0 &&
               (arena[y + playerO.y] &&
                arena[y + playerO.y][x + playerO.x]) !== 0) {
                return true;
            }
        }
    }
    return false; //Ef engir kubbir "collide"-a þá heldur hann áfram
}

function createMatrix(w, h) { //býr til Matrix-ið sem við verðum að vinna með
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix; //Öll value-in í matrixinu fá 0 á meðan h(hæð) er lækkandi
}

//Setur upp með matrix kubbanna sem eru birtir í leiknum, er vísað í í playerRestart, sem birtir kubbanna sem player nýtir sér
function createPiece(type)
{
    if (type === 'I') { //Kubbur I
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') { //Kubbur L
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') { //Kubbur J
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') { //Kubbur O
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') { //Kubbur Z
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') { //Kubbur S
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') { //Kubbur T
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

//
function drawMatrix(matrix, offset) { 
   if (gameState == true)  //ef leikurinn er enn í gangi, byrja að teikna
   {
        matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) { //ef kubbur er birtur fyrir í leiknum, það er, ef value í matrix-inu er ekki 0, teikna það
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
   }

}

//N
function draw() { //Tæknilega lausnin til að teikna kubbanna sem birtast
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0}); //Teiknar kubb í default byrjunar reit kubbsins
    drawMatrix(player.matrix, player.pos); //Teiknar kubbinn hvert sinn sem staðsetningin uppfærist
}

function merge(arena, player) { //blanda saman arena og kubbanna sem þú droppar
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
//gerir notanda kleyft til að snúa kubbinu sem er teiknaður við
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop() {
    player.pos.y++; //kubbur dettur alltaf by default
    if (collisionDetection(arena, player)) { //ef kubbur lendir í collision við arena
        player.pos.y--;
        merge(arena, player); //gera kubbinn að hluta að matrix-inu fyrir spilaborðið
        playerReset();//búa til nýjan kubb
        rowClear(); //ef er viðeigandi, eyða línu af kubbum og gefa stig
        updateScore(); //uppfæra stigin
    }
    dropCounter = 0; //endurstilla drop fyrir playerDrop
}
//Tæknilega fallið sem er vísað í til að hreyfa kubbanna
function playerMove(offset) {
    player.pos.x += offset;
    if (collisionDetection(arena, player)) { //vísar í collisionDetection til að gá hvort hægt er að hreyfa kubb í ákveðna átt
        player.pos.x -= offset;
    }
}

function playerReset() {
    
    if (gameState == true) //Ef leikurinn er ennþá í gangi er playerReset notað
    {
    const pieces = 'TJLOSZI'; //heldur utan um mismunandi kubba gerðarnar
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]); //Vísar í createPiece og sendir randomly valinn kubb sem parameter
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collisionDetection(arena, player)) { //Ef arena og player lenda í collision hættir leikurinn
        alert("Game over: Try again?");
           arena.forEach(row => row.fill(0)); //endurstillir borðið
        player.score = 0; //endurstillir score fyrir player
        updateScore(); //er vísað í updateScore til að birta uppfærðu stigagjöfin
       gameState = false; //leikurinn er búinn
       player.matrix = null; //endurstillir player.matrix til að koma í veg fyrir að nýr kubbur birtist snemma

    }
    }

}
//Er notað til að snúa kubbinum sem eru núna birtur, og 
function playerRotate(dir) {
    var pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir); //vísar í rotate fallið fyrir tæknilega virkni 
    while (collisionDetection(arena, player)) {  // notar collisionDetection svo ekki er hægt að snúa í aðra kubba eða veggina 
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) { //
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

var dropCounter = 0;
var dropInterval = 500; //Ákveður hversu langt er á milli kubba hreyfingu

var lastTime = 0;
function update(time = 0) { 
  
        var newTime = time - lastTime;

    dropCounter += newTime;
    if (dropCounter > dropInterval) {
      if (gameState)
       {
         playerDrop();
       }
       
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
    

}
//Í hvert skipti
function updateScore() {
    document.getElementById('score').innerText = player.score;
    /*if (Hscore === null || Hscore < player.score) 
    {
    	Hscore = player.score;
    	document.getElementById('high_score').innerText = Hscore;
    }*/
}
//Setur upp event listener fyrir notanda að nota örva takkanna og w takkann í leiknum, vísar í playerMove fallið
document.addEventListener('keydown', event => {
    if (gameState == true) //er aðeins hægt að stýra leiknum ef gamestate er true, ekki er hægt að gera neytt nema maður hefa kubba til að nota
    {
         if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
    }
   
});
//skilgreininr litina sem eru notaðir í draw fallinu fyrir kubbanna
const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];
//skilgreini stærðarhlutföllin fyrir leikjasvæðið
const arena = createMatrix(12, 20);

//
var player = { //stillir value-in sem notuð eru í flest öðrum föllunum, staðsetningu players á y og x ás, matrix value-in sem player hefur (hvaða kubb player er að nota) og score hans
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

//hvert sinn sem leikurrin keyrist og hann virkar, playerReset birtir nýjan kubb, updateScore uppfærir stigafjöldann og Update uppfærir hreyfingu kubbanna
playerReset();
updateScore();
update();
