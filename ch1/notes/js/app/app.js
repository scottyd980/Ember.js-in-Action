var Notes = Ember.Application.create();

Notes.Router.map(function() {
	this.resource('notes', {path: '/'}, function() {
		this.route('note', {path: '/note/:note_id'});
	});
});

Notes.NotesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('note');
	}
});

Notes.NotesNoteRoute = Ember.Route.extend({
	model: function(note) {
		return this.store.find('note', note.note_id);
	}
});

Notes.NotesController = Ember.ArrayController.extend({
	needs: ['notesNote'],
	newNoteName: null,
	selectedNoteBinding: 'controllers.notesNote.model',
	actions: {
		createNewNote: function() {
			var content = this.get('content');
			var newNoteName = this.get('newNoteName');
			var unique = newNoteName != null && newNoteName.length > 1;

			content.forEach(function(note) {
				if( newNoteName === note.get('name')) {
					unique = false;
					return;
				}
			});

			if( unique ) {
				var newNote = this.store.createRecord('note');
				newNote.set('id', newNoteName);
				newNote.set('name', newNoteName);
				newNote.save();

				this.set('newNoteName', null);
			} else {
				alert('Note must have a unique name of at least 2 characters.');
			}
		},

		doDeleteNote: function(note) {
			this.set('noteForDeletion', note);
			$('#confirmDeleteNoteDialog').modal('show');
		},

		doCancelDelete: function() {
			this.set('nodeForDeletion', null);
			$('#confirmDeleteNoteDialog').modal('hide');
		},

		doConfirmDelete: function() {
			var selectedNote = this.get('noteForDeletion');
			this.set('noteForDeletion', null);
			if( selectedNote ) {
				this.store.deleteRecord(selectedNote);
				selectedNote.save();

				if( this.get('controllers.notesNote.model.id') === selectedNote.get('id')) {
					this.transitionToRoute('notes');
				}

			}

			$('#confirmDeleteNoteDialog').modal('hide');
		}
	}
});

Notes.NotesNoteController = Ember.ObjectController.extend({
	actions: {
		updateNote: function() {
			var content = this.get('content');
			console.log(content);
			if(content) {
				content.save();
			}
		}
	}
});

Notes.Store = DS.Store.extend({
	adapter: DS.LSAdapter
});

Notes.Note = DS.Model.extend({
	name: DS.attr('string'),
	value: DS.attr('string'),
	introduction: function() {
		var intro = "";

		if( this.get('value') ) {
			intro = this.get('value').substring(0, 15);
		}

		return intro;
	}.property('value')
});

Notes.Duration = Ember.Object.extend({
	durationSeconds: 0,
	durationString: function(key, value) {
		if( arguments.length === 2 && value ) {
			var valueParts = value.split(":");
			if( valueParts.length === 3 ) {
				var duration = (valueParts[0] * 60 * 60) + (valueParts[1] * 60) + (valueParts[2] * 1);
				this.set('durationSeconds', duration);
			}
		}

		var duration = this.get('durationSeconds');
		var hours = Math.floor(duration / 3600);
		var minutes = Math.floor((duration - (hours * 3600)) / 60);
		var seconds = Math.floor(duration - (minutes * 60) - (hours * 3600));
		return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
	}.property('durationSeconds').cacheable()
});
