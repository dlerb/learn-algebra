// Loads and validates all taxonomy content at import time. A bad skill, a
// duplicate id, a dangling group, or a dangling meta-pattern reference throws
// here immediately with the offending id named.
import {
  parseSkillTree, parseDrills, groupsFile, metaPatternsFile, errorDef,
  validateUniqueIds, validateSkillKinds, validateMetaPatternRefs, validateSkillLinks,
  validateDrills, validateErrors, validateLayerRefs, validateLatexCompiles, auditCoverage,
  type Drill, type GroupsFile, type MetaPatternsFile, type ErrorDef,
} from './skill.schema'
import { cardIndex } from './layers'
import layersRaw from './layers.json'
import metasRaw from './metapatterns.json'
import errorsRaw from './errors.json'
// Skills: one file per kind (kind → groups[] → skills[]), mirroring the fundament
// tower's one-file-per-layer tree. Add a kind = add a file + one line below.
import equivalenceSkills from './skills/equivalence.json'
import classificationSkills from './skills/classification.json'
import chunkingSkills from './skills/chunking.json'
import transformationSkills from './skills/transformation.json'
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

// Skills load as a tree (one file per kind); the flat Skill[] plus the derived
// group and kind registries all come out of parseSkillTree, which re-attaches
// kind/group from tree position so downstream sees the same flat shape as before.
const skillTree = parseSkillTree([
  equivalenceSkills, classificationSkills, chunkingSkills, transformationSkills,
])
export const skills = skillTree.skills
export const groups: GroupsFile = skillTree.groups
export const skillKinds: GroupsFile = skillTree.skillKinds
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

export const drills: Drill[] = parseDrills(drillFiles.flat())

// Raw entries by id — for the inspection view. These are the authored skill
// bodies with kind/group re-attached from tree position (the two fields are
// positional in the file), so the inspector shows a complete skill object.
export const rawById = new Map<string, unknown>(
  skillTree.rawEntries.map(e => [(e as { id: string }).id, e]),
)

validateUniqueIds(skills)
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
