(function (Crafty, window, document) {
	Crafty.c("SaveLoad", function() {
		saveName: '',			// machine name for the save. 
								// either gameName_save_01 OR gameName_userName_save_01
		db: NULL,
		
		init: function() {
			// determine which save solution we'll be using.
			this.bind("SaveGame", function() {
				var data = this._getSaveData();
				if (this.saveOnline(data)) {
					// do nothing
				}
				else if (window.indexedDB) {
					this.saveIndexed(data);
				}
				else if (openDatabase) {
					this.saveSql(data);
				}
				else if (window.localStorage) {
					this.saveStorage(data)
				}
				else {
					window.saveCookies(data);
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
		getSaveData() {
			var data = {
				c: this.__c,
				a: {},
			};
			this.trigger("SaveData", data.a);
			return data;
		},
		
		// in order of things I will try
		saveIndexed: function() {
			if (this.db == NULL) {
				this.db = {};
				var request = window.indexDB.open("ArTonelico_CellianNights", "Saved Data for Ar Tonelico: Cellian Nights");
				request.onsuccess = function(event) {
					this.db.database = event.result;
					var request2 = this.db.database.setVersion(1);
					request2.onsuccess = function(e) {
						this.db.store = this.db.database.createObjectStore("GameSaves", "id", false);
					};
				};
			}
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