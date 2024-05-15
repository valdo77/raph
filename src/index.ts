#! /usr/bin/env node

import select from '@inquirer/select';
import input from '@inquirer/input';
import confirm from '@inquirer/confirm';
import yargs from 'yargs';
import * as child from 'child_process';
import * as fs from 'fs';


async function main() {

  const options:any = yargs.usage('raph init')
  .command("init", "Start template generation")
  .help(true)
  .argv;

  var template = "";
  var data:any = {};



  if(options['_'][0] === 'init') {

    template =  await select({
      message: 'Which template do you want to use ?:',
      default: 'fastapi',
      choices: [
        {
          name: 'Fastapi',
          value: 'fastapi',
          description: 'npm is the most popular package manager',
        },
        {
          name: 'Vuejs',
          value: 'vuejs',
          description: 'yarn is an awesome package manager',
        },
      ],
    });

    data['repository_name'] = await input({ message: 'Repository name you want to push to (let empty to refuse or use format <github_username>/<repo_name>):'});
    data['project_name'] = await input({ message: 'Enter the project name: '});
    if(data['project_name'] === ""){
      if(template === "fastapi") {
        data['project_name'] = "FastApi template";
      } else if(template === "vuejs") {
        data['project_name'] = "VueJS template";
      }
    }

    data['project_slug'] = data['project_name'].toLowerCase().replace(' ', '_');
    data['description'] = await input({ message: 'Add a description to the README:'});
    if(data['description'] === ""){
      data['description'] = "My project description";
    }

    data['maintainer'] = await select({
      message: 'Select the main maintainer of the project:',
      default: 'Digital Lab <fr.dgc.ops.dgtl@devoteamgcloud.com>',
      choices: [
        {
          name: 'Digital Lab <fr.dgc.ops.dgtl@devoteamgcloud.com>',
          value: 'Digital Lab <fr.dgc.ops.dgtl@devoteamgcloud.com>',
        },
        {
          name: 'Augustin Hourlier <augustin.hourlier@devoteamgcloud.com>',
          value: 'Augustin Hourlier <augustin.hourlier@devoteamgcloud.com>',
        },
        {
          name: 'Valdo Negou <valdo.negou.tawembe@devoteamgcloud.com>',
          value: 'Valdo Negou <valdo.negou.tawembe@devoteamgcloud.com>',
        },
      ],
    });

    data['as_container'] = await confirm({ message: 'Use Docker configuration (Local containers & Cloud Run auto-deploy) ?', default: false });
    data['gcloud_project'] = await input({ message: 'GCP Project ID targeted by deployment: '});
    if(data['gcloud_project'] === ""){
      data['gcloud_project'] = "<GCP_PROJECT_ID>";
    }

    data['gcloud_region'] = await select({
      message: 'In which region will resources be deployed ?',
      default: 'europe-west9',
      choices: [
        {
          name: 'europe-west9',
          value: 'europe-west9',
          description: 'Paris',
        },
        {
          name: 'europe-west1',
          value: 'europe-west1',
          description: 'Belgium',
        },
        {
          name: 'europe-west2',
          value: 'europe-west2',
          description: 'London',
        },
      ],
    });

    if(template === "fastapi") {
      data['database'] = await select({
        message: 'Select the type of database you need:',
        default: 'europe-west9',
        choices: [
          {
            name: 'PostgreSQL',
            value: 'PostgreSQL',
          },
          {
            name: 'Firestore',
            value: 'Firestore',
          },
          {
            name: 'Both',
            value: 'Both',
          },
        ],
      });
    }

    if(template === "vuejs") {
      data['navbar'] = await confirm({ message: 'Do you want a navbar ? (Dark theme & i18n included)', default: false });
      data['sidebar'] = await confirm({ message: 'Do you want a sidebar ?', default: false });
      data['footer'] = await confirm({ message: 'Do you want a footer ?', default: false });
    }

    await execPromise("git clone git@github.com:hourlier96/cookiecutter-vuejs-fastapi-template.git");
    await execPromise("python3 -m pip install -r cookiecutter-vuejs-fastapi-template/requirements.txt");

    if(template === "fastapi") {
      fs.writeFileSync("cookiecutter-vuejs-fastapi-template/backend/cookiecutter.json", JSON.stringify(data));
      await execPromise("cookiecutter cookiecutter-vuejs-fastapi-template/backend --no-input", true);
    }

    if(template === "vuejs") {
      fs.writeFileSync("cookiecutter-vuejs-fastapi-template/frontend/cookiecutter.json", JSON.stringify(data));
      await execPromise("cookiecutter cookiecutter-vuejs-fastapi-template/frontend --no-input");
    }
    await execPromise("rm -rf cookiecutter-vuejs-fastapi-template");

  }



}

main();


function execPromise (cmd:string, print: boolean = false) {
    return new Promise((resolve, reject) => {
        const conf = child.spawn(cmd, {shell: true});

        conf.stdout.on("data", async (data) => {
          if(print) {
            process.stdout.write(data);
          }
        });

        conf.addListener('close', (_) => {
            resolve(true);
        })
    });

}