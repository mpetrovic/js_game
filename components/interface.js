// Every interface is different. I pretty much can only set up a framework others can use to contain elements

(function (Crafty, window, document) {
	Crafty.c("Interface", {		
		_data: null,
		
		_handlers: [],
		
		init: function() {
			this.requires("2D DOM");
			
			this.bind("enterFrame", this.run);
		},
		
		setup: function(runThis) {
			if (typeof runThis == 'function') {
				var args = new Array();
				for (var i=1; i<arguments.length; i++) {
					args[i-1] = arguments[i];
				}
				runThis.apply(this, args);
			}
		},
		
		addHandler: function(handler) {
			if (typeof handler == 'function')
				this._handlers.push(handler);
		},
		
		run: function() {
			for (var i=0; i<this._handlers.length; i++) {
				this._handlers[i].apply(this, arguments);
			}
		},
		
		// convience functions for dealing with elements inside this one:
		
		getFirstOfClass: function(className) {
			return this._element.getElementsByClassName(className)[0];
		}
	});
})(Crafty, window, window.document)