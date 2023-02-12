import fs from 'fs';
import path from 'path';

export default class VariableExtractor {
  public extractTemplateVariables = async (lang: string): Promise<{ templateVariables: any; folders: any }> => {
    const templateVariables = {};

    return new Promise(async resolveMain => {
      const files = [];

      const folders = {};

      const readFolderFiles = (folder = '') => {
        return new Promise(resolve => {
          fs.readdir(path.join(__dirname, `../templates/${lang}${folder !== '' ? folder : ''}`), (err, items) => {
            resolve({
              items,
              folder,
            });
          });
        });
      };

      const rootFileAndFolders: any = await readFolderFiles();

      const getAllConfigFiles = async () => {
        const getFilesInFolders = async (item, folder = '') => {
          const itemIsFolder = item.split('.').length === 1;

          if (itemIsFolder) {
            const folderName = `${folder === '' ? `/${item}` : `${folder}`}`;

            folders[folderName] = [];

            const fileFolder: any = await readFolderFiles(folderName);

            const allPromises = [];

            fileFolder.items.forEach(subItem => {
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

        rootFileAndFolders.items.forEach(item => {
          allPromises.push(getFilesInFolders(item, ''));
        });

        await Promise.all(allPromises).then(() => {
          // console.log(files);
        });
      };

      await getAllConfigFiles();

      const matchAll = (matchText: string) => {
        let finalMatches = [];

        const regex = /\$\{.*\}/gi;
        const matches = matchText.match(regex);

        if (matches) {
          for (let index = 0; index < matches.length; index++) {
            const matchItem = matches[index];

            let matchLevel1 = matchItem.split('-');
            if (matchLevel1.length == 1) {
              matchLevel1 = matchItem.split('_');
            }
            if (matchLevel1.length == 1) {
              matchLevel1 = matchItem.split(':');
            }

            const newMatch = [];

            matchLevel1.forEach(matchItem1 => {
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

      const readAndExtractVariable = (file: string) => {
        return new Promise(resolve => {
          try {
            fs.readFile(path.join(__dirname, `../templates/${lang}${file}`), { encoding: 'utf-8' }, function (err, data) {
              if (!err) {
                try {
                  const allMatches = matchAll(data);

                  if (allMatches) {
                    allMatches.forEach(variable => {
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

      const extractVariableFromAllFiles = async () => {
        const allPromises = [];

        files.forEach(async file => {
          allPromises.push(
            readAndExtractVariable(file)
              .then(() => {
                //
              })
              .catch(err => {
                console.log(err);
              }),
          );
        });
        await Promise.all(allPromises).then(() => {
          //
        });
      };

      await extractVariableFromAllFiles().then(() => {
        resolveMain({
          templateVariables,
          folders,
        });
      });
    });
  };
}
