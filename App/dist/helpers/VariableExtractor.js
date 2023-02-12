"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>VariableExtractor
});
const _fs = _interopRequireDefault(require("fs"));
const _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let VariableExtractor = class VariableExtractor {
    constructor(){
        this.extractTemplateVariables = async (lang)=>{
            const templateVariables = {};
            return new Promise(async (resolveMain)=>{
                const files = [];
                const folders = {};
                const readFolderFiles = (folder = '')=>{
                    return new Promise((resolve)=>{
                        _fs.default.readdir(_path.default.join(__dirname, `../templates/${lang}${folder !== '' ? folder : ''}`), (err, items)=>{
                            resolve({
                                items,
                                folder
                            });
                        });
                    });
                };
                const rootFileAndFolders = await readFolderFiles();
                const getAllConfigFiles = async ()=>{
                    const getFilesInFolders = async (item, folder = '')=>{
                        const itemIsFolder = item.split('.').length === 1;
                        if (itemIsFolder) {
                            const folderName = `${folder === '' ? `/${item}` : `${folder}`}`;
                            folders[folderName] = [];
                            const fileFolder = await readFolderFiles(folderName);
                            const allPromises = [];
                            fileFolder.items.forEach((subItem)=>{
                                allPromises.push(getFilesInFolders(subItem, fileFolder.folder + '/' + subItem));
                            });
                            await Promise.all(allPromises);
                        } else {
                            const fullFilePath = `${folder !== '' ? folder : item}`;
                            if (fullFilePath.split('.')[1] === 'yaml' || fullFilePath.split('.')[1] === 'yml') {
                                files.push(fullFilePath);
                            }
                        }
                    };
                    const allPromises = [];
                    rootFileAndFolders.items.forEach((item)=>{
                        allPromises.push(getFilesInFolders(item, ''));
                    });
                    await Promise.all(allPromises).then(()=>{});
                };
                await getAllConfigFiles();
                const matchAll = (matchText)=>{
                    let finalMatches = [];
                    const regex = /\$\{.*\}/gi;
                    const matches = matchText.match(regex);
                    if (matches) {
                        for(let index = 0; index < matches.length; index++){
                            const matchItem = matches[index];
                            let matchLevel1 = matchItem.split('-');
                            if (matchLevel1.length == 1) {
                                matchLevel1 = matchItem.split('_');
                            }
                            if (matchLevel1.length == 1) {
                                matchLevel1 = matchItem.split(':');
                            }
                            const newMatch = [];
                            matchLevel1.forEach((matchItem1)=>{
                                if (matchItem1.match(regex)) {
                                    newMatch.push(matchItem1.match(regex));
                                }
                            });
                            finalMatches[index] = newMatch;
                        }
                    }
                    finalMatches = finalMatches.flat(5);
                    return finalMatches;
                };
                const readAndExtractVariable = (file)=>{
                    return new Promise((resolve)=>{
                        try {
                            _fs.default.readFile(_path.default.join(__dirname, `../templates/${lang}${file}`), {
                                encoding: 'utf-8'
                            }, function(err, data) {
                                if (!err) {
                                    try {
                                        const allMatches = matchAll(data);
                                        if (allMatches) {
                                            allMatches.forEach((variable)=>{
                                                const initialString = variable.substring(2);
                                                const property = `${initialString.substring(0, initialString.length - 1)}`;
                                                const folderName = file.split('/');
                                                folderName.pop();
                                                if (!folders[folderName.join('/')].includes(property)) {
                                                    folders[folderName.join('/')].push(property);
                                                }
                                                if (!templateVariables.hasOwnProperty(property)) {
                                                    templateVariables[property] = '';
                                                }
                                            });
                                        }
                                        resolve('done');
                                    } catch (error) {
                                        console.log(error);
                                    }
                                } else {
                                    console.log(err);
                                    resolve(null);
                                }
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    });
                };
                const extractVariableFromAllFiles = async ()=>{
                    const allPromises = [];
                    files.forEach(async (file)=>{
                        allPromises.push(readAndExtractVariable(file).then(()=>{}).catch((err)=>{
                            console.log(err);
                        }));
                    });
                    await Promise.all(allPromises).then(()=>{});
                };
                await extractVariableFromAllFiles().then(()=>{
                    resolveMain({
                        templateVariables,
                        folders
                    });
                });
            });
        };
    }
};

//# sourceMappingURL=VariableExtractor.js.map