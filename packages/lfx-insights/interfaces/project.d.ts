// Copyright The Linux Foundation and each contributor to LFX.
// SPDX-License-Identifier: MIT

export interface SubProject {
  name: string;
  link: string;
}

export interface Foundation {
  id: string;
  logoUrl: string;
  name: string;
  slug: string;
}
export interface Project extends ProjectLocalTypes {
  id: string;
  name: string;
  slug: string;
  description: string;
  projectType: any;
  type: string;
  enabledServices: string[];
  parent: any;
  projectLogo: string;
  endDate?: string;
  foundation: Foundation;
  projects?: Project[];
  categories?: any;
  isOnBoarded: boolean;
  parentSlug?: string;
  rootSlug?: string;
}

export interface ProjectLocalTypes {
  favorite: boolean; // local param
  repositories: number; // local param
  commits: string; // local param
  subProjects?: SubProject[]; // local param
}

export interface BestPracticeScores {
  repositoryURL: string;
  repositoryId: string;
  globalScore: number;
  documentationScore: number;
  licenseScore: number;
  bestPracticesScore: number;
  securityScore: number;
  legalScore: number;
}
