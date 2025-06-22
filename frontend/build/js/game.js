let MAP_WIDTH = 500;
let MAP_HEIGHT = 500;

const PIXEL_SIZE = 10;
const CAMERA_SPEED = 0.5;

var PLAYER_ID = -1;

// Миникарта размеры
const MINIMAP_WIDTH = 50;
const MINIMAP_HEIGHT = 50;
//const MINIMAP_SCALE_X = MINIMAP_WIDTH /500;
//const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / 500;

// Объект для графики миникарты
let minimapGraphics;



var game;
var socket = io();

var cameraFollow;

var players;
var tails;
var food;
var map;
var names;

/* Server ping */
var startTime;

setInterval(function () {
	startTime = Date.now();
	socket.emit('ping2');
}, 1000);

socket.on('pong2', function () {
	let latency = Date.now() - startTime;
	if (latency < 100) {
		$("#ping-badge").removeClass("badge-danger");
		$("#ping-badge").addClass("badge-success");
	} else {
		$("#ping-badge").removeClass("badge-success");
		$("#ping-badge").addClass("badge-danger");
	}
	$("#server-ping").html(latency);
});


/* Init game engine*/
function preload() {
	//game.load.image('background', '/client/img/game/background1.png');
	//game.load.image('food_DOGE', '/client/img/assets/doge.svg');
}


//let foodTypes = ['TON','XMR']; // и т.д.

function updateMinimap(data) {
  // Очищаем предыдущий кадр
  minimapGraphics.clear();
  
  // 1. Рисуем границы карты
  /*
  minimapGraphics.beginFill(0x222222, 0.5);
  minimapGraphics.drawRect(10, 100, MINIMAP_WIDTH, MINIMAP_WIDTH);
  minimapGraphics.endFill();
  

  // 1. Рисуем границы карты как круг
minimapGraphics.beginFill(0x222222, 0.5);
// Вычисляем центр круга и радиус
const centerX = 10 + MINIMAP_WIDTH / 2;
const centerY = 100 + MINIMAP_WIDTH / 2;
const radius = MINIMAP_WIDTH / 2;
minimapGraphics.drawCircle(centerX, centerY, radius);
minimapGraphics.endFill();
*/

  // 2. Рисуем еду
  data.food.forEach(f => {
    minimapGraphics.beginFill(hslToHex(f.color, 100, 50));
    minimapGraphics.drawRect(f.x, f.y, 1, 1); // 1px на миникарте
    minimapGraphics.endFill();
  });
  
  // 3. Рисуем игроков
  data.players.forEach(p => {
    const color = (p.id === PLAYER_ID) ? 0xFF0000 : 0x00FF00;
    minimapGraphics.beginFill(color);
    minimapGraphics.drawRect(p.x, p.y, 5, 5); // Игроки крупнее еды
    minimapGraphics.endFill();
  });
}

//

function create() {
    // Основные настройки игры
    game.world.setBounds(0, 0, MAP_WIDTH * PIXEL_SIZE, MAP_HEIGHT * PIXEL_SIZE);
    //game.add.tileSprite(0, 0, game.width * PIXEL_SIZE, game.height * PIXEL_SIZE, "background");

    // Настройки камеры и масштабирования
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.parentIsWindow = true;

    // Создаем группы
    players = game.add.group();
    tails = game.add.group();
    food = game.add.group();
    map = game.add.group();
    names = game.add.group();
    minimap = game.add.group(); // Новая группа для миникарты

    // Границы карты
    let g = game.add.graphics(0, 0);
    g.beginFill(0x222222, 1);
    g.drawRect(0, 0, MAP_WIDTH * PIXEL_SIZE, PIXEL_SIZE);
    g.drawRect(0, 0, PIXEL_SIZE, MAP_HEIGHT * PIXEL_SIZE);
    g.drawRect(0, (MAP_HEIGHT - 1) * PIXEL_SIZE, MAP_WIDTH * PIXEL_SIZE, MAP_HEIGHT * PIXEL_SIZE);
    g.drawRect((MAP_WIDTH - 1) * PIXEL_SIZE, 0, (MAP_HEIGHT) * PIXEL_SIZE, MAP_HEIGHT * PIXEL_SIZE);
    g.endFill();
    map.add(g);

    // Миникарта - фон
	//кординаты положения
    minimapGraphics = game.add.graphics(1, 1);
    //minimapGraphics.beginFill(0x000000, 0.5);
    //minimapGraphics.drawRect(0, 0, 100, 100 );
	
    minimapGraphics.endFill();
    
    // Рамка миникарты
    const border = game.add.graphics(10, 10);
    //border.lineStyle(2, 0xFFFFFF, 1);
    //border.drawRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);
    //border.drawRect(0, 0, (MINIMAP_WIDTH/2), (MINIMAP_HEIGHT/2) );
    
    // Фиксируем миникарту на экране
    minimapGraphics.fixedToCamera = true;
    //border.fixedToCamera = true;
    
    // Добавляем элементы миникарты в группу
    minimap.add(minimapGraphics);
    minimap.add(border);
    
    // Настройка камеры
    cameraFollow = game.add.sprite(game.world.centerX, game.world.centerY);
    game.camera.x = game.world.centerX;
    game.camera.y = game.world.centerY;
    game.camera.roundPx = false;
    game.camera.follow(cameraFollow, Phaser.Camera.FOLLOW_LOCKON, (CAMERA_SPEED / PIXEL_SIZE), (CAMERA_SPEED / PIXEL_SIZE));
    
    //minimapGraphics.visible = true;
  	//add hot key M for visble map
  	game.input.keyboard.addKey(Phaser.Keyboard.M).onDown.add(() => {
    	minimapGraphics.visible = !minimapGraphics.visible;
  	});
  
  
}



function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

 function encodeHTML(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}


function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}


 function hslToHex(h, s, l) {
	let rgb = Phaser.Color.HSLtoRGB(h / 360, s / 100, l / 100);
	return "0x" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

function play() {
	socket.emit("spawn", { name: $("#name").val() });
}

/* Socket events */
socket.on("id", function (data) {
	PLAYER_ID = data.id;
	console.log("Your id is " + PLAYER_ID);
});

socket.on("death", function (data) {
	$("#total-score").html(data.score);
	$("#final-score").show();
	setTimeout(function () {
		$("#menu").fadeIn(1000);
		$("#player-info").fadeOut(1000);
		$("#btn_play").focus();
	}, 1000);
});

socket.on("spawn", function (data) {
	$("#menu").fadeOut(500);
	$("#player-info").fadeIn(500);
	try {
		game.camera.follow(null, Phaser.Camera.FOLLOW_LOCKON, 1, 1);
		game.camera.x = data.x * PIXEL_SIZE;
		game.camera.y = data.y * PIXEL_SIZE;
		game.camera.follow(cameraFollow, Phaser.Camera.FOLLOW_LOCKON, (CAMERA_SPEED / PIXEL_SIZE), (CAMERA_SPEED / PIXEL_SIZE));
	} catch (err) {
		console.log(err);
	}
});

//Заглавное окно ожидание
socket.on("gamestate", function (data) {
	if (players == undefined || tails == undefined || food == undefined || names == undefined) {
		console.log("Waiting for engine to start...");
		return;
	}
	 
	 updateMinimap(data); // Добавляем эту строку

	players.removeAll();
	tails.removeAll();
	food.removeAll();
	names.removeAll();

	let leaderboardcontent = "";
	while (data.leaderboard.length > 0) {
	
	let entry = data.leaderboard.pop();
		leaderboardcontent += '<div class="lb-entry ' + ((entry.id == PLAYER_ID) ? "lb-entry-self" : "") + '">' + (entry.place + 1) + ': ' + encodeHTML(entry.name) + '</div>';
	}

	$("#leaderboard-content").html(leaderboardcontent);

//отрисовка еды круглой
for (let i = 0; i < data.food.length; i++) {
	let foodData = data.food[i];
	let g = game.add.graphics(foodData.x * PIXEL_SIZE + PIXEL_SIZE / 2, foodData.y * PIXEL_SIZE + PIXEL_SIZE / 2);
	g.beginFill(hslToHex(foodData.color, 100, 35), 1);
	g.drawCircle(0, 0, PIXEL_SIZE); // диаметр круга
	g.endFill();
	food.add(g);

    //t = game.add.text(foodData.x * PIXEL_SIZE, (foodData.y * PIXEL_SIZE) - 10, foodData.type, { fill: "#000000", fontSize: "15px" });
	//t.anchor.setTo(0.5);
	//names.add(t);
}


/*
	for (let i = 0; i < data.food.length; i++) {
		let foodData = data.food[i];
		let g = game.add.graphics(foodData.x * PIXEL_SIZE, foodData.y * PIXEL_SIZE);
		g.beginFill(hslToHex(foodData.color, 100, 35), 1);
		g.drawRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
		g.endFill();
		food.add(g);
	}
		*/
		/* своя отрисовка, голова теряется под квадратами
			for (let i = 0; i < data.playerTails.length; i++) {
				let tail = data.playerTails[i];
				let g = game.add.graphics(tail.x * PIXEL_SIZE, tail.y * PIXEL_SIZE);
				g.beginFill(hslToHex(tail.color, 100, 25), 1);
				g.drawRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
				g.endFill();
				tails.add(g);
			}
			*/
	
		
		//новая отрисовка головы, всегда сверху
		for (let i = 0; i < data.playerTails.length; i++) {
		const tail = data.playerTails[i];
	
		// Пропускаем отрисовку головы из tail — она уже будет отрисована отдельно
		const isHead = data.players.some(p => p.x === tail.x && p.y === tail.y);
		if (isHead) continue;
	
		//тело кругляшки
		const g = game.add.graphics(tail.x * PIXEL_SIZE, tail.y * PIXEL_SIZE);
		g.beginFill(hslToHex(tail.color, 100, 25), 1);
		//g.drawRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
		g.drawCircle(5, 5, PIXEL_SIZE); // диаметр круга
		g.endFill();
		tails.add(g);
		}
		
		//конец отрисовки
		

		for (let i = 0; i < data.players.length; i++) {
			let player = data.players[i];
			let g = game.add.graphics(player.x * PIXEL_SIZE, player.y * PIXEL_SIZE);
	
		if (player.id == PLAYER_ID) {
			cameraFollow.x = (player.x * PIXEL_SIZE);
			cameraFollow.y = (player.y * PIXEL_SIZE);
			$("#player-score").html(player.score);
			$("#position").html("X: " + player.x + " Y: " + player.y);
		}

		//голова
		g.beginFill(hslToHex(player.color, 100, 50), 1);
		g.drawRect(0, 0, PIXEL_SIZE, PIXEL_SIZE);
		//g.drawCircle(0, 0, PIXEL_SIZE); // диаметр круга
		g.endFill();
		

		players.add(g);

		let t = game.add.text(player.x * PIXEL_SIZE, (player.y * PIXEL_SIZE) - 10, player.name, { fill: "#FFF", fontSize: "6px" });
		t.anchor.setTo(0.5);
		names.add(t);
	}
});



/* Load */
$(document).ready(function () {
	try {
		let conf = JSON.parse($.ajax({
			async: false,
			cache: false,
			type: "GET",
			url: "/config"
		}).responseText);
		APIKEYFP = conf.APIKEYFP;
		MAP_WIDTH = conf.MAP_WIDTH;
		MAP_HEIGHT = conf.MAP_HEIGHT;
		$("#name").attr('maxlength', conf.MAX_NAME_LENGTH);
	} catch (err) {
		console.log(err);
	}
	$("#final-score").hide();
	/*
	$("#btn_play").click(function () {
		play();
	});
*/

$("#btn_play").click(async function () {
	const name = $("#name").val().trim();

	if (!name) {
		alert("Введите имя!");
		return;
	}

	try {
		await fetch(`https://getpostcf.altyngroup.workers.dev/${encodeURIComponent(name)}?value=1`, {
			method: "POST",
		});
		console.log("Имя отправлено в воркер:", name);
	} catch (err) {
		console.error("Ошибка при отправке имени:", err);
	}

	play(); // запуск игры
});


	$("form").on('submit', function (e) {
		e.preventDefault();
		play();
	});

	$("#name").change(function () {
		setCookie("CryptoSnake", $("#name").val(), 365);
	});

	$("#name").focus();

	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'snake-game', { preload: preload, create: create });

	try {
		let name = getCookie("CryptoSnake");
		if (name.length > 0 && name.length <= 16) {
			console.log("Loaded name from cookie: " + name);
			$("#name").val(name);
		}
	} catch (err) {
		console.log(err);
	}
});

/* Key listener */
$(document).keydown(function (e) {
	var key = 0;
	if (e == null) {
		key = event.keyCode;
	} else {
		key = e.which;
	}

	if ((key === 68 || key === 39)) { //d
		socket.emit('keyPress', {
			inputId: 'right',
			state: true
		});
	} else if ((key === 83 || key === 40)) { //s
		socket.emit('keyPress', {
			inputId: 'down',
			state: true
		});
	} else if ((key === 65 || key === 37)) { //a
		socket.emit('keyPress', {
			inputId: 'left',
			state: true
		});
	} else if ((key === 87 || key === 38)) { // w
		socket.emit('keyPress', {
			inputId: 'up',
			state: true
		});
	}
});


//добавлена функция по клику, но чет тормозит, навреное делай нужно уменшать.
function onMouseClick(pointer) {
	if (!cameraFollow) return; // если игрок не подключён
	const clickX = pointer.worldX;
	const clickY = pointer.worldY;
	const headX = cameraFollow.x;
	const headY = cameraFollow.y;
	const dx = clickX - headX;
	const dy = clickY - headY;
	let direction;

	if (Math.abs(dx) > Math.abs(dy)) {
		direction = dx > 0 ? 'right' : 'left';
	} else {
		direction = dy > 0 ? 'down' : 'up';
	}

	socket.emit('keyPress', { inputId: direction, state: true });
}



async function sendPayFP(summa,name) {
  const url = 'https://faucetpay.io/api/v1/send';

  const formData = new URLSearchParams();
  formData.append('api_key', APIKEYFP),
  formData.append('amount', summa);
  formData.append('to', name);
  formData.append('currency', 'PEPE');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
	//tlet data.score = 0;
    const data = await response.json();
	//data.players.score=0; 
    console.log(data); // Здесь можешь вставить логику отображения данных
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

