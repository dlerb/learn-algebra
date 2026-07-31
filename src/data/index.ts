// Loads and validates all taxonomy content at import time. A bad skill, a
// duplicate id, a dangling group, or a dangling rule reference throws
// here immediately with the offending id named.
import {
  parseSkillTree, parseRuleTree, parseSheetTree,
  parseMistakeTree,
  validateUniqueIds, validateProcesses, validateRuleRefs, validateSheetRefs, validateRuleFamilies, validateFamilies, validateSkillLinks, validateStacks,
  validateLayerRefs, validateLatexCompiles, validateMistakeRefs, auditCoverage,
  type GroupsFile, type RulesFile, type RuleTree, type SheetDef, type SheetTree,
  type MistakeDef, type MistakeTree,
} from './skill.schema'
import { cardIndex } from './layers'
import rulesRaw from './curated/rules.json'
import sheetsRaw from './curated/cheatsheets.json'
import mistakesRaw from './curated/mistakes.json'
// Skills: one file per PROCESS (process → groups[] → skills[]), mirroring the
// fundament tower's one-file-per-layer tree. Add a process = add a file + one
// line below. Three since 2026-07-30: `classification` was split, eleven of its
// skills into chunking (their own notes already said "the chunks are …") and the
// rest redistributed.
import fluencySkills from './curated/skills/fluency.json'
import chunkingSkills from './curated/skills/chunking.json'
import transformationSkills from './curated/skills/transformation.json'
// …and the layer head beside them: a layer split across four files has nowhere
// else to keep its title, blurb and note (skill.schema → skillsHead).
import skillsLayerHead from './curated/skills/layer.json'
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


// THE MISTAKE POOL, the negative face of the rules registry (skill.schema →
// mistakeDef). ⚠️ HAND-AUTHORED SINCE 2026-07-31, and edited here like every
// other content file. It was generated from errors.json until the derivation
// stopped being true in both directions: 10 of its entries had no errors.json
// twin and one errors.json entry had been retired from it, and the generator had
// grown two escape hatches (POOL_ONLY, RETIRED) whose only job was to let the two
// files disagree. A derivation needing escape hatches for a quarter of its output
// is a copy, so the copy became the original and the 537-line generator went
// away. errors.json stays where it is, legacy and unedited, and still backs
// /errors with 52 instances and 29 fixes the pool never took.
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
validateStacks(skills)
validateMistakeRefs(mistakes, rules, cardIds)
validateLayerRefs(skills, rules, cardIds, mistakes)
validateLatexCompiles(skills, rules, mistakes)

// Matrix audit — a report, not a validator: empty cells are questions.
const cardConds = new Map([...cardIndex].map(([id, e]) => [id, e.card.cond]))
for (const line of auditCoverage(skills, rules, mistakes, cardConds, sheets)) {
  console.info(`[audit] ${line}`)
}
