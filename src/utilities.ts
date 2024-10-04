import { Finding } from "@aws-sdk/client-inspector2";

export function CreateMarkDownContents(findings: Finding[]) {
  let markdownContent = `# Vulnerability Report\n\n`;

  let summaryContent = `## Summary\n\n`;
  summaryContent += `| Title | Severity | Inspector Score |\n`;
  summaryContent += `|-------|----------|-----------------|\n`;

  let detailsContent = `## Details\n\n`;

  findings.forEach(finding => {
    summaryContent += `| ${finding.title ?? "N/A"} | ${finding.severity ?? "N/A"} | ${finding.inspectorScore ?? "N/A"} |\n`;

    const vendorUpdatedAtJST = finding.packageVulnerabilityDetails?.vendorUpdatedAt
    ? new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(finding.packageVulnerabilityDetails.vendorUpdatedAt))
    : "N/A";
    let childContent = `| VulnerabilityId | Source | VendorSeverity | CVSS | SourceUrl | UpdatedAt |\n`;
    childContent += `|----------------|--------|----------------|------|-----------|-----------|\n`;
    childContent += `| ${finding.packageVulnerabilityDetails?.vulnerabilityId ?? "N/A"} | ${finding.packageVulnerabilityDetails?.source ?? "N/A"} | ${finding.packageVulnerabilityDetails?.vendorSeverity ?? "N/A"} | ${finding.packageVulnerabilityDetails?.cvss?.[0]?.baseScore ?? "N/A"} | ${finding.packageVulnerabilityDetails?.sourceUrl ?? "N/A"} | ${vendorUpdatedAtJST} |\n`;
    
    childContent += `\n<details><summary>Vulnerability Description</summary>\n\n`;

    const formattedDescription = finding.description ?? "No description available.";
    childContent += "```\n" + formattedDescription + "\n```\n</details>\n\n";
    
    detailsContent += childContent;
  });

  markdownContent += summaryContent + `\n\n`;
  markdownContent += detailsContent;

  return markdownContent;
}
