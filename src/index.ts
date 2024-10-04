import * as core from '@actions/core';
import { PostGithubPRComment, GetGithubContexts } from './github';
import { CreateMarkDownContents } from './utilities';
import { GetVulnerabilities } from './aws';
import { Input } from './types';
import { Finding } from "@aws-sdk/client-inspector2";

async function run() {
  // input parameters
  const githubToken = core.getInput('github-token');
  const repositoryName = core.getInput('repository-name');
  const imageTag = core.getInput('image-tag');
  const region = core.getInput('region');
  const thresholdScore = core.getInput('threshold-score');
  // const repositoryName = process.env.REPOSITORY_NAME || core.getInput('repository-name');
  // const imageTag = process.env.IMAGE_TAG || core.getInput('image-tag');
  // const region = process.env.REGION || core.getInput('region');

  const input: Input = {
    repositoryName: repositoryName,
    imageTag: imageTag,
    region: region,
    thresholdScore: parseInt(thresholdScore),
  }

  // get github contexts
  const githubContexts = await GetGithubContexts(githubToken);
  // get vulnerability from inspector
  const reports = await GetVulnerabilities(input);
  console.log(reports);

  const contents = CreateMarkDownContents(reports as Finding[]);
  PostGithubPRComment(githubContexts, contents);

  core.setOutput('result', reports);
}

run();
