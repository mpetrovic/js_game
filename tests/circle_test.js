(function (Crafty, window, document) {
	window.onload = function() {
		Crafty.init(50, 400, 320);
		Crafty.canvas();
		Crafty.load(["https://github.com/mpetrovic/js_game/raw/master/images/circle.png"], function() {
			Crafty.sprite(240, "https://github.com/mpetrovic/js_game/raw/master/images/circle.png", {circleSpin: [0,0]});
			var circle = Crafty.e('SpriteAnimation, 2D, canvas, circleSpin')
						.attr({w: 100, h: 100, x: 150, y:120})
						.animate("spin", 0, 0, 49);
		}); 
		
		Crafty.scene('test', function() {
			circle.animate("spin");
		});
	}
})(Crafty, window, window.document)