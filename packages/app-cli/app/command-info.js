const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const BaseModel = require('@joplin/lib/BaseModel').default;
const Note = require('@joplin/lib/models/Note').default;
const Folder = require('@joplin/lib/models/Folder').default;

class Command extends BaseCommand {
	usage() {
		return 'info <item>';
	}

	description() {
		return _('Displays info about the given item. Similar to `cat $n -v` but works for folders too.');
	}

	options() {
		return [];
	}

	async action(args) {
		const pattern = args['item'];

		const item = await app().loadItem('folderOrNote', pattern);
		if (!item) throw new Error(_('Cannot find "%s".', pattern));
		this.encryptionCheck(item);

		if (item.type_ === BaseModel.TYPE_FOLDER) {
			const content = await Folder.serialize(item);
			this.stdout(content);
		} else {
			const content = await Note.serialize(item);
			this.stdout(content);
		}

		app().gui().showConsole();
		app().gui().maximizeConsole();
	}
}

module.exports = Command;
