import { PipelineBuild } from '../interfaces/pipeline.interface';
import PipelineRepository from '../repositories/pipeline.repository';

export default class WebhookHandler {
  private generateTemplate = (templateVariables: any, configsToUse: string[], buildId: number) => {
    let templateString = `apiVersion: template.k8spipeline.io/v1
kind: K8sAppTemplate
metadata:
  name: ${templateVariables.serviceName}
spec:`;

    for (const key in templateVariables) {
      if (Object.prototype.hasOwnProperty.call(templateVariables, key)) {
        const element = templateVariables[key];
        if (element) {
          templateString += `\n  ${key}: '${element}'`;
        }
      }
    }
    templateString += `\n  imageVersion : ${buildId}`;
    templateString += `\n  configsToUse: '${configsToUse.toString()}'`;

    return templateString;
  };

  public bitbucket = async (data: any) => {
    const buildData = {
      branch: '',
      commitId: '',
      repoId: '',
      message: '',
      repoUrl: '',
    };

    const repoFullNameArray = data.repository.full_name.split('/');

    buildData.repoId = repoFullNameArray[repoFullNameArray.length - 1];

    const changes = data.push.changes[0];

    const commits = changes.commits[0];

    buildData.commitId = commits.hash;

    buildData.branch = changes.new.name;

    buildData.message = commits.message;

    buildData.repoUrl = `https://bitbucket.org/${data.repository.full_name}.git`;

    const pipelineRepo = new PipelineRepository();

    const pipelineData = await pipelineRepo.getPipelineBySlug(buildData.repoId, buildData.branch);

    const pipelineBuild: PipelineBuild = {
      commit_id: buildData.commitId,
      started_at: new Date(),
      ended_at: new Date(),
      content: '',
      pipelineUuid: pipelineData.pipeline.uuid,
      status: 'started',
      title: buildData.message,
      pipelineId: pipelineData.pipeline.id,
      branch: pipelineData.branch,
    };

    const newBuild = await pipelineRepo.createPipelineBuild(pipelineBuild, pipelineData.pipeline);

    const templateString = this.generateTemplate(pipelineData.templateVariables, pipelineData.templateConfigs, newBuild.id);

    // run build pipeline
    pipelineRepo.runBuildPipeline(newBuild, pipelineData.pipeline, buildData, templateString);
  };
}
