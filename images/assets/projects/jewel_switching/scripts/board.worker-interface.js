jewel.board = (function (){
	var dom = jewel.dom,
		settings,
		jewels,
		cols,
		rows,
		messageCount,
		callbacks,
		worker;

	function initialize(callback){
		settings = jewel.settings;
		rows = settings.rows;
		cols = settings.cols;
		messageCount = 0;
		callback = [];
		worker = new Worker("board.worker.js");
		dom.bind(worker, "message", messageHandler);
		post("initialize", settings, callback);
	}

	function post(command, data, callback){
		callbacks[messageCount] = callback;
		worker.postMessage({
			id: messageCount,
			command: command,
			data: data
		});
		messageCount++;
	}

	function messageHandler(event){
		var message = event.message;
		jewels = message.jewels;
		if (callbacks[message.id]) {
			callbacks[message.id](message.data);
			delete callbacks[message.id];
		};
	}

	function swap (x1, y1, x2, y2, callback){
		post("swap", {
			x1: x1,
			x2: x2,
			y1: y1,
			y2: y2
		}, callback);
	}

	function getBoard(){
		var copy = [],
			x;
		for(x = 0; x < cols; x++){
			copy[x] = jewels[x].slice(0);
		}
		return copy;
	}


	function print () {
		var str = "";
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++){
				str += getJewel(i,j)+" ";
			}
			str += "\n";
		}	
		console.log(str);
	}

	return {
		swap : swap,
		initialize : initialize,
		print : print,
		getBoard : getBoard
	};

}());