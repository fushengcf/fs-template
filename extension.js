// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const config = require("./src/index");

// const { resolve } = require('path');
// const { rejects } = require('assert');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "fs-template" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "fs-template.helloWorld",
     (args)=> {
      vscode.window
        .showInputBox({
          // 这个对象中所有参数都是可选参数
          password: false, // 输入内容是否是密码
          ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
          placeHolder: "请输入想要创建的文件夹名称..", // 在输入框内的提示信息
          prompt: "注意大小写规范", // 在输入框下方的提示信息
          validateInput: (text) => {
            return regex.test(text) ? null : text;
          }, // 对输入内容进行验证并返回
        })
        .then((msg) => {
          if (msg.length > 2) {
            useExtensions(args, msg)
              .then(() => {
                vscode.window.showInformationMessage("模板文件创建成功");
              })
              .catch((err) => {
                console.log("Error", err);
                new Error(err);
              });
          } else {
            vscode.window.showErrorMessage("请输入想要创建的文件夹名称");
          }
          console.log("用户输入：" + msg);
        });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

const useExtensions = (args, msg) => {
  return new Promise((resolve, reject) => {
    try {
      const path = vscode.workspace.rootPath;

      if (!path) {
        vscode.window.showErrorMessage("请先打开一个工作区！");
        reject("");
        return;
      }

      let activePath = args.path;
      if (activePath[0] === "/") {
        activePath = activePath.slice(1);
      }
      const indexJsPath = `${activePath}/${msg}/index.js`;
      const indexVuePath = `${activePath}/${msg}/index.vue`;
      const indexScssPath = `${activePath}/${msg}/index.scss`;
      const testDr = `${activePath}/${msg}`;

      if (!fs.existsSync(indexJsPath)) {
        fs.mkdirSync(testDr);
        fs.writeFileSync(indexJsPath, config.tempJs);
        fs.writeFileSync(indexVuePath, config.tempVue);
        fs.writeFileSync(indexScssPath, config.tempScss);
      } else {
        vscode.window.showErrorMessage("该目录下已存在文件！");
        reject("");
        return;
      }

      resolve("");
    } catch (error) {
      reject(new Error(error));
    }
  });
};

const regex = /^[a-z]+[A-Za-z]+$/;

module.exports = {
  activate,
  deactivate,
};
