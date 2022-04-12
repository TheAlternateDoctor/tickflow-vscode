// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const os = require('os');
var exec = require('child_process').exec;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tickflow-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tickflow.citraBuild', function () {
		let config = vscode.workspace.getConfiguration('tickflow');
		let tickompiler = config.get("tickompilerPath")
		let base = config.get("basebinPath")
		let javaVer = config.get("java16")
		let current = vscode.workspace.workspaceFolders[0].uri.path
		let file = vscode.window.activeTextEditor.document.fileName

		let delimiter = ""
		let citra = config.get("citraFolder")	//Special case for Citra, which uses a Windows var by default
		if(os.platform() == "win32"){
			citra = citra.replace('%appdata%', os.homedir+"\\appdata\\roaming")
			current = current.split('/').join('\\').replace('\\','')//I hate filepaths
			delimiter = "\\"
		}
		else if(os.platform() == "linux"){
			citra = citra.replace('%appdata%', os.homedir)
			delimiter = "/"
		}
		


		fs.access(tickompiler, fs.constants.F_OK, (err)=>{
			if(err != null)
				vscode.window.showErrorMessage("Tickompiler not found!")
		})
		fs.access(base, fs.constants.F_OK, (err)=>{
			if(err != null)
				vscode.window.showErrorMessage("base.bin not found!")
		})
		fs.access(citra, fs.constants.F_OK, (err)=>{
			if(err != null)
				vscode.window.showErrorMessage("Citra's folder does not exist!")
		})
		// //We can execute the code now
		let java =""
		if(javaVer)
			java = "java --add-opens java.base/java.lang=ALL-UNNAMED -jar "
		else
			java = "java -jar "
		let bin = '"'+current+delimiter+'bin'+delimiter+'"'
		let command = java+tickompiler+' c "'+file+'" "'+bin;
		exec(command,
		function (error, stdout, stderr) {
			vscode.window.showInformationMessage(command);
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				vscode.window.showErrorMessage("Couldn't compile!")
				console.log(error);
			}
		});
		command = java+tickompiler+' p '+bin+' '+base+' '+citra+delimiter+'sdmc'+delimiter+'rhmm'+delimiter+'C00.bin"'
		exec(command,
		function (error, stdout, stderr) {
			vscode.window.showInformationMessage(command);
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				vscode.window.showErrorMessage("Couldn't compile!")
				console.log(error);
			}
		});
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
