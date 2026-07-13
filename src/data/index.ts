// Loads and validates all taxonomy content at import time. A bad family, a
// duplicate id, a dangling group, or a dangling meta-pattern reference throws
// here immediately with the offending id named.
import {
  parseFamilies, groupsFile, lawGroupsFile, conventionGroupsFile, metaPatternsFile, lawDef, conventionDef, errorDef,
  validateUniqueIds, validateGroupRefs, validateLawGroups, validateConventionGroups, validateMetaPatternRefs, validateFamilyLinks,
  validateLaws, validateConventions, validateErrors, validateLayerRefs, validateLatexCompiles, auditCoverage,
  type Family, type GroupsFile, type LawGroupsFile, type ConventionGroupsFile, type MetaPatternsFile,
  type LawDef, type ConventionDef, type ErrorDef,
} from './family.schema'
import groupsRaw from './groups.json'
import lawGroupsRaw from './lawGroups.json'
import conventionGroupsRaw from './conventionGroups.json'
import metasRaw from './metapatterns.json'
import lawsRaw from './laws.json'
import conventionsRaw from './conventions.json'
import errorsRaw from './errors.json'
import notationMultiplication from './families/notation-multiplication.json'
import notationLikeTerms from './families/notation-like-terms.json'
import notationMinusSign from './families/notation-minus-sign.json'
import notationBrackets from './families/notation-brackets.json'
import notationExponents from './families/notation-exponents.json'
import notationFractions from './families/notation-fractions.json'
import notationCommutativity from './families/notation-commutativity.json'
import structureBasicForms from './families/structure-basic-forms.json'
import structureMisleadingForms from './families/structure-misleading-forms.json'
import structureChunking from './families/structure-chunking.json'
import structureFamiliarShapes from './families/structure-familiar-shapes.json'
import structureFullClassification from './families/structure-full-classification.json'

// Per-group family files. Add new groups here as they are authored.
const familyFiles: unknown[][] = [
  notationMultiplication as unknown[],
  notationLikeTerms as unknown[],
  notationMinusSign as unknown[],
  notationBrackets as unknown[],
  notationExponents as unknown[],
  notationFractions as unknown[],
  notationCommutativity as unknown[],
  structureBasicForms as unknown[],
  structureMisleadingForms as unknown[],
  structureChunking as unknown[],
  structureFamiliarShapes as unknown[],
  structureFullClassification as unknown[],
]

export const groups: GroupsFile = groupsFile.parse(groupsRaw)
export const lawGroups: LawGroupsFile = lawGroupsFile.parse(lawGroupsRaw)
export const conventionGroups: ConventionGroupsFile = conventionGroupsFile.parse(conventionGroupsRaw)
export const metaPatterns: MetaPatternsFile = metaPatternsFile.parse(metasRaw)

// Layers 1+2 (docs/laws_and_conventions.md): the coordinate system families
// live in — laws justify, conventions locate, error patterns name the wrong.
export const laws: LawDef[] = (lawsRaw as unknown[]).map(l => lawDef.parse(l))
export const conventions: ConventionDef[] = (conventionsRaw as unknown[]).map(c => conventionDef.parse(c))
export const errorPatterns: ErrorDef[] = (errorsRaw as unknown[]).map(e => errorDef.parse(e))

const rawEntries = familyFiles.flat()
export const families: Family[] = parseFamilies(rawEntries)

// Raw authored entries by id — for the inspection view, which shows the JSON
// exactly as written in the file, not the parsed/normalized form.
export const rawById = new Map<string, unknown>(
  rawEntries.map(e => [(e as { id: string }).id, e]),
)

validateUniqueIds(families)
validateGroupRefs(families, groups)
validateLawGroups(lawGroups)
validateConventionGroups(conventionGroups)
validateMetaPatternRefs(families, metaPatterns)
validateFamilyLinks(families)
validateLaws(laws)
validateConventions(conventions)
validateErrors(errorPatterns, laws, conventions, metaPatterns)
validateLayerRefs(families, metaPatterns, laws, conventions, errorPatterns)
validateLatexCompiles(families, metaPatterns, laws, conventions, errorPatterns)

// Matrix audit — a report, not a validator: empty cells are questions.
for (const line of auditCoverage(families, metaPatterns, laws, conventions, errorPatterns)) {
  console.info(`[audit] ${line}`)
}
