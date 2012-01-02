(function(Crafty) {
	var data = {};
	var queue = [];
	
	var xml = new XMLHttpRequest();
		
	function process(type, id, data) {
		// process xml call
		for (var i in data) {
			var d = data[i];
			data[d.type][d.id] = d;
		}
	}
	
	Crafty.data = {
		externalURL: '',
		
		prepare: function(type, id, force) {
			if (!data[type]) data[type] = {};
			if (data[type][id]) return;
			
			queue.push('req[][type]='+type+'&req[][id]='+id);
			if (force) {
				getData(force);
			}
		},
		
		get: function(type, id) {
			if (!this._data[type][id]) {
				this.loading(); 
				this.prepare(type, id, true);
			}
			
			var d = data[type][id], i
				new_entity = Crafty.e(d.components)
									.attr(d.attr)
									.trigger('LoadData', d);
			
			
			// ensure that necessary data is loaded
			for (i in d.ensure) {
				this.prepare(type, id, true);
			}
			
			for (i in d.next) {
				var next = d.next[i];
				this.prepare(next.type, next.id);
			}
			
			this.loading(false);
			return new_entity;
		},
		
		loading: function() {
		},
	};
	
	function getData(force) {
		
		// run ajax call
		// ie8+ only. if you're using ie7 or below, i don't care
		if (!xml || !queue.length) return;
		
		var url = Crafty.data.externalURL;
		
		xml.open("POST", url, !force);
		xml.onreadystatechange = function() {
			if (xml.readyState != 4) return;
			if (xml.status == 200 || xml.status == 302) {
				process(type, id, eval('('+xml.transportText+')'));
				queue = [];
			}
		};
		xml.ontimeout = function () {
			getData();
		};
		xml.send(queue.join('&'));
		if (force) {
			xml.onreadystatechange();
		}
	}
	
	var dataLoad = window.setInterval(getData, 5000);
})(Crafty);