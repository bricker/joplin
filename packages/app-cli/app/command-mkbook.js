const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { _ } = require('@joplin/lib/locale');
const Folder = require('@joplin/lib/models/Folder').default;

class Command extends BaseCommand {
	usage() {
		return 'mkbook <new-notebook>';
	}

	description() {
		return _('Creates a new notebook.');
	}

	async action(args) {
		// let parentId;

		// const parentNotebookIdentifier = args['parent-notebook'];
		// if (parentNotebookIdentifier) {
		// 	const parentFolder =
		// 		(await Folder.loadByField('title', parentNotebookIdentifier)) ||
		// 		(await Folder.loadByField('id', parentNotebookIdentifier));

		// 	if (!parentFolder) {
		// 		throw new Error(('Cannot find notebook "%s".', parentNotebookIdentifier));
		// 	}
		// 	parentId = parentFolder.id;
		// }

		const folder = await Folder.save({ title: args['new-notebook'] }, { userSideValidation: true });
		app().switchCurrentFolder(folder);
	}
}

module.exports = Command;
