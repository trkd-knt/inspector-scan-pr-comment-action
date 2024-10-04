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
      //    value: "High",
      //  },
      //],
    },
  });
 
  try {
    const response = await client.send(cmd);
    return response.findings;
  } catch (error) {
    console.log(error);
  }
}
