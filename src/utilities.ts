import { Finding } from "@aws-sdk/client-inspector2";

export function CreateMarkDownContents(findings: Finding[]){
  let markdownContent = `# Vulnerability Report\n\n`;

  markdownContent += `| Title | Description | Severity | Inspector Score | Exploit Available | Fix Available |Status |\n`;
  markdownContent += `|-------|-------------|----------|-----------------|-------------------|---------------|--------|\n`;

  findings.forEach(finding => {
    markdownContent += `| ${finding.title} | ${finding.description} | ${finding.severity} | ${finding.inspectorScore} | ${finding.exploitAvailable} | ${finding.fixAvailable} |  ${finding.status} |\n`;
  });

  //findings.forEach(finding => {
  //  markdownContent += `\n### Resources for ${finding.title}\n`;
  //  markdownContent += `| Resource Type | Resource ID | Region |\n`;
  //  markdownContent += `|---------------|-------------|--------|\n`;
  //  finding.resources?.forEach(resource => {
  //    markdownContent += `| ${resource.type} | ${resource.id} | ${resource.region} |\n`;
  //  });
//
  //  if (finding.remediation) {
  //    markdownContent += `\n### Remediation for ${finding.title}\n`;
  //    markdownContent += `| Recommendation | More Info |\n`;
  //    markdownContent += `|----------------|-----------|\n`;
  //    markdownContent += `| ${finding.remediation.recommendation?.text || 'N/A'} | [Link](${finding.remediation.recommendation?.Url || '#'}) |\n`;
  //  }
//
  //  markdownContent += `\n---\n\n`;
  //});

  return markdownContent;
}
