const vscode = require('vscode');
const RPC = require('discord-rpc')
const rpc = new RPC.Client({
	transport: "ipc"
})

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
rpc.on("ready", () => {
	rpc.setActivity({
		largeImageKey: "idle",
		details: "Working on something",
		state: "instagram.com/rumenblajev_ 🖤",
		startTimestamp: new Date().getTime()
	})
});

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('discord-rich-presence.StartPresenceCommand', async function () {
		rpc.destroy();
		try {
			await rpc.login({
				clientId: "859383569809014806"
			})
			statusBarItem.tooltip = "Your VS Code status is currently present and being shown in Discord"
			statusBarItem.text = "Connected to Discord 👌"
			statusBarItem.show()
			// vscode.window.showInformationMessage(`Connected to Discord`)
			// vscode.window.showInformationMessage(`Logged in as ${rpc.user.username}#${rpc.user.discriminator}`)
		} 
		catch(e) {
			rpc.destroy()
			statusBarItem.tooltip = "Your VS Code status is currently not present and not being shown in Discord"
			statusBarItem.text = "Couldn't connect to Discord 😢"
			statusBarItem.show()
			vscode.window.showErrorMessage("Couldn't connect to Discord")
		}
	}));
	vscode.commands.executeCommand('discord-rich-presence.StartPresenceCommand')
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}