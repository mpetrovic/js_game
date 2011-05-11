(function (Crafty, window, document) {
	Crafty.c("Reyvateil", {
		songAvailable: null,
		talkTopics: null,
		
		_harmoLevel: 0,
		
		init: function() {
			this.songAvailable = {};
			this.talkTopics = {};
		},
	});
})(Crafty, window, window.document);