// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export const metricDetails = [
  {
    metric: 'documentation',
    key: 'documentation',
    score: -1,
    metricInfo: [
      {
        key: 'adopters',
        label: 'Adopters',
        description: 'List of organizations using this project in production or at stages of testing',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-building'
      },
      {
        key: 'changelog',
        label: 'Changelog',
        description: 'A curated, chronologically ordered list of notable changes for each version',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-file-alt'
      },
      {
        key: 'codeOfConduct',
        label: 'Code of conduct',
        description:
          'Adopt a code of conduct to define community standards, signal a welcoming and inclusive project, and outline procedures for handling abuse',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'fal fa-pen-fancy'
      },
      {
        key: 'contributing',
        label: 'Contributing',
        description: 'A contributing file in your repository provides potential project contributors with a short guide to how they can help with your project',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-laptop-code'
      },
      {
        key: 'governance',
        label: 'Governance',
        description: ' Document that explains how the governance and committer process works in the repository',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-diploma'
      },
      {
        key: 'maintainers',
        label: 'Maintainers',
        description: 'The maintainers file contains a list of the current maintainers of the repository',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-user-cog'
      },
      {
        key: 'readme',
        label: 'Readme',
        description:
          'The readme file introduces and explains a project. It contains information that is commonly required to understand what the project is about',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-book-open'
      },
      {
        key: 'website',
        label: 'Website',
        description: 'A url that users can visit to learn more about your project',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-globe'
      },
      {
        key: 'details',
        type: 'list',
        data: ['Checks reference documentation', 'Recommended templates: CONTRIBUTING.md and GOVERNANCE.md.']
      }
    ]
  },
  {
    metric: 'license',
    key: 'license',
    score: -1,
    metricInfo: [
      {
        key: 'licenseApproved',
        label: 'Approved license',
        description: 'Whether the repository uses an approved license or not',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-check-double'
      },
      {
        key: 'licenseScanning',
        label: 'License scanning',
        description: 'License scanning software scans and automatically identifies, manages and addresses open source licensing issues',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-stamp'
      },
      {
        key: 'licenseSpdxId',
        label: 'Apache-2.0',
        description: `The LICENSE file contains the repository's license`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-balance-scale'
      },
      {
        key: 'details',
        type: 'list',
        data: ['Checks reference documentation']
      }
    ]
  },
  {
    metric: 'best practices',
    key: 'best-practices',
    score: -1,
    metricInfo: [
      {
        key: 'analytics',
        label: 'Analytics',
        description: 'Projects websites should provide some web analytics',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-chart-bar'
      },
      {
        key: 'artifactHubBadge',
        label: 'Artifact Hub badge',
        description: 'Projects can list their content on Artifact Hub to improve their discoverability',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-hexagon'
      },
      {
        key: 'contributorLicenseAgreement',
        label: 'Contributor License Agreement',
        description: `Defines the terms under which intellectual property has been contributed to a company/project`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-file-medical-alt'
      },
      {
        key: 'communityMeeting',
        label: 'Community meeting',
        description: `Community meetings are often held to engage community members, hear more voices and get more viewpoints`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-users'
      },

      {
        key: 'developerCertificateOfOrigin',
        label: 'Developer Certificate of Origin',
        description: `Mechanism for contributors to certify that they wrote or have the right to submit the code they are contributing`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-file-edit'
      },
      {
        key: 'githubDiscussions',
        label: 'GitHub discussions',
        description: `Projects should enable discussions in their repositories`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-comments-alt'
      },
      {
        key: 'openssfBadge',
        label: 'OpenSSF badge',
        description:
          `The Open Source Security FoundationBest Practices badge is a way for ` +
          `Free/Libre and Open Source Software (FLOSS) projects to show that they follow best practices`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-badge-sheriff'
      },
      {
        key: 'recentRelease',
        label: 'Recent release',
        description: `The project should have released at least one version in the last year`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-calendar'
      },
      {
        key: 'slackPresence',
        label: 'Slack presence',
        description: `Projects should have presence in the CNCF Slack or Kubernetes Slack`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'fab fa-slack'
      },

      {
        key: 'details',
        type: 'list',
        data: ['Checks reference documentation']
      }
    ]
  },
  {
    metric: 'security',
    key: 'security',
    score: -1,
    metricInfo: [
      {
        key: 'binaryArtifacts',
        label: 'Binary artifacts',
        description: 'Whether the project has generated executable (binary) artifacts in the source repository',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-terminal'
      },
      {
        key: 'codeReview',
        label: 'Code review',
        description: `The project requires code review before pull requests (merge requests) are merged`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-eye'
      },
      {
        key: 'dangerousWorkflow',
        label: 'Dangerous workflow',
        description: `Whether the project's GitHub Action workflows has dangerous code patterns`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-exclamation-triangle'
      },
      {
        key: 'dependencyUpdateTool',
        label: 'Dependency update tool',
        description: `The project uses a dependency update tool, specifically dependabot or renovatebot`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-robot'
      },
      {
        key: 'maintained',
        label: 'Maintained',
        description: `Whether the project is actively maintained`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-tools'
      },
      {
        key: 'softwareBillOfMaterials',
        label: 'Software bill of materials (SBOM)',
        description: `List of components in a piece of software, including licenses, versions, etc`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-clipboard-check'
      },
      {
        key: 'securityPolicy',
        label: 'Security policy',
        description: `Clearly documented security processes explaining how to report security issues to the project`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-shield-alt'
      },
      {
        key: 'signedReleases',
        label: 'Signed releases',
        description: `The project cryptographically signs release artifacts`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-signature'
      },
      {
        key: 'tokenPermissions',
        label: 'Token permissions',
        description: `Whether the project's automated workflows tokens are set to read-only by default`,
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-user-secret'
      },
      {
        key: 'details',
        type: 'list',
        data: ['Checks reference documentation', 'Recommended templates: SECURITY.md']
      }
    ]
  },
  {
    metric: 'legal',
    key: 'legal',
    score: -1,
    metricInfo: [
      {
        key: 'trademarkDisclaimer',
        label: 'Trademark disclaimer',
        description: 'Projects sites should have the Linux Foundation trademark disclaimer',
        passed: false,
        failed: false,
        exempt: false,
        enabled: true,
        type: 'normal',
        icon: 'far fa-wave-sine'
      },
      {
        key: 'details',
        type: 'list',
        data: ['Checks reference documentation']
      }
    ]
  }
];
