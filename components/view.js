/*
 * A View is like a Scene, but persists when changed to a different View.
 * It's for cases when we switch to a different scene, but then come back to the old one
 * For instance, games in which the combat is separate from the exploration.
 * We'll want to switch to combat, but then go right back where we were in exploration
*/
(function (Crafty, window, document) {
	Crafty.c("View", {
		name: '',
		_childElements: null,
		_hasInit: false,
		_isActive: false,
		_transitions: null,
		
		init: function () {
			this._childElements = [];
			this._transitions = {};
			this.requires('2D, DOM, Tween, persist');
			this.attr({x: 0, y:0, h: Crafty.DOM.window.height, w:Crafty.DOM.window.width});
			
			this.bind('activateView', this.activate);
			this.bind('dismissView', this.deactivate);
			
			this.oldTrigger = this.trigger;
			this.trigger = function(event, data) {
				if ('_isActive' in this && this._isActive) {
					this.oldTrigger(event, data);
				}
			};
		},
		
		activate: function() {
			if ('start' in this) {
				this.start();
			}
			if (!this._element.parentNode) {
				Crafty.stage.inner.appendChild(this._element);
			}
			this._isActive = true;
		},
		
		deactivate: function() {
			if ('stop' in this) {
				this.stop();
			}
			this._isActive = false;
		},
		
		addElement: function(x, y, w, h, className, tag) {
			// not using entities for these internal elements
			if (!tag) tag = 'div';
			var elem = document.createElement(tag);
			document.className = className;
			document.style.position = 'absolute';
			document.style.top = y+'px';
			document.style.left = x+'px';
			document.style.width = w+'px';
			document.style.height = h+'px';
			
			this._childElements.push(elem);
			this._element.addChild(elem);
			return elem;
		},
		
		addButton: function (props) {
			var button = this.addElement(props.x, props.y, props.w, props.h, props.className, 'input');
			button.value = props.text;
			this.addEvent(this, button, 'click', props.handler);
			return button;
		},
		
		/*
		 * transData takes the following properties:
		 *	type: 'appear' || 'disappear'. Whether the view is coming or going
		 * 	fromDir: which way the the view comes from
		 * 	duration: how long the transition lasts
		 */
		transition: function(trans, transData) {
			if (arguments.length == 1) {
				// we're calling the transition
				transData = this._transitions[trans];
				switch (transData.type) {
					case 'appear':
						this.tween({x: 0, y:0}, transData.duration);
						
						this.delay(function() (
							this.trigger('activateView');
						), (transData.duration/Crafty.FPS)*1000);
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
			return this;
		},
	});
	
	Crafty.extend({
		_views: {},
		_activeView: [],
		
		/*
		 * Calls a new view to the top of the stack.
		 * Each view needs to clear itself.
		 */
		view: function (view_id, view_obj) {
			Crafty.scene('noScene');
			if (typeof view_obj == 'object') {
				var new_view = Crafty.e("View");
				new_view.extend(view_obj);
				if ('create' in new_view) {
					new_view.create.call(new_view);
				}
				this._views[view_id] = new_view;
			}
			else if (typeof view_obj == 'string') {
				this._active.push(view_id);
				for (var i=0; i<this._activeView.length; i++) {
					this._views[this._activeView[i]].attr({z: i+5});
				}
				this._views[view_id].transition(view_obj);
			}
			else if (typeof view_obj == 'undefined') {
				this._views[view_id].trigger('activateView');
			}
		},
	});
	
	Crafty.scene('noScene', function() {
	});
	
	Crafty.bind('dismissView', function () {
		this._views[this._activeView.pop()].attr({z: 0});
	});
})(Crafty, window, window.document);