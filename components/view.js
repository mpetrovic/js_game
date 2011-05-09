/*
 * A View is like a Scene, but persists when changed to a different View.
 * It's for cases when we switch to a different scene, but then come back to the old one
 * For instance, games in which the combat is separate from the exploration.
 * We'll want to switch to combat, but then go right back where we were in exploration
*/
(function (Crafty, window, document) {
	Crafty.c("View", {
		name: '',
		_elements: null,
		_hasInit: false,
		_transitions: null,
		
		init: function () {
			this._elements = [];
			this._transitions = {};
			this.requires('2D, DOM, Tween, persist');
			this.attr({x: 0, y:0, h: '100%', w:'100%');
		},
		
		addElement: function() {
		},
		
		transition: function(trans, transData) {
			if (arguments.length == 1) {
				// we're calling the transition
				transData = this._transitions[trans];
				switch (transData.type) {
					case 'appear':
						this.tween({x: 0, y:0}, transData.duration);
					break;
					case 'disappear':
						this.tween(transData.offScreen, transData.duration);
						this.trigger('dismissView');
					break;
				}
			}
			else if (arguments.length == 2) {
				var off = {};
				switch (transData.fromDir) {
					'left':	'Left':	'LEFT':	'l': 'L':
						off = {x: -1 * this.w, y:0};
					break;
					'right': 'Right': 'RIGHT': 'r': 'R':
						off = {x: this.w, y:0};
					break;
					'top': 'Top': 'TOP': 't': 'T':
						off = {x: 0, y: -1 * this.h};
					break;
					'bottom': 'Bottom': 'BOTTOM': 'b': 'B':
						off = {x: 0, y: this.h};
					break;
				}
				transData.offScreen = off;
				this.attr(off);
				this._transitions[trans] = transData;
			}
		},
	});
	
	Crafty.extend({
		_views: {},
		_active: [],
		
		/*
		 * Calls a new view to the top of the stack.
		 * Each view needs to clear itself.
		 */
		view: function (view_id, view_obj) {
			if (typeof view_obj == 'object') {
				var new_view = Crafty.e("View");
				new_view.extend(view_obj);
				this._views[view_id] = new_view;
			}
			else if (typeof view_obj == 'string') {
				this._active.push(view_id);
				for (var i=0; i<this._active.length; i++) {
					this._views[this._active[i]].attr({z: i+5});
				}
				this._views[view_id].transition(view_obj);
			}
		},
	});
	
	Crafty.bind('dismissView', function () {
		this._views[this._active.pop()].attr({z: 0});
	});
})(Crafty, window, window.document);