# Blade Blade Web Game Implementation Plan

## Goal Description
Create a single-player web game called "转刀刀" (Blade Blade) where players control a character that collects blades, engages in strategic combat with NPCs, and uses free keyboard movement. The game features a color-based blade hierarchy (Red > Yellow > Blue) with quantity-based combat calculations and visual UI referencing the provided blade.jpeg image.

## Acceptance Criteria

Following TDD philosophy, each criterion includes positive and negative tests for deterministic verification.

- AC-1: Core Game Engine and Rendering
  - Positive Tests (expected to PASS):
    - Game canvas renders at 60fps with smooth animation
    - Keyboard inputs (WASD/arrow keys) control player movement
    - Player character responds instantly to movement commands
  - Negative Tests (expected to FAIL):
    - Game freezes or crashes during gameplay
    - Input lag exceeds 100ms
    - Movement controls are unresponsive or jerky

- AC-2: Blade System Implementation  
  - Positive Tests (expected to PASS):
    - Player can collect all 3 blade types (Red, Yellow, Blue)
    - Blade counts update correctly when collected
    - Blade visual representation matches the reference image style
  - Negative Tests (expected to FAIL):
    - Blade collection mechanics don't work
    - Blade counts display incorrectly
    - Visual style deviates significantly from reference image

- AC-3: Combat System with Color Hierarchy
  - Positive Tests (expected to PASS):
    - Red blades deal more damage than Yellow/Blue
    - Combat calculations consider both quantity and color
    - NPCs drop blades when defeated
  - Negative Tests (expected to FAIL):
    - Color hierarchy is ignored in combat
    - Blade quantity has no effect on combat outcomes
    - Defeated NPCs don't drop blades

- AC-4: NPC AI and Strategic Movement
  - Positive Tests (expected to PASS):
    - NPCs move intelligently and pursue player
    - Player can avoid combat through strategic movement
    - NPC behavior is predictable but challenging
  - Negative Tests (expected to FAIL):
    - NPCs are completely static or random
    - No strategic movement options available
    - NPC behavior is either trivial or impossible

- AC-5: Game State Management
  - Positive Tests (expected to PASS):
    - Game state persists correctly during gameplay
    - Blade counts maintain consistency across sessions
    - Game over/restart mechanics work properly
  - Negative Tests (expected to FAIL):
    - Game state corrupts or loses progress
    - Blade counts reset unexpectedly
    - Game restart causes crashes

## Path Boundaries

Path boundaries define the acceptable range of implementation quality and choices.

### Upper Bound (Maximum Acceptable Scope)
The implementation includes a polished web game with smooth 60fps rendering, advanced NPC AI with pathfinding, comprehensive combat animations, particle effects for blade collection, responsive UI with visual feedback, and full game state persistence with save/load functionality.

### Lower Bound (Minimum Acceptable Scope)
The implementation includes a functional web game with basic keyboard movement, simple blade collection mechanics, rudimentary combat calculations, basic NPC movement, and core game loop functionality that satisfies all acceptance criteria.

### Allowed Choices
- Can use: HTML5 Canvas or WebGL for rendering; JavaScript game frameworks like Phaser or custom engine; vector graphics or sprite-based rendering; localStorage for game state persistence
- Cannot use: Server-side rendering; complex 3D graphics; external dependencies beyond standard web technologies; technologies requiring installation or plugins

> **Note on Deterministic Designs**: The draft specifies a highly deterministic design with fixed requirements: 3 blade colors with Red > Yellow > Blue hierarchy, keyboard movement controls, and single-player NPC opponents. The path boundaries reflect this narrow constraint while allowing flexibility in implementation details.

## Feasibility Hints and Suggestions

> **Note**: This section is for reference and understanding only. These are conceptual suggestions, not prescriptive requirements.

### Conceptual Approach
A modern HTML5 game using Canvas API with game loop architecture:
```javascript
// Core game loop structure
class BladeGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.player = new Player();
    this.blades = [];
    this.npcs = [];
    this.gameState = 'playing';
  }
  
  update() {
    // Update game state
    this.player.update();
    this.npcs.forEach(npc => npc.update());
    this.checkCollisions();
  }
  
  render() {
    // Clear and render game
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.render(this.ctx);
    this.blades.forEach(blade => blade.render(this.ctx));
    this.npcs.forEach(npc => npc.render(this.ctx));
  }
  
  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}
```

### Relevant References
- HTML5 Canvas API for 2D rendering
- JavaScript game loop patterns (requestAnimationFrame)
- Collision detection algorithms (AABB, circle collision)
- Simple AI pathfinding for NPC movement
- Color-based combat formula: `damage = blade_count * color_multiplier`

## Dependencies and Sequence

### Milestones
1. Milestone 1: Core Game Engine Foundation
   - Phase A: Set up HTML5 Canvas rendering system with game loop
   - Phase B: Implement keyboard input handling and player movement
   - Phase C: Create basic game world and coordinate system

2. Milestone 2: Blade System Implementation  
   - Phase A: Design and implement blade entity system with 3 color types
   - Phase B: Create blade collection mechanics and visual representation
   - Phase C: Implement blade count tracking and UI display

3. Milestone 3: Combat and NPC Systems
   - Phase A: Develop color-based combat formula and mechanics
   - Phase B: Create NPC AI with movement and pursuit behavior
   - Phase C: Implement blade dropping system for defeated NPCs

4. Milestone 4: Game Polish and Finalization
   - Phase A: Add strategic movement and avoidance mechanics
   - Phase B: Implement game state management and persistence
   - Phase C: Final UI polish and visual style matching reference

<Describe relative dependencies between components, not time estimates>

## Task Breakdown

Each task must include exactly one routing tag:
- `coding`: implemented by Claude
- `analyze`: executed via Codex (`/humanize:ask-codex`)

| Task ID | Description | Target AC | Tag (`coding`/`analyze`) | Depends On |
|---------|-------------|-----------|----------------------------|------------|
| task1 | Create HTML5 game structure with Canvas and basic setup | AC-1 | coding | - |
| task2 | Implement keyboard input handling (WASD/arrow keys) | AC-1 | coding | task1 |
| task3 | Create player character with smooth movement physics | AC-1 | coding | task2 |
| task4 | Design blade entity system with 3 color types | AC-2 | coding | task1 |
| task5 | Implement blade collection mechanics | AC-2 | coding | task3, task4 |
| task6 | Create blade count tracking and UI display | AC-2 | coding | task5 |
| task7 | Develop color-based combat formula | AC-3 | coding | task4 |
| task8 | Implement NPC AI with movement and pursuit | AC-4 | coding | task3 |
| task9 | Create combat mechanics and blade dropping | AC-3 | coding | task7, task8 |
| task10 | Add strategic movement and avoidance | AC-4 | coding | task3, task8 |
| task11 | Implement game state persistence | AC-5 | coding | task6 |
| task12 | Apply UI styling matching blade.jpeg reference | AC-2 | coding | task1 |
| task13 | Create README.md with project documentation | - | coding | task12 |

## Claude-Codex Deliberation

### Agreements
- HTML5 Canvas is the appropriate technology choice for this web game
- Keyboard controls (WASD/arrow keys) are essential for free movement
- 3 blade color hierarchy (Red > Yellow > Blue) must be implemented as specified
- NPC opponents and blade dropping mechanics are core requirements

### Resolved Disagreements
- Codex connectivity unavailable: Plan generated with Claude-only analysis due to Codex API connectivity issues

### Convergence Status
- Final Status: `partially_converged` (Claude-only analysis due to Codex unavailability)

## Pending User Decisions

- DEC-1: <Decision topic>
  - Claude Position: <...>
  - Codex Position: <...>
  - Tradeoff Summary: <...>
  - Decision Status: `PENDING` or `<User's final decision>`

## Implementation Notes

### Code Style Requirements
- Implementation code and comments must NOT contain plan-specific terminology such as "AC-", "Milestone", "Step", "Phase", or similar workflow markers
- These terms are for plan documentation only, not for the resulting codebase
- Use descriptive, domain-appropriate naming in code instead

## Output File Convention

This template is used to produce the main output file (e.g., `plan.md`).

### Translated Language Variant

When `alternative_plan_language` resolves to a supported language name through merged config loading, a translated variant of the output file is also written after the main file. Humanize loads config from merged layers in this order: default config, optional user config, then optional project config; `alternative_plan_language` may be set at any of those layers. The variant filename is constructed by inserting `_<code>` (the ISO 639-1 code from the built-in mapping table) immediately before the file extension:

- `plan.md` becomes `plan_<code>.md` (e.g. `plan_zh.md` for Chinese, `plan_ko.md` for Korean)
- `docs/my-plan.md` becomes `docs/my-plan_<code>.md`
- `output` (no extension) becomes `output_<code>`

The translated variant file contains a full translation of the main plan file's current content in the configured language. All identifiers (`AC-*`, task IDs, file paths, API names, command flags) remain unchanged, as they are language-neutral.

When `alternative_plan_language` is empty, absent, set to `"English"`, or set to an unsupported language, no translated variant is written. Humanize does not auto-create `.humanize/config.json` when no project config file is present.

--- Original Design Draft Start ---

# Requirement

我想做一个转刀刀网页游戏，人物可以移动捡刀，然后捡到就变多，可以相互击杀，击杀后掉落对应数量的刀，这个刀也可以被捡起来，取决于刀刀数量也可以自由移动，避免交战，这个是单机页面游戏，其他的都是npc，刀分为3种红黄蓝，拼杀需要拼数量和颜色（不同等级的话有个计算公式扣除刀），红色最厉害，UI风格参考 图片 @blade.jpeg(uploads/blade.jpeg)

**AI Understanding:**
Based on your description and the image reference, I understand you want to create a single-player web game where:
**Core Gameplay:**
- Players control a character that moves around collecting blades
- 3 blade types: Red (strongest), Yellow, Blue - with a combat formula based on quantity and color
- Players can attack NPCs, with defeated enemies dropping their blades
- Strategic movement to avoid combat when needed
**Key Features:**
- Single-player with NPC opponents
- Blade collection and combat system
- Color-based hierarchy (Red > Yellow > Blue)
- Quantity-based combat calculations
The image shows a character with blades, which helps visualize the game style.
**One clarifying question:** What type of movement system do you prefer? 
- Grid-based movement (like chess)
- Free movement with keyboard controls (WASD/arrow keys)
- Click-to-move system
When you're ready, type "start" or "proceed" and I'll create the implementation plan for this blade-collecting web game.

ree movement with keyboard controls

**AI Understanding:**
Perfect! I'll create a web game with free movement using keyboard controls (WASD/arrow keys) for your blade-collecting game.
**Requirements Summary:**
- Single-player web game with free keyboard movement
- 3 blade types: Red (strongest), Yellow, Blue
- Blade collection system with combat based on quantity and color
- NPC opponents that drop blades when defeated
- Strategic movement to avoid combat
Type **"start"** or **"proceed"** and I'll generate the implementation plan for your blade game with the keyboard control system you specified.

---

## Implementation Notes

- For any unspecified details (combat formulas, game balance, UI layout, tech choices, etc.), make reasonable decisions yourself and document them in the plan. Do NOT ask the user for clarification — proceed with sensible defaults.
- If referenced image files exist in the workspace, treat them as visual style references.

## Standard Deliverables (mandatory for every project)

- **README.md** — must be included at the project root with: project title & description, prerequisites, installation steps, usage examples with code snippets, configuration options, and project structure overview.
- **Git commits** — use conventional commit prefix `feat:` for all commits.

--- Original Design Draft End ---
