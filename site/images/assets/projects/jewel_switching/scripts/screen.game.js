jewel.screens["game-screen"] = (function(){
	var board = jewel.board,
		display = jewel.display,
		input = jewel.input,
		settings = jewel.settings,
		cursor,
		firstRun = true,
		
		gameState = {
		};

	function run(){
		if (firstRun) {
			setup();
			firstRun = false;
		}
		startGame();
	}

	function setup() {
		input.initialize();
		input.bind("selectJewel", selectJewel);
		input.bind("moveUp", moveUp);
		input.bind("moveDown", moveDown);
		input.bind("moveLeft", moveLeft);
		input.bind("moveRight", moveRight);
	}

	function startGame() {
		gameState = {
			level : 0,
			score : 0,
			timer : 0,
			startTime : 0,
			endTime : 0
		};
		cursor = {
			x: 0,
			y: 0,
			selected: false
		};

		updateGameInfo()
		setLevelTimer(true);

		board.initialize(/*callback*/ function(){
			display.initialize(function(){
				display.redraw(board.getBoard(), function() {
					advanceLevel();
				});
			});
		});
	}

	function gameOver(){
		display.gameOver(function() {
			announce("Game over");
			startGame();
		});
	}


	function updateGameInfo() {
		$("#game-screen .game-info .score span")[0].innerHTML = gameState.score;
		$("#game-screen .game-info .level span")[0].innerHTML = gameState.level;
	}

	function setLevelTimer(reset) {
		if (gameState.timer) {
			clearTimeout(gameState.timer);
			gameState.timer = 0;
		}
		if (reset) {
			gameState.startTime = Date.now();
			gameState.endTime = 
				settings.baseLevelTimer * Math.pow(gameState.level,
				-0.05 * gameState.level);
		}
		var delta = gameState.startTime +
					gameState.endTime - Date.now(),
			percent = (delta / gameState.endTime) * 100,
			progress = $("#game-screen .time .indicator")[0];
		if (delta < 0) {
			gameOver();
		}
		else {
			progress.style.width = percent + "%";
			gameState.timer = setTimeout(setLevelTimer, 30);
		}
	}

	function addScore(points) {
		var nextLevelAt = Math.pow(
				settings.baseLevelScore, 
				Math.pow(settings.baseLevelExp, gameState.level - 1)
				);
		gameState.score += points;
		if (gameState.score >= nextLevelAt) {
			advanceLevel();
		};
		updateGameInfo();
	}

	function advanceLevel(){
		gameState.level++;
		announce("Level "+gameState.level);
		updateGameInfo();
		gameState.startTime = Date.now();
		gameState.endTime = settings.baseLevelTimer * Math.pow(gameState.level, -0.05 * gameState.level)
		setLevelTimer(true);
		display.levelUp();
	}

	function announce(str){
		var element = $("#game-screen .announcement")[0];
		element.innerHTML = str;
		if (Modernizr.cssanimations) {
			jewel.dom.removeClass(element, "zoomfade");
			setTimeout(function(){
				jewel.dom.addClass(element, "zoomfade");
			}, 1);
		} else {
			jewel.dom.addClass(element, "active");
			setTimeout(function() {
				jewel.dom.removeClass(element, "active");
			}, 1000);
		}
	}

	function setCursor(x, y, select) {
        if (arguments.length > 0) {
            cursor = {
                x : x,
                y : y, 
                selected : select
            };
        }
        else {
            cursor = null;
        }
		display.setCursor(x, y, select);
	}

	function selectJewel(x, y) {
		if (arguments.length == 0){
			selectJewel(cursor.x, cursor.y);
			return;
		}
		if (cursor.selected) {
			var dx = Math.abs(x - cursor.x);
				dy = Math.abs(y - cursor.y);
				dist = dx + dy;
			if (dist == 0) {
				setCursor(x, y, false);	
			}
			else if (dist == 1) {
				var curX = cursor.x, 
					curY = cursor.y;
				cursor = null;
				board.swap(curX, curY, x, y, playBoardEvents);
			}
			else {
				setCursor(x, y, true);
			}
		}
		else{
			setCursor(x, y, true);
		}
	}

	function playBoardEvents(events) {
		if (events.length > 0) {
			var boardEvent = events.shift(),
				next = function(){
					playBoardEvents(events);
				};
			switch (boardEvent.type) {
				case "move" :
					display.moveJewels(boardEvent.data, next);
					break;
				case "remove" :
					display.removeJewels(boardEvent.data, next);
					break;
				case "refill" : 
					announce("No Moves!");
					display.refill(boardEvent.data, next);
					break;
				case "score" :
					addScore(boardEvent.data);
					next();
					break;
				case "select" :
					setCursor(boardEvent.data.x, boardEvent.data.y, true);
					next();
					break;
				default:
					next();
					break;
			}
		} else {
			display.redraw(board.getBoard(), function(){
				// something
			});
		}
	}

	function moveCursor(x, y) {
		if (cursor.selected) {
			x += cursor.x;
			y += cursor.y;
			if (x >= 0 && x < settings.cols 
				&& y >= 0 && y < settings.rows) {
				selectJewel(x, y);
			}
		} else {
			x = (cursor.x + x + settings.cols) % settings.cols;
			y = (cursor.y + y + settings.rows) % settings.rows;
			setCursor(x, y ,false);
		}
	}


	function moveUp() {
		moveCursor(0, -1);
	}

	function moveDown() {
		moveCursor(0, 1);
	}

	function moveLeft() {
		moveCursor(-1, 0);
	}

	function moveRight() {
		moveCursor(1, 0);
	}

	return {
		run : run
	};
})();