/**
 * Dynamic Order Form Options Interfaces
 * These define the structure of configurable form options loaded from the API
 */

// Filter types for options that can be filtered by academic level or subject area
export type FilterByType = 'none' | 'academicLevel' | 'subjectArea' | 'both';

/**
 * Base interface for all filterable options
 */
export interface FilterableOption {
  id: string;
  value: string;
  label: string;
  active: boolean;
  sortOrder: number;
  filterBy: FilterByType;
  academicLevels?: string[];
  subjectAreas?: string[];
}

/**
 * Service type options (Writing, Editing, Proofreading, etc.)
 */
export interface ServiceTypeOption extends FilterableOption {
  priceMultiplier: number;
}

/**
 * Academic level options (High School, Undergraduate, Masters, PhD)
 */
export interface AcademicLevelOption {
  id: string;
  value: string;
  label: string;
  active: boolean;
  sortOrder: number;
  basePrice: number;
}

/**
 * Deadline options (3 hours, 6 hours, 7 days, etc.)
 */
export interface DeadlineOption extends FilterableOption {
  hours: number;
  priceMultiplier: number;
}

/**
 * Paper type options (Essay, Research Paper, Thesis, etc.)
 */
export interface PaperTypeOption extends FilterableOption {
  description?: string;
  minPages?: number;
  maxPages?: number;
}

/**
 * Project purpose options (Academic, Professional, Personal)
 */
export interface ProjectPurposeOption extends FilterableOption {}

/**
 * Citation style options (APA, MLA, Chicago, etc.)
 */
export interface CitationStyleOption extends FilterableOption {
  description?: string;
}

/**
 * Subject area options with pricing multiplier
 */
export interface SubjectAreaOption {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
  priceMultiplier: number;
  description?: string;
}

/**
 * Extended PricingConfig that includes all dynamic form options
 */
export interface PricingConfigWithOptions {
  configType: string;

  // Legacy pricing fields (for backward compatibility)
  basePricePerPage: {
    highschool: number;
    undergraduate: number;
    masters: number;
    phd: number;
  };
  deadlineMultipliers: Record<string, number>;
  serviceTypeAdjustments: Record<string, number>;

  // Core pricing
  sourceCost: number;
  extras: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    active: boolean;
  }>;
  freeIncludes: Array<{
    name: string;
    displayPrice: number;
    active: boolean;
  }>;
  promoCodes: Array<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    active: boolean;
    expiresAt?: Date;
    usageLimit?: number;
    usageCount?: number;
  }>;

  // Dynamic form options
  serviceTypeOptions: ServiceTypeOption[];
  academicLevelOptions: AcademicLevelOption[];
  deadlineOptions: DeadlineOption[];
  paperTypeOptions: PaperTypeOption[];
  projectPurposeOptions: ProjectPurposeOption[];
  citationStyleOptions: CitationStyleOption[];
  subjectAreas: SubjectAreaOption[];

  // Config settings
  quoteExpirationDays: number;
  moneyBackGuaranteeDays: number;
  active: boolean;

  // Timestamps
  createdDate?: Date;
  modifiedDate?: Date;
}

/**
 * Helper function to filter options based on academic level and/or subject area
 */
export function filterOptions<T extends FilterableOption>(
  options: T[],
  academicLevel?: string,
  subjectArea?: string
): T[] {
  if (!options) return [];

  return options.filter(option => {
    // Always exclude inactive options
    if (!option.active) return false;

    // No filtering applied
    if (option.filterBy === 'none') return true;

    // Filter by academic level only
    if (option.filterBy === 'academicLevel') {
      if (!academicLevel) return true; // Show all if no level selected yet
      return option.academicLevels?.includes(academicLevel) ?? true;
    }

    // Filter by subject area only
    if (option.filterBy === 'subjectArea') {
      if (!subjectArea) return true; // Show all if no subject selected yet
      return option.subjectAreas?.includes(subjectArea) ?? true;
    }

    // Filter by both academic level AND subject area
    if (option.filterBy === 'both') {
      const levelMatch = !academicLevel || (option.academicLevels?.includes(academicLevel) ?? true);
      const subjectMatch = !subjectArea || (option.subjectAreas?.includes(subjectArea) ?? true);
      return levelMatch && subjectMatch;
    }

    return true;
  }).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Sort options by sortOrder
 */
export function sortOptions<T extends { sortOrder: number; active: boolean }>(options: T[]): T[] {
  if (!options) return [];
  return options
    .filter(o => o.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
