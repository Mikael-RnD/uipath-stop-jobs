const core = require('@actions/core');
const wait = require('./wait');
const inputs = new Inputs(core.getInput('orchestratorInstanceUrl')
  ,core.getInput('orchestratorApplicationId')
  ,core.getInput('orchestratorApplicationSecret')
  ,core.getInput('orchestratorOrganization')
  ,core.getInput('orchestratorApplicationScope')
  ,core.getInput('orchestratorTenant')
  ,core.getInput('machineKey'));

async function filterJobs(jobs, machineKey) {
  //if(state)
  //return list of job ids where state is running or pending and LicenseKey=machineKey
}

class Inputs {
  constructor(orchestratorInstanceUrl
    ,orchestratorApplicationId
    ,orchestratorApplicationSecret
    ,orchestratorOrganization
    ,orchestratorApplicationScope
    ,orchestratorTenant
    ,machineKey) {
      this.orchestratorInstanceUrl = orchestratorInstanceUrl;
      this.orchestratorApplicationId = orchestratorApplicationId;
      this.orchestratorApplicationSecret = orchestratorApplicationSecret;
      this.orchestratorApplicationScope = orchestratorApplicationScope;
      this.orchestratorTenant = orchestratorTenant;
      this.orchestratorOrganization = orchestratorOrganization;
      this.machineKey = machineKey;
  }


  getInputs() {
    return {
      orchestratorInstanceUrl:this.orchestratorInstanceUrl
      ,orchestratorApplicationId:this.orchestratorApplicationId
      ,orchestratorApplicationSecret:this.orchestratorApplicationSecret
      ,orchestratorApplicationScope:this.orchestratorApplicationScope
      ,orchestratorOrganization:this.orchestratorOrganization
      ,orchestratorTenant:this.orchestratorTenant
      ,machineKey:this.machineKey
    }
  }
}

async function generateAuthToken(authTokenUrl){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: inputs.getInputs("orchestratorApplicationId"),
      client_secret: inputs.getInputs("orchestratorApplicationSecret"),
      scope: inputs.getInputs("orchestratorApplicationScope")
    })
  };
  
  fetch(authTokenUrl, requestOptions)
    .then(response => response.text())
    .then(result => result)
    .catch(error => console.log('error', error));
}

async function getJobs(getJobsUrl,authResult,folderId) {

  var myHeaders = new Headers();
  myHeaders.append("X-UIPATH-OrganizationUnitId", "5");
  myHeaders.append("Authorization", "Bearer "+ authResult.access_token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var jobsResult;
  fetch(getJobsUrl, requestOptions)
    .then(response => response.text())
    .then(result => ())
    .catch(error => console.log('error', error));

}

async function getFolders(getFoldersUrl, authResult) {
  //Hämtar id från varje mapp
}

async function stopJobs(stopJobsUrl) {

}

// most @actions toolkit packages have async methods
async function run() {
  try {

    
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
    const authResult = await generateAuthToken(authTokenUrl);

    const getFoldersUrl = URL_Join(orchestratorInstanceUrl,orchestratorOrganization,orchestratorTenant,'orchestrator_','odata','Folders');
    const getFoldersResult = await getFolders(getFoldersUrl,authResult);


    const getJobsUrl = URL_Join(orchestratorInstanceUrl,orchestratorOrganization,orchestratorTenant,'orchestrator_','odata','Jobs');
    
    //for each över lista med mapp-id
    const getJobsResults = getFoldersResult.foreach(folder => await getJobs(getJobsUrl,authResult,folder) )

    const filteredJobs = await filterJobs(getJobsResult,);
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
