const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const Note = require('@joplin/lib/models/Note').default;

class Command extends BaseCommand {
	usage() {
		return 'mktodo <new-todo>';
	}

	description() {
		return _('Creates a new to-do.');
	}

	async action(args) {
		// if (!app().currentFolder()) throw new Error(_('Notes can only be created within a notebook.'));

		let note = {
			title: args['new-todo'],
			parent_id: '437a2a5f3ff7410983adadf4d119eccb', // app().currentFolder().id,
			is_todo: 1,
		};

		note = await Note.save(note);
		Note.updateGeolocation(note.id);

		// app().switchCurrentFolder(app().currentFolder());
	}
}

module.exports = Command;
