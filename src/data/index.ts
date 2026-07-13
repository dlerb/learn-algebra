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
import groupsRaw from './familyGroups.json'
import lawGroupsRaw from './lawGroups.json'
import conventionGroupsRaw from './conventionGroups.json'
import metasRaw from './metapatterns.json'
import lawsRaw from './laws.json'
import conventionsRaw from './conventions.json'
import errorsRaw from './errors.json'
import equivalenceMultiplication from './families/equivalence-multiplication.json'
import equivalenceLikeTerms from './families/equivalence-like-terms.json'
import equivalenceMinusSign from './families/equivalence-minus-sign.json'
import equivalenceBrackets from './families/equivalence-brackets.json'
import equivalenceExponents from './families/equivalence-exponents.json'
import equivalenceFractions from './families/equivalence-fractions.json'
import equivalenceCommutativity from './families/equivalence-commutativity.json'
import classificationBasicForms from './families/classification-basic-forms.json'
import classificationMisleadingForms from './families/classification-misleading-forms.json'
import classificationChunking from './families/classification-chunking.json'
import classificationFamiliarShapes from './families/classification-familiar-shapes.json'
import classificationFullClassification from './families/classification-full-classification.json'

// Per-group family files (named <skill>-<group>). Add new groups here as they
// are authored.
const familyFiles: unknown[][] = [
  equivalenceMultiplication as unknown[],
  equivalenceLikeTerms as unknown[],
  equivalenceMinusSign as unknown[],
  equivalenceBrackets as unknown[],
  equivalenceExponents as unknown[],
  equivalenceFractions as unknown[],
  equivalenceCommutativity as unknown[],
  classificationBasicForms as unknown[],
  classificationMisleadingForms as unknown[],
  classificationChunking as unknown[],
  classificationFamiliarShapes as unknown[],
  classificationFullClassification as unknown[],
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
