
import { Contexts } from './types';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';

export async function GetGithubContexts(githubToken: string): Promise<Contexts> {
  const context = github.context;
  const octokit = new Octokit({ auth: githubToken });

  const contexts: Contexts = {
    octokit: octokit,
    gitContext: context,
  };

  return contexts;
}

export async function PostGithubPRComment(githubToken: string, input: Contexts, contents: string) {

  const octokit = new Octokit();
  try {
    const { owner, repo } = input.gitContext.repo;
    const pull_number = input.gitContext.issue.number == undefined ? 4 : input.gitContext.issue.number;

    const comments = await octokit.rest.issues.listComments({
      owner: owner,
      repo: repo,
      issue_number: pull_number
    });

    console.log('list comments status : ' + comments.status);
    console.log(comments.data);

    const searchString = "[[this comment is create by github atcions c6856956214ab4a9b4da8d436185b983]]";

    const filtered_comment = comments.data.filter((comment) => {
      return comment.body?.includes(searchString)
    })
    
    console.log('filtered_comment : ' + filtered_comment.length);

    if (filtered_comment.length == 0) {
      console.log('No comment found');
      octokit.rest.issues.createComment({
        owner: input.gitContext.repo.owner,
        repo: input.gitContext.repo.repo,
        issue_number: pull_number,
        body: contents + '\n' + searchString,
      });
    }
    else{
      console.log('Comment found');
      octokit.rest.issues.updateComment({
        owner: owner,
        repo: repo,
        issue_number: pull_number,
        comment_id: filtered_comment[0].id,
        body: contents + '\n' + searchString,
      })
    }
  }
  catch (error) {
    if (error instanceof Error) throw new Error(`Error adding comment: ${error}`);
  }
  return;
}