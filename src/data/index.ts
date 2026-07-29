// Loads and validates all taxonomy content at import time. A bad skill, a
// duplicate id, a dangling group, or a dangling rule reference throws
// here immediately with the offending id named.
import {
  parseSkillTree, parseDrills, parseErrorTree, parseRuleTree, parseSheetTree,
  parseMistakeTree,
  validateUniqueIds, validateSkillKinds, validateRuleRefs, validateSheetRefs, validateSkillLinks,
  validateDrills, validateErrors, validateLayerRefs, validateLatexCompiles, validateMistakeRefs, auditCoverage,
  type Drill, type GroupsFile, type RulesFile, type RuleTree, type SheetDef, type SheetTree, type ErrorDef, type ErrorTree,
  type MistakeDef, type MistakeTree,
} from './skill.schema'
import { cardIndex } from './layers'
import rulesRaw from './rules.json'
import sheetsRaw from './cheatsheets.json'
import errorsRaw from './errors.json'
import mistakesRaw from './mistakes.json'
// Skills: one file per kind (kind → groups[] → skills[]), mirroring the fundament
// tower's one-file-per-layer tree. Add a kind = add a file + one line below.
import equivalenceSkills from './skills/equivalence.json'
import classificationSkills from './skills/classification.json'
import chunkingSkills from './skills/chunking.json'
import transformationSkills from './skills/transformation.json'
// …and the layer head beside them: a layer split across four files has nowhere
// else to keep its title, blurb and note (skill.schema → skillsHead).
import skillsLayerHead from './skills/layer.json'
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
], skillsLayerHead)
export const skills = skillTree.skills
export { skillTree }
export const groups: GroupsFile = skillTree.groups
export const skillKinds: GroupsFile = skillTree.skillKinds
// NOTE: `layers.json` (a one-entry GroupsFile holding the errors page's title and
// blurb) was deleted 2026-07-25 — that metadata now lives at the head of the
// errors tree itself, and its export here collided by name with the tower manifest
// in src/data/layers.ts. `layers` means the tower, and only the tower.
export const ruleTree: RuleTree = parseRuleTree(rulesRaw)
export const rules: RulesFile = ruleTree.rules

// Presentation over the pool: sheets group and order rules and own nothing.
export const sheetTree: SheetTree = parseSheetTree(sheetsRaw)
export const sheets: SheetDef[] = sheetTree.sheets

// THE FAMILY A RULE BELONGS TO — "the power laws", "the minus rules" — derived
// through the sheets and authored nowhere (2026-07-29).
//
// This is the one piece of grouping the pool DOES carry, and only because a
// teacher names it out loud and a mistake can cite it. Everything else about
// grouping is presentation and lives on the sheet, which is exactly why the
// membership has to be read backwards from there: a sheet names its rules, its
// own `rule` is the family name, so sheet-membership IS family-membership.
// 48 of 57 rules sit on a sheet; the other 9 have no family and show none.
// Four rules sit on two sheets, so the value is a list, not a single id.
export const ruleFamilies = new Map<string, SheetDef[]>()
for (const s of sheets) {
  for (const g of s.groups) {
    for (const id of g.rules) {
      if (id === s.rule) continue          // a family does not belong to itself
      ruleFamilies.set(id, [...(ruleFamilies.get(id) ?? []), s])
    }
  }
}

// The fundament's shadow: false laws and misreadings, each `corrupts` a card in
// the tower (src/data/layers.ts). The laws/conventions files they used to point
// at were folded into the tower and deleted; see docs/content_model.md.
// Authored since 2026-07-25 as a containment tree (sections = TOPICS) like a
// fundament layer; `errorPatterns` stays the flat list every consumer already had.
export const errorTree: ErrorTree = parseErrorTree(errorsRaw)
export const errorPatterns: ErrorDef[] = errorTree.errors

// THE MISTAKE POOL, the negative face of the rules registry (skill.schema →
// mistakeDef). Built ALONGSIDE errors.json on purpose, not in place of it: this
// is the parallel build that lets /mistakes and /errors be compared on screen
// before anything is migrated. ⚠️ While both exist they share ids and derive
// frequency/kind/topic/corrupts/breaks from the same source, so mistakes.json
// must be REGENERATED rather than hand-edited when errors.json changes — the
// generator is scripts/gen-mistakes.py.
export const mistakeTree: MistakeTree = parseMistakeTree(mistakesRaw)
export const mistakes: MistakeDef[] = mistakeTree.mistakes

// Every fundament-tower card id, the resolution target for the skill/error/
// rule references validated below.
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
validateRuleRefs(skills, rules)
validateSheetRefs(sheets, rules)
validateSkillLinks(skills)
validateDrills(drills, skills)
validateErrors(errorPatterns, cardIds)
validateMistakeRefs(mistakes, rules, cardIds)
validateLayerRefs(skills, rules, cardIds, errorPatterns)
validateLatexCompiles(skills, drills, rules, errorPatterns)

// Matrix audit — a report, not a validator: empty cells are questions.
const cardConds = new Map([...cardIndex].map(([id, e]) => [id, e.card.cond]))
for (const line of auditCoverage(skills, rules, errorPatterns, cardConds, drills)) {
  console.info(`[audit] ${line}`)
}
