import { Inspector2Client, ListFindingsCommand, StringComparison } from "@aws-sdk/client-inspector2";

import { Input } from './types';

export async function GetVulnerabilities(input: Input) {

  const client = new Inspector2Client({ region: input.region });

  const cmd = new ListFindingsCommand({
    maxResults: 50,
    filterCriteria: {
      ecrImageRepositoryName: [
        {
          comparison: StringComparison.EQUALS,
          value: input.repositoryName,
        },
      ],
      ecrImageTags: [
        {
          comparison: StringComparison.EQUALS,
          value: input.imageTag,
        },
      ],
      //severity: [
      //  {
      //    comparison: StringComparison.EQUALS,
      //    value: "HIGH",
      //  },
      //],
    },
  });
 
  try {
    const response = await client.send(cmd);
    // sort by severity
    response.findings?.sort((a, b) => {
      if (a.severity == b.severity) {
        return 0;
      }
      if (a.severity === undefined) return 1;
      if (b.severity === undefined) return -1;
      return a.severity > b.severity ? -1 : 1;
    });
    return response.findings;
  } catch (error) {
    console.log(error);
  }
}
