jewel.screens["menu-screen"] = (function(){
	var game = jewel.game;
	var dom = jewel.dom;
	var firstRun = true;

	function setup() {
		dom.bind("#menu-screen","click", function(e){
			if (e.target.nodeName.toLowerCase() === "button") {
				var action = e.target.getAttribute("name");
				game.showScreen(action);
			}
		});
	}

	function run () {
		if (firstRun) {
			setup();
			firstRun = false;
		};
	}

	return {
		run : run
	};

})();