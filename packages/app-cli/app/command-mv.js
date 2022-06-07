const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const BaseModel = require('@joplin/lib/BaseModel').default;
const Folder = require('@joplin/lib/models/Folder').default;
const Note = require('@joplin/lib/models/Note').default;

class Command extends BaseCommand {
	usage() {
		return 'mv <item> [notebook]';
	}

	description() {
		return _('Moves the items matching <item> to [notebook].');
	}

	async action(args) {
		const pattern = args['item'];
		const destination = args['notebook'];

		const folder = await Folder.loadByField('title', destination);
		if (!folder) throw new Error(_('Cannot find "%s".', destination));

		const items = await app().loadItems('folderOrNote', pattern);
		if (!items.length) throw new Error(_('Cannot find "%s".', pattern));

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			this.encryptionCheck(item);

			if (item.type_ === BaseModel.TYPE_FOLDER) {
				await Folder.moveToFolder(item.id, folder.id);
			} else {
				await Note.moveToFolder(item.id, folder.id);
			}
		}
	}
}

module.exports = Command;
