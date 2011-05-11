(function (Crafty, window, document) {
	Crafty.c("AI", {
		// an AI player can only attack so much
		// every attack has a cost, which is deducted from moves.
		_moves: 0,
	});
})(Crafty,window,window.document);