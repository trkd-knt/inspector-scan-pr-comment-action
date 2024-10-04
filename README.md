# AWS Inspector Scan PR Comment Action

This GitHub Action integrates with AWS Inspector to fetch vulnerability reports for a given image and posts a summary as a comment on the related Pull Request (PR). The action supports filtering based on a threshold score and generates a markdown table for easy visualization of the vulnerabilities.

## Features
* Fetches vulnerability findings from AWS Inspector.
* Posts a comment on a GitHub Pull Request with a summary of the findings.
* Filters vulnerabilities by a specified threshold score.
* Auto-updates comments to avoid duplicate postings.

## Inputs

|Input Name	|Description	|Required	|Default|
|-----------|---------------|-----------|-------|
|github-token	|The GitHub token used to post the PR comment.	|true	|N/A|
|repository-name	|The name of the repository being scanned.	|true	|N/A|
|image-tag	|The tag of the Docker image being scanned for vulnerabilities.	|true	|latest|
|region	|The AWS region where the Inspector service is being used.	|true	| ap-northeast-1|
|threshold-score	|The minimum score of vulnerabilities to be included in the report.	|false|	7.0|

## Outputs

|Output Name|	Description|
|-----------|---------------|
|result	|The list of vulnerabilities found.|

## Usage Example

```
name: AWS Inspector Scan PR Comment

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main
      - develop

permissions:
  id-token: write
  contents: read
  pull-requests: write
  issues: write

jobs:
  inspector-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: [role-name]
          role-session-name: deploy-role-session
          aws-region: ap-northeast-1

      - name: Run AWS Inspector Scan and Comment
        uses: ./path-to-your-action
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          repository-name: my-repository
          image-tag: latest
          region: ap-northeast-1
          threshold-score: 7
```
