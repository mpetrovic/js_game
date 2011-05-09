(function (Crafty, window, document) {
	window.onload = function() {
		Crafty.init(480, 480);
		
		Crafty.sprite(240, "images/circle.png", {
			circleSpin: [0,0]
		});
		
		Crafty.background("#000000");
		/*
		Crafty.e('2D, DOM, circleSpin, SpriteAnimation')
			.attr({w: 240, h: 240})
			.animate("spin", 0, 0, 49)
			.animate("spin", 1, -1);
		*/
		Crafty.e('2D, DOM, circleSpin, SpriteAnimation')
			.attr({x: 240, w: 240, h: 240})
			.animate("spin1", 0, 0, 49)
			.animate("spin1", 50, -1);
		
		Crafty.e('2D, DOM, circleSpin, SpriteAnimation')
			.attr({y: 240, w: 240, h: 240})
			.animate("spin2", 0, 0, 49)
			.animate("spin2", 100, -1);
		/*
		Crafty.e('2D, DOM, circleSpin, SpriteAnimation')
			.attr({x: 240, y: 240, w: 240, h: 240})
			.animate("spin3", 0, 0, 49)
			.animate("spin3", 150, -1);*/

	}
})(Crafty, window, window.document)