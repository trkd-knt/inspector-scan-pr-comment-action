import { Finding } from "@aws-sdk/client-inspector2";

export function CreateMarkDownContents(findings: Finding[]) {
  let markdownContent = `# Vulnerability Report\n\n`;

  let summaryContent = `| Title | Severity | Inspector Score | Updated At |\n`;
  summaryContent += `|-------|----------|-----------------|------------|\n`;

  let detailsContent = "";

  findings.forEach(finding => {
    summaryContent += `| ${finding.title ?? "N/A"} | ${finding.severity ?? "N/A"} | ${finding.inspectorScore ?? "N/A"} | ${finding.updatedAt ?? "N/A"} |\n`;

    let childContent = `| VulnerabilityId | Source | VendorSeverity | CVSS | SourceUrl | UpdatedAt |\n`;
    childContent += `|----------------|--------|----------------|------|-----------|-----------|\n`;
    childContent += `| ${finding.packageVulnerabilityDetails?.vulnerabilityId ?? "N/A"} | ${finding.packageVulnerabilityDetails?.source ?? "N/A"} | ${finding.packageVulnerabilityDetails?.vendorSeverity ?? "N/A"} | ${finding.packageVulnerabilityDetails?.cvss ?? "N/A"} | ${finding.packageVulnerabilityDetails?.sourceUrl ?? "N/A"} | ${finding.packageVulnerabilityDetails?.vendorUpdatedAt ?? "N/A"} |\n`;
    
    childContent += `\n<details><summary>Vulnerability Description</summary>\n\n`;
    childContent += "```\n" + (finding.description ?? "No description available.") + "\n```\n</details>\n\n";
    
    detailsContent += childContent;
  });

  markdownContent += summaryContent;
  markdownContent += detailsContent;

  return markdownContent;
}
