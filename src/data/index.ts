// Loads and validates all taxonomy content at import time. A bad skill, a
// duplicate id, a dangling group, or a dangling rule reference throws
// here immediately with the offending id named.
import {
  parseSkillTree, parseErrorTree, parseRuleTree, parseSheetTree,
  parseMistakeTree,
  validateUniqueIds, validateProcesses, validateRuleRefs, validateSheetRefs, validateRuleFamilies, validateFamilies, validateSkillLinks, validateReadings,
  validateErrors, validateLayerRefs, validateLatexCompiles, validateMistakeRefs, auditCoverage,
  type GroupsFile, type RulesFile, type RuleTree, type SheetDef, type SheetTree, type ErrorDef, type ErrorTree,
  type MistakeDef, type MistakeTree,
} from './skill.schema'
import { cardIndex } from './layers'
import rulesRaw from './rules.json'
import sheetsRaw from './cheatsheets.json'
import errorsRaw from './errors.json'
import mistakesRaw from './mistakes.json'
// Skills: one file per PROCESS (process → groups[] → skills[]), mirroring the
// fundament tower's one-file-per-layer tree. Add a process = add a file + one
// line below. Three since 2026-07-30: `classification` was split, eleven of its
// skills into chunking (their own notes already said "the chunks are …") and the
// rest redistributed.
import fluencySkills from './skills/fluency.json'
import chunkingSkills from './skills/chunking.json'
import transformationSkills from './skills/transformation.json'
// …and the layer head beside them: a layer split across four files has nowhere
// else to keep its title, blurb and note (skill.schema → skillsHead).
import skillsLayerHead from './skills/layer.json'
// Skills load as a tree (one file per kind); the flat Skill[] plus the derived
// group and kind registries all come out of parseSkillTree, which re-attaches
// kind/group from tree position so downstream sees the same flat shape as before.
const skillTree = parseSkillTree([
  fluencySkills, chunkingSkills, transformationSkills,
], skillsLayerHead)
export const skills = skillTree.skills
export { skillTree }
export const groups: GroupsFile = skillTree.groups
export const processes: GroupsFile = skillTree.processes
// NOTE: `layers.json` (a one-entry GroupsFile holding the errors page's title and
// blurb) was deleted 2026-07-25 — that metadata now lives at the head of the
// errors tree itself, and its export here collided by name with the tower manifest
// in src/data/layers.ts. `layers` means the tower, and only the tower.
export const ruleTree: RuleTree = parseRuleTree(rulesRaw)
export const rules: RulesFile = ruleTree.rules

// Presentation over the pool: sheets group and order rules and own nothing.
export const sheetTree: SheetTree = parseSheetTree(sheetsRaw)
export const sheets: SheetDef[] = sheetTree.sheets


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


// Raw entries by id — for the inspection view. These are the authored skill
// bodies with kind/group re-attached from tree position (the two fields are
// positional in the file), so the inspector shows a complete skill object.
export const rawById = new Map<string, unknown>(
  skillTree.rawEntries.map(e => [(e as { id: string }).id, e]),
)

validateUniqueIds(skills)
validateProcesses(processes)
validateRuleRefs(skills, rules)
validateSheetRefs(sheets, rules)
validateRuleFamilies(rules)
validateFamilies(mistakes, 'Mistake')
validateSkillLinks(skills)
validateReadings(skills)
validateErrors(errorPatterns, cardIds)
validateMistakeRefs(mistakes, rules, cardIds)
validateLayerRefs(skills, rules, cardIds, errorPatterns, mistakes)
validateLatexCompiles(skills, rules, errorPatterns)

// Matrix audit — a report, not a validator: empty cells are questions.
const cardConds = new Map([...cardIndex].map(([id, e]) => [id, e.card.cond]))
for (const line of auditCoverage(skills, rules, errorPatterns, cardConds, sheets)) {
  console.info(`[audit] ${line}`)
}
