jewel.screens["splash-screen"] = (function (){
	var game = jewel.game;
	var dom = jewel.dom;
	var $ = dom.$;
	var firstRun = true;

	function setup(getLoadProcess) {
		var scr = $("#splash-screen")[0];

		function checkProgress() {
			var p = getLoadProcess() * 100;
			$(".indicator",scr)[0].style.width = p + "%";
			if (p == 100) {
				$(".continue",scr)[0].style.display = "block";
				dom.bind(scr, "click", function(){
					jewel.game.showScreen("menu-screen");
				});
			} else {
				setTimeout(checkProgress, 30);
			}
		}
		checkProgress();
	}

	function run(getLoadProcess) {
		if (firstRun){
			setup(getLoadProcess);
			firstRun = false;
		}
	}

	return {
		run : run
	};
})();