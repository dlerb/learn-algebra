// Loads and validates all taxonomy content at import time. A bad family, a
// duplicate id, a dangling group, or a dangling meta-pattern reference throws
// here immediately with the offending id named.
import {
  parseFamilies, groupsFile, metaPatternsFile,
  validateUniqueIds, validateGroupRefs, validateMetaPatternRefs, validateFamilyLinks,
  type Family, type GroupsFile, type MetaPatternsFile,
} from './family.schema'
import groupsRaw from './groups.json'
import metasRaw from './metapatterns.json'
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
export const metaPatterns: MetaPatternsFile = metaPatternsFile.parse(metasRaw)

const rawEntries = familyFiles.flat()
export const families: Family[] = parseFamilies(rawEntries)

// Raw authored entries by id — for the inspection view, which shows the JSON
// exactly as written in the file, not the parsed/normalized form.
export const rawById = new Map<string, unknown>(
  rawEntries.map(e => [(e as { id: string }).id, e]),
)

validateUniqueIds(families)
validateGroupRefs(families, groups)
validateMetaPatternRefs(families, metaPatterns)
validateFamilyLinks(families)
