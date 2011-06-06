// Every interface is different. I pretty much can only set up a framework others can use to contain elements

(function (Crafty, window, document) {
	Crafty.c("Interface", {		
		_data: null,
		_handlers: null,
		_element: null,
		
		init: function() {
			this._data = {};
			this._handlers = [];
			
			this.bind("enterframe", this.run);
		},
		
		setup: function(runThis) {
			if (typeof runThis == 'function') {
				var args = new Array();
				for (var i=1; i<arguments.length; i++) {
					args[i-1] = arguments[i];
				}
				runThis.apply(this, args);
			}
			else {
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
		
		setData: function (key, data) {
			this._data[key] = data;
		}
		
		getData: function (key) {
			return this._data[key];
		}
		
		// convience functions for dealing with elements inside this one:
		
		getFirstOfClass: function(className) {
			return this._element.getElementsByClassName(className)[0];
		}
	});
})(Crafty, window, window.document)