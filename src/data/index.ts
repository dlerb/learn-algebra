// Loads and validates all taxonomy content at import time. A bad skill, a
// duplicate id, a dangling group, or a dangling meta-pattern reference throws
// here immediately with the offending id named.
import {
  parseSkills, parseDrills, groupsFile, metaPatternsFile, errorDef,
  validateUniqueIds, validateGroupRefs, validateSkillKinds, validateMetaPatternRefs, validateSkillLinks,
  validateDrills, validateErrors, validateLayerRefs, validateLatexCompiles, auditCoverage,
  type Skill, type Drill, type GroupsFile, type MetaPatternsFile, type ErrorDef,
} from './skill.schema'
import { cardIndex } from './layers'
import groupsRaw from './skillGroups.json'
import skillKindsRaw from './skillKinds.json'
import layersRaw from './layers.json'
import metasRaw from './metapatterns.json'
import errorsRaw from './errors.json'
import equivalenceMultiplication from './skills/equivalence-multiplication.json'
import equivalenceLikeTerms from './skills/equivalence-like-terms.json'
import equivalenceMinusSign from './skills/equivalence-minus-sign.json'
import equivalenceBrackets from './skills/equivalence-brackets.json'
import equivalenceExponents from './skills/equivalence-exponents.json'
import equivalenceFractions from './skills/equivalence-fractions.json'
import equivalenceCommutativity from './skills/equivalence-commutativity.json'
import classificationBasicForms from './skills/classification-basic-forms.json'
import classificationMisleadingForms from './skills/classification-misleading-forms.json'
import chunkingChunking from './skills/chunking-chunking.json'
import classificationFamiliarShapes from './skills/classification-familiar-shapes.json'
import equivalenceFullClassification from './skills/equivalence-full-classification.json'
import dEquivalenceMultiplication from './drills/equivalence-multiplication.json'
import dEquivalenceLikeTerms from './drills/equivalence-like-terms.json'
import dEquivalenceMinusSign from './drills/equivalence-minus-sign.json'
import dEquivalenceBrackets from './drills/equivalence-brackets.json'
import dEquivalenceExponents from './drills/equivalence-exponents.json'
import dEquivalenceFractions from './drills/equivalence-fractions.json'
import dEquivalenceCommutativity from './drills/equivalence-commutativity.json'
import dClassificationBasicForms from './drills/classification-basic-forms.json'
import dClassificationMisleadingForms from './drills/classification-misleading-forms.json'
import dChunkingChunking from './drills/chunking-chunking.json'
import dClassificationFamiliarShapes from './drills/classification-familiar-shapes.json'
import dEquivalenceFullClassification from './drills/equivalence-full-classification.json'

// Per-group skill files (named <kind>-<group>). Each has a parallel drills/
// file holding its drill material. Add new groups in both lists.
const skillFiles: unknown[][] = [
  equivalenceMultiplication as unknown[],
  equivalenceLikeTerms as unknown[],
  equivalenceMinusSign as unknown[],
  equivalenceBrackets as unknown[],
  equivalenceExponents as unknown[],
  equivalenceFractions as unknown[],
  equivalenceCommutativity as unknown[],
  classificationBasicForms as unknown[],
  classificationMisleadingForms as unknown[],
  chunkingChunking as unknown[],
  classificationFamiliarShapes as unknown[],
  equivalenceFullClassification as unknown[],
]

const drillFiles: unknown[][] = [
  dEquivalenceMultiplication as unknown[],
  dEquivalenceLikeTerms as unknown[],
  dEquivalenceMinusSign as unknown[],
  dEquivalenceBrackets as unknown[],
  dEquivalenceExponents as unknown[],
  dEquivalenceFractions as unknown[],
  dEquivalenceCommutativity as unknown[],
  dClassificationBasicForms as unknown[],
  dClassificationMisleadingForms as unknown[],
  dChunkingChunking as unknown[],
  dClassificationFamiliarShapes as unknown[],
  dEquivalenceFullClassification as unknown[],
]

export const groups: GroupsFile = groupsFile.parse(groupsRaw)
export const skillKinds: GroupsFile = groupsFile.parse(skillKindsRaw)
// Display metadata for the reference view's segment switch (now errors only; the
// laws/conventions segments retired with those files on 2026-07-23).
export const layers: GroupsFile = groupsFile.parse(layersRaw)
export const metaPatterns: MetaPatternsFile = metaPatternsFile.parse(metasRaw)

// The fundament's shadow: false laws and misreadings, each `corrupts` a card in
// the tower (src/data/layers.ts). The laws/conventions files they used to point
// at were folded into the tower and deleted; see docs/content_model.md.
export const errorPatterns: ErrorDef[] = (errorsRaw as unknown[]).map(e => errorDef.parse(e))

// Every fundament-tower card id, the resolution target for the skill/error/
// meta-pattern references validated below.
const cardIds = new Set(cardIndex.keys())

const rawEntries = skillFiles.flat()
export const skills: Skill[] = parseSkills(rawEntries)
export const drills: Drill[] = parseDrills(drillFiles.flat())

// Raw authored entries by id — for the inspection view, which shows the JSON
// exactly as written in the file, not the parsed/normalized form.
export const rawById = new Map<string, unknown>(
  rawEntries.map(e => [(e as { id: string }).id, e]),
)

validateUniqueIds(skills)
validateGroupRefs(skills, groups)
validateSkillKinds(skillKinds)
validateMetaPatternRefs(skills, metaPatterns)
validateSkillLinks(skills)
validateDrills(drills, skills)
validateErrors(errorPatterns, cardIds)
validateLayerRefs(skills, metaPatterns, cardIds, errorPatterns)
validateLatexCompiles(skills, drills, metaPatterns, errorPatterns)

// Matrix audit — a report, not a validator: empty cells are questions.
const cardConds = new Map([...cardIndex].map(([id, e]) => [id, e.card.cond]))
for (const line of auditCoverage(skills, metaPatterns, errorPatterns, cardConds)) {
  console.info(`[audit] ${line}`)
}
