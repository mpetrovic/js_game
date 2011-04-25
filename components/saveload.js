(function (Crafty, window, document) {
	Crafty.c("SaveLoad", function() {
		saveName: '',			// machine name for the save. 
								// either gameName_save_01 OR gameName_userName_save_01
		
		init: function() {
			// determine which save solution we'll be using.
			this.bind("SaveGame", function() {
				if (this.saveOnline()) {
					// do nothing
				}
				else if (window.indexedDB) {
					this.saveIndexed();
				}
				else if (openDatabase) {
					this.saveSql();
				}
				else if (window.localStorage) {
					this.saveStorage()
				}
				else {
					window.saveCookies();
				}
			});
			
			this.bind("LoadGame", function() {
				if (this.loadOnline()) {
					// do nothing
				}
				else if (window.indexedDB) {
					this.loadIndexed();
				}
				else if (openDatabase) {
					this.loadSql();
				}
				else if (window.localStorage) {
					this.loadStorage()
				}
				else {
					window.loadCookies();
				}
			});
		},
		
		// gets all the data a component is saving
		_getSaveData() {
			var data = {};
			this.trigger("SaveData", data);
			return data;
		},
		
		// in order of things I will try
		saveIndexed: function() {
		},
		loadIndexed: function() {
		},
		
		saveSql: function() {
		},
		loadSql: function() {
		},
		
		saveStorage: function() {
		},
		loadStorage: function() {
		},
		
		saveCookies: function() {
			// alert a warning that we're saving with cookies
			// which means the browser is very old.
			// suggest they upgrade for better performance
		},
		loadCookies: function() {
		},
		
		saveOnline: function() {
			// save to a server
		},
		loadOnline: function() {
		},
	});
});