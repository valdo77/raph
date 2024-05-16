#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const select_1 = __importDefault(require("@inquirer/select"));
const input_1 = __importDefault(require("@inquirer/input"));
const confirm_1 = __importDefault(require("@inquirer/confirm"));
const yargs_1 = __importDefault(require("yargs"));
const child = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = yargs_1.default.usage('raph init')
            .command("init", "Start template generation")
            .help(true)
            .argv;
        var template = "";
        var data = {};
        if (options['_'][0] === 'init') {
            template = yield (0, select_1.default)({
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
            data['repository_name'] = yield (0, input_1.default)({ message: 'Repository name you want to push to (let empty to refuse or use format <github_username>/<repo_name>):' });
            data['project_name'] = yield (0, input_1.default)({ message: 'Enter the project name: ' });
            if (data['project_name'] === "") {
                if (template === "fastapi") {
                    data['project_name'] = "FastApi template";
                }
                else if (template === "vuejs") {
                    data['project_name'] = "VueJS template";
                }
            }
            data['project_slug'] = data['project_name'].toLowerCase().replace(' ', '_');
            data['description'] = yield (0, input_1.default)({ message: 'Add a description to the README:' });
            if (data['description'] === "") {
                data['description'] = "My project description";
            }
            data['maintainer'] = yield (0, select_1.default)({
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
            data['as_container'] = yield (0, confirm_1.default)({ message: 'Use Docker configuration (Local containers & Cloud Run auto-deploy) ?', default: false });
            data['gcloud_project'] = yield (0, input_1.default)({ message: 'GCP Project ID targeted by deployment: ' });
            if (data['gcloud_project'] === "") {
                data['gcloud_project'] = "<GCP_PROJECT_ID>";
            }
            data['gcloud_region'] = yield (0, select_1.default)({
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
            if (template === "fastapi") {
                data['database'] = yield (0, select_1.default)({
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
            if (template === "vuejs") {
                data['navbar'] = yield (0, confirm_1.default)({ message: 'Do you want a navbar ? (Dark theme & i18n included)', default: false });
                data['sidebar'] = yield (0, confirm_1.default)({ message: 'Do you want a sidebar ?', default: false });
                data['footer'] = yield (0, confirm_1.default)({ message: 'Do you want a footer ?', default: false });
            }
            yield execPromise("git clone git@github.com:hourlier96/cookiecutter-vuejs-fastapi-template.git");
            yield execPromise("python3 -m pip install -r cookiecutter-vuejs-fastapi-template/requirements.txt");
            if (template === "fastapi") {
                fs.writeFileSync("cookiecutter-vuejs-fastapi-template/backend/cookiecutter.json", JSON.stringify(data));
                yield execPromise("cookiecutter cookiecutter-vuejs-fastapi-template/backend --no-input", true);
            }
            if (template === "vuejs") {
                fs.writeFileSync("cookiecutter-vuejs-fastapi-template/frontend/cookiecutter.json", JSON.stringify(data));
                yield execPromise("cookiecutter cookiecutter-vuejs-fastapi-template/frontend --no-input");
            }
            yield execPromise("rm -rf cookiecutter-vuejs-fastapi-template");
        }
    });
}
main();
function execPromise(cmd, print = false) {
    return new Promise((resolve, reject) => {
        const conf = child.spawn(cmd, { shell: true });
        conf.stdout.on("data", (data) => __awaiter(this, void 0, void 0, function* () {
            if (print) {
                process.stdout.write(data);
            }
        }));
        conf.addListener('close', (_) => {
            resolve(true);
        });
    });
}
