const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const BaseModel = require('@joplin/lib/BaseModel').default;
const Folder = require('@joplin/lib/models/Folder').default;
const Note = require('@joplin/lib/models/Note').default;

class Command extends BaseCommand {
	usage() {
		return 'archive <item>';
	}

	description() {
		return _('Moves the items matching <item> to the archive notebook.');
	}

	async action(args) {
		const pattern = args['item'];
		const destination = '0bcb85f154b24f00addbfb0371020df4';

		const item = await app().loadItem('folderOrNote', pattern);
		if (!item) throw new Error(_('Cannot find "%s".', pattern));
		this.encryptionCheck(item);

		if (item.type_ === BaseModel.TYPE_FOLDER) {
			await Folder.moveToFolder(item.id, destination);
		} else {
			await Note.moveToFolder(item.id, destination);
		}
	}
}

module.exports = Command;
