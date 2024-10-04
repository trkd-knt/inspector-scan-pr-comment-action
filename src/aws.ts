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
      inspectorScore: [
        {
          lowerInclusive: Number(input.thresholdScore),
        },
      ],
    },
  });
 
  const maxRetries = 10; // Maximum number of retries
  const waitTime = 30000; // Wait time in milliseconds (30 seconds)
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.send(cmd);
      // Check finding counts
      if (response.findings?.length === 0) {
        // Log the attempt number and wait before retrying
        console.log(`Attempt ${attempt + 1}: No findings found. Retrying in 30 seconds...`);
        await delay(waitTime); // Wait for 30 seconds before retrying
        continue; // Retry
      }
      // Sort by score
      response.findings?.sort((a, b) => {
        if (a.inspectorScore === b.inspectorScore) {
          return 0;
        }
        if (a.inspectorScore === undefined) return 1;
        if (b.inspectorScore === undefined) return -1;
        return a.inspectorScore > b.inspectorScore ? -1 : 1;
      });
      return response.findings; // Return findings if found
    } catch (error) {
      console.log(`Attempt ${attempt + 1}: Error occurred - ${error.message}`);
      // Wait before retrying in case of an error (optional)
      await delay(waitTime);
    }
  }

  console.log("Maximum attempts reached. No findings found.");
  return []; // Return an empty array if maximum attempts are reached without findings
}

// Helper function to create a delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
