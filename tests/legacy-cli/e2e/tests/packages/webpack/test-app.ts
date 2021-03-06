import {normalize} from 'path';
import {createProjectFromAsset} from '../../../utils/assets';
import {exec} from '../../../utils/process';
import {expectFileSizeToBeUnder, replaceInFile, expectFileToMatch} from '../../../utils/fs';


export default function(skipCleaning: () => void) {
  return Promise.resolve()
    .then(() => createProjectFromAsset('webpack/test-app'))
    .then(() => exec(normalize('node_modules/.bin/webpack-cli')))
    // Note: these sizes are without Build Optimizer or any advanced optimizations in the CLI.
    .then(() => expectFileSizeToBeUnder('dist/app.main.js', 483 * 1024))
    .then(() => expectFileSizeToBeUnder('dist/0.app.main.js', 25 * 1024))
    .then(() => expectFileSizeToBeUnder('dist/1.app.main.js', 2 * 1024))
    // test resource urls without ./
    .then(() => replaceInFile('app/app.component.ts',
      './app.component.html', 'app.component.html'))
    .then(() => replaceInFile('app/app.component.ts',
      './app.component.scss', 'app.component.scss'))
    // test the inclusion of metadata
    // This build also test resource URLs without ./
    .then(() => exec(normalize('node_modules/.bin/webpack-cli'), '--mode=development'))
    .then(() => expectFileToMatch('dist/app.main.js', 'AppModuleNgFactory'))
    .then(() => skipCleaning());
}
