const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const BaseModel = require('@joplin/lib/BaseModel').default;
const Note = require('@joplin/lib/models/Note').default;
const Setting = require('@joplin/lib/models/Setting').default;

class Command extends BaseCommand {
	usage() {
		return 'chpos <note> <num>';
	}

	description() {
		return _(
			'Moves <note> <num> positions in its list in either direction.\n'
			+ '<num> can be a positive or negative integer.\n'
			+ '\n'
			+ '"position" is synonymous with "index":\n'
			+ ' - A negative number moves the note visually higher on the list (lower index).\n'
			+ ' - A positive number moves the note visually lower on the list (higher index).\n'
			+ '\n'
			+ 'This command always operates on the positions of the notes in the current view.\n'
			+ 'Sort order (ASC/DESC) is ignored when changing a note\'s position.\n'
			+ 'However, the underlying index of the notes within the list remains consistent, '
			+ 'so sort direction is honored when presenting the list.\n'
			+ '\n'
			+ 'This command requires "notes.sortOrder.field=order" and "uncompletedTodosOnTop=false", and will prompt you to update these setting if necessary.'
		);
	}

	async action(args) {
		if (Setting.value('notes.sortOrder.field') !== 'order' || Setting.value('uncompletedTodosOnTop')) {
			const ok = await this.prompt(_('Custom order requires notes.sortOrder.field=order and uncompletedTodosOnTop=false. Set these now?'), { booleanAnswerDefault: 'n' });
			if (!ok) return;
			Setting.setValue('notes.sortOrder.field', 'order');
			Setting.setValue('uncompletedTodosOnTop', false);
		}

		const noteIdentifier = args['note'];
		const note = await app().loadItem(BaseModel.TYPE_NOTE, noteIdentifier);
		if (!note) throw new Error(_('Cannot find "%s".', noteIdentifier));
		this.encryptionCheck(note);

		let relativePosition = parseInt(args['num'], 10);
		const orderReversed = Setting.value('notes.sortOrder.reverse');
		if (orderReversed) relativePosition = -relativePosition;
		await Note.updatePosition(note, relativePosition);
	}
}

module.exports = Command;
