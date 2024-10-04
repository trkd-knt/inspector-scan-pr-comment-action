import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';

export type Contexts = {
  octokit: Octokit;
  gitContext: typeof github.context;
}

export type Input = {
  repositoryName: string;
  imageTag: string;
  region: string;
}