/**
 * SaveLoad
 * ---------
 * Implements a mechanism to save and load data from either a server or from someplace in the browser
 * The system will run go through a number of fallbacks to use the most advanced and versatile storage method. 
 *
 * Each Component with data to save should bind to the "SaveData" event. 
 * The function will receive an object as a parameter.
 * Enough data should be added to this object that it can be reconstructed later
 * The key for each entity will be its path in the DataStore
 * 
 * IndexedDB:
 * Each game should have a database
 * Each database should contain a 'global' store and a store for each game save
 * Each game save should contain all the objects that have been saved
 *
 * WebSQL:
 * Each game will have a database
 * Each database should contain a global table of keys and values, and a table for each game save
 * Each game save should have a key, a list of components, and attribute fields.
 * These will be serialized as strings, they will need to be eval'd on load
 *
 * webStorage & cookies:
 * Storage objects will have a {gameName}-global key with a serialized object as a value
 * In addition to a {gameName}-{saveName} key for each save game.
 * Save game values will be a serialized object keyed with DataStore path and values of an entities components and attributes
 */
(function (Crafty, window, document) {
	var db = NULL, url = '';
	
	Crafty.c("Save", {
		saveName: '',			// machine name for the save. 
								// either gameName_save_01 OR gameName_userName_save_01
		
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
				
			});
		},
		
		// gets all the data a component is saving
		getSaveData: function() {
			var data = {
				c: this.__c,
				a: {},
			};
			this.trigger("SaveData", data.a);
			return data;
		},
		
		// in order of things I will try
		saveIndexed: function() {
			if (db == NULL) {
				db = {};
				var request = window.indexedDB.open(Crafty.gameName);
				request.onsuccess = function(event) {
					db.database = event.result;
					var request2 = this.db.database.setVersion(1);
					request2.onsuccess = function(e) {
						db.store = this.db.database.createObjectStore("GameSaves", "id", false);
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
	
	Crafty.extend({
		gameName: '',
		setSaveGameURL: function (new_url) {
			// check the URL works
			if (1) {
				url = new_url;
			}
		},
		
		loadFromSave: function (saveName) {
			if (loadOnline(saveName)) {
				// do nothing
			}
			else if (window.indexedDB) {
				loadIndexed(saveName);
			}
			else if (openDatabase) {
				loadSql(saveName);
			}
			else if (window.localStorage) {
				loadStorage(saveName)
			}
			else {
				loadCookies(saveName);
			}
		},
	});
	
	function loadOnline(saveName) {
	}
	
	function loadIndexed(saveName) {
	}
	
	function loadSql(saveName) {
	}
	
	function loadStorage(saveName) {
	}
	
	function loadCookies(saveName) {
	}
});