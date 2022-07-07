const core = require('@actions/core');
const wait = require('./wait');

async function filterJobs() {
  
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const orchestratorInstanceUrl = core.getInput('orchestratorInstanceUrl');
    const orchestratorApplicationId = core.getInput('orchestratorApplicationId');
    const orchestratorApplicationSecret = core.getInput('orchestratorApplicationSecret');
    const orchestratorApplicationScope = core.getInput('orchestratorApplicationScope');
    const orchestratorTenant = core.getInput('orchestratorTenant');
    const orchestratorOrganization = core.getInput('orchestratorOrganization');

    const URL_Join = (...args) =>
      args
        .join('/')
        .replace(/[\/]+/g, '/')
        .replace(/^(.+):\//, '$1://')
        .replace(/^file:/, 'file:/')
        .replace(/\/(\?|&|#[^!])/g, '$1')
        .replace(/\?/g, '&')
        .replace('&', '?');

    const authTokenUrl = URL_Join(orchestratorInstanceUrl,'identity_','connect','token'); 
    const getJobsUrl = URL_Join(orchestratorInstanceUrl,orchestratorOrganization,orchestratorTenant,'orchestrator_','odata','Jobs');
    const stopJobsUrl = URL_Join(orchestratorInstanceUrl,orchestratorOrganization,orchestratorTenant,'orchestrator_','odata','Jobs','UiPath.Server.Configuration.Odata.StopJobs');
    
    
    //{{cloudUrl}}/identity_/connect/token


    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    //{{cloudUrl}}/{{cloudOrg}}/{{cloudTenant}}/orchestrator_/odata/folders
    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
