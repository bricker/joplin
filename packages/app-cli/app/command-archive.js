const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const BaseModel = require('@joplin/lib/BaseModel').default;
const Folder = require('@joplin/lib/models/Folder').default;
const Note = require('@joplin/lib/models/Note').default;
const Setting = require('@joplin/lib/models/Setting').default;

class Command extends BaseCommand {
	usage() {
		return 'archive <item>';
	}

	description() {
		return _('Moves the items matching <item> to the archive notebook.');
	}

	async action(args) {
		const pattern = args['item'];

		const item = await app().loadItem('folderOrNote', pattern);
		if (!item) throw new Error(_('Cannot find "%s".', pattern));
		this.encryptionCheck(item);

		const archiveFolderName = Setting.value('archiveFolderName');
		let archive = await app().loadItem(BaseModel.TYPE_FOLDER, archiveFolderName);
		if (!archive) {
			archive = await Folder.save({
				title: archiveFolderName,
			}, { userSideValidation: true });
		}

		const newItem = {
			id: item.id,
			title: `.${item.title}`,
			type_: item.type_,
			parent_id: archive.id,
		};

		if (item.type_ === BaseModel.TYPE_FOLDER) {
			await Folder.save(newItem);
		} else {
			await Note.save(newItem);
		}
	}
}

module.exports = Command;
