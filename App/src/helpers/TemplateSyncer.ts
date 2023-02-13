import shell from 'shelljs';
import path from 'path';
import { TEMPLATE_CONFIG_REPO_URL, TEMPLATE_SYNC_INTERVAL } from '@/config';

export default class TemplateSyncer {
  public syncRemoteFiles = () => {
    const configFolder = path.join(__dirname, `../`);

    // clone config repo on initiation
    shell.cd(configFolder).exec(`git clone ${TEMPLATE_CONFIG_REPO_URL} templates`);

    // sync repo in interval
    setInterval(async () => {
      shell.cd(configFolder).exec(`cd templates && git pull origin main && cd ..`);
    }, 1000 * parseInt(TEMPLATE_SYNC_INTERVAL));
  };
}
