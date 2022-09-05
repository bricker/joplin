const childProcess = require('node:child_process');
const { BaseCommand } = require('./base-command.js');
const { app } = require('./app.js');
const { splitCommandString } = require('@joplin/lib/string-utils.js');
const { _ } = require('@joplin/lib/locale');
const BaseModel = require('@joplin/lib/BaseModel').default;
const Setting = require('@joplin/lib/models/Setting').default;

class Command extends BaseCommand {
	usage() {
		return 'clip <note>';
	}

	description() {
		return _('Copies the contents of <note> to the system clipboard.');
	}

	async action(args) {
		const id = args['note'];

		const item = await app().loadItem(BaseModel.TYPE_NOTE, id);
		if (!item) throw new Error(_('Cannot find "%s".', id));
		this.encryptionCheck(item);

		const clipboardManagerPath = (() => {
			if (Setting.value('clipboardManager')) return Setting.value('clipboardManager');
			if (process.env.CLIPBOARD_MANAGER) return process.env.CLIPBOARD_MANAGER;
			throw new Error(_('No clipboard manager is defined. Please set it using `config clipboardManager <clipboard-manager-path>` or with environment variable `CLIPBOARD_MANAGER`'));
		})();

		const programArgs = splitCommandString(clipboardManagerPath);
		const programPath = programArgs.shift();

		const proc = childProcess.spawn(programPath, programArgs);
		proc.stdin.write(item.body);
		proc.stdin.end();
	}
}

module.exports = Command;
