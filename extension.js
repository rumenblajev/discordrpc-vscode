const vscode = require('vscode');
const RPC = require('discord-rpc')
const rpc = new RPC.Client({
	transport: "ipc"
})

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
var startTime = new Date().getTime();

rpc.on("ready", () => {
	rpc.setActivity({
		largeImageKey: "idle",
		details: "Working on something",
		state: "instagram.com/rumenblajev_ 🖤",
		startTimestamp: startTime
	})
});

let rpcOn = false;
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	// Start Command
	context.subscriptions.push(vscode.commands.registerCommand('discord-rich-presence.StartPresenceCommand', async function () {
		try {
			await rpc.login({
				clientId: "859383569809014806"
			})
			rpcOn = true;
			statusBarItem.tooltip = "Your VS Code status is currently present and being shown in Discord"
			statusBarItem.text = "Connected to Discord 👌"
			statusBarItem.show()
			// vscode.window.showInformationMessage(`Connected to Discord`)
			// vscode.window.showInformationMessage(`Logged in as ${rpc.user.username}#${rpc.user.discriminator}`)
		} 
		catch(notConnectedToDiscordErr) {
			if(rpcOn){
				rpc.destroy()
				rpcOn = !rpcOn;
			}
			
			statusBarItem.tooltip = "Your VS Code status is currently not present and not being shown in Discord"
			statusBarItem.text = "Couldn't connect to Discord 😢"
			statusBarItem.show()
			vscode.window.showErrorMessage("Couldn't connect to Discord")
		}
	}));
	// Start Command End


	// Stop Command
	context.subscriptions.push(vscode.commands.registerCommand('discord-rich-presence.StopPresenceCommand', async function () {
		if(rpcOn){
			try {
				statusBarItem.tooltip = "Disabled Presence"
				statusBarItem.text = "Presence Disabled"
				statusBarItem.show()
				rpc.destroy();
				rpcOn = !rpcOn;
			} catch(rpcDisabledErr) {
				rpcOn = false;
			}
			
		}
	}));
	// Stop Command End

	// Reload Command
	context.subscriptions.push(vscode.commands.registerCommand('discord-rich-presence.ReloadPresenceCommand', async function () {
		if(rpcOn){
			vscode.commands.executeCommand('discord-rich-presence.StopPresenceCommand')
			vscode.commands.executeCommand('discord-rich-presence.StartPresenceCommand')	
		}
		else {
			vscode.commands.executeCommand('discord-rich-presence.StartPresenceCommand')
		}
		
	}));
	// Reload Command End

	vscode.commands.executeCommand('discord-rich-presence.StartPresenceCommand')
}

function deactivate() {
	vscode.commands.executeCommand('discord-rich-presence.StopPresenceCommand')
}

module.exports = {
	activate,
	deactivate
}