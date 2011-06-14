(function (Crafty, window, document) {
Crafty.c("Cutscene", {
	_lines: null,
	_linesCurrent: 0,
	isPlaying: false,
	background: '',
	
	init: function() {
		this._lines = [];
	},
	
	play: function(line) {
		var ln = this._lines;
		if (typeof line == 'number' && ln[line]) {
			this._linesCurrent = line;
		}
		ln[this._linesCurrent].play();
	},
	
	pause: function() {
	},
	
	_executeLine: function(line) {
	},
	
	lineEnd: function() {
		var lc, lines = this._linesCurrent++, this._lines;
		if (lines[lc])
			lines[lc].play();
		else {
			this.isPlaying = false;
		}
	},
});

Crafty.c("SceneLine", {
	_speaker: null,
	_speakerPosition: 0,
	type: 'dialog',
	dialogType: 'screen',
	line: '',
	triggerNext: 'user',
	sound: '',
	
	init: function() {
	},
	
	play: function() {
	
		// play the line
		switch (this.type) {
			case 'dialog':
			break;
			case 'animation':
			break;
			case 'camera':
			break;
		}
		
		// set up trigger for next line
	},
	
	// placeholder for our event handler
	action: function() {
	},
	
	end: function() {
	},
});
})(Crafty, window, window.document);