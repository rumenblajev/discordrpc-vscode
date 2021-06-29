// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const RPC = require('discord-rpc')
const rpc = new RPC.Client({
	transport: "ipc"
})

// define little status icon on the left and rpc information
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
rpc.on("ready", () => {
	rpc.setActivity({
		details: "Working on something",
		state: "instagram.com/rumenblajev_ 🖤",
		startTimestamp: new Date().getTime()
	})
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('hewo');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let StartPresenceCommand = vscode.commands.registerCommand('discord-rich-presence.StartPresenceCommand', async function () {
		rpc.destroy();
		// The code you place here will be executed every time your command is executed
		// Display a message box to the use
		try {
			
			await rpc.login({
				clientId: "859383569809014806"
			})
			statusBarItem.tooltip = "Your VS Code status is currently present and being shown in Discord"
			statusBarItem.text = "Connected to Discord 👌"
			statusBarItem.show()
			vscode.window.showInformationMessage(`Connected to Discord`)
			vscode.window.showInformationMessage(`Logged in as ${rpc.user.username}#${rpc.user.discriminator}`)
		} 
		catch(e) {
			rpc.destroy()
			statusBarItem.tooltip = "Your VS Code status is currently not present and not being shown in Discord"
			statusBarItem.text = "Couldn't connect to Discord 😢"
			statusBarItem.show()
			vscode.window.showErrorMessage("Couldn't connect to Discord")
		}
	});

	context.subscriptions.push(StartPresenceCommand);

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}