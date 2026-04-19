# Goal Tracker

<!--
This file tracks the ultimate goal, acceptance criteria, and plan evolution.
It prevents goal drift by maintaining a persistent anchor across all rounds.

RULES:
- IMMUTABLE SECTION: Do not modify after initialization
- MUTABLE SECTION: Update each round, but document all changes
- Every task must be in one of: Active, Completed, or Deferred
- Deferred items require explicit justification
-->

## IMMUTABLE SECTION
<!-- Do not modify after initialization -->

### Ultimate Goal
Create a single-player web game called "转刀刀" (Blade Blade) where players control a character that collects blades, engages in strategic combat with NPCs, and uses free keyboard movement. The game features a color-based blade hierarchy (Red > Yellow > Blue) with quantity-based combat calculations and visual UI referencing the provided blade.jpeg image.

## Acceptance Criteria

### Acceptance Criteria
<!-- Each criterion must be independently verifiable -->
<!-- Claude must extract or define these in Round 0 -->

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

---

## MUTABLE SECTION
<!-- Update each round with justification for changes -->

### Plan Version: 1 (Updated: Round 0)

#### Plan Evolution Log
<!-- Document any changes to the plan with justification -->
| Round | Change | Reason | Impact on AC |
|-------|--------|--------|--------------|
| 0 | Initial plan | - | - |

#### Active Tasks
<!-- Map each task to its target Acceptance Criterion and routing tag -->
| Task | Target AC | Status | Tag | Owner | Notes |
|------|-----------|--------|-----|-------|-------|
| task1: Create HTML5 game structure with Canvas and basic setup | AC-1 | completed | coding | claude | Core game engine with Canvas rendering implemented |
| task2: Implement keyboard input handling (WASD/arrow keys) | AC-1 | pending | coding | claude | - |
| task3: Create player character with smooth movement physics | AC-1 | pending | coding | claude | - |
| task4: Design blade entity system with 3 color types | AC-2 | pending | coding | claude | - |
| task5: Implement blade collection mechanics | AC-2 | pending | coding | claude | - |
| task6: Create blade count tracking and UI display | AC-2 | pending | coding | claude | - |
| task7: Develop color-based combat formula | AC-3 | pending | coding | claude | - |
| task8: Implement NPC AI with movement and pursuit | AC-4 | pending | coding | claude | - |
| task9: Create combat mechanics and blade dropping | AC-3 | pending | coding | claude | - |
| task10: Add strategic movement and avoidance | AC-4 | pending | coding | claude | - |
| task11: Implement game state persistence | AC-5 | pending | coding | claude | - |
| task12: Apply UI styling matching blade.jpeg reference | AC-2 | pending | coding | claude | - |
| task13: Create README.md with project documentation | - | pending | coding | claude | - |

### Completed and Verified
<!-- Only move tasks here after Codex verification -->
| AC | Task | Completed Round | Verified Round | Evidence |
|----|------|-----------------|----------------|----------|

### Explicitly Deferred
<!-- Items here require strong justification -->
| Task | Original AC | Deferred Since | Justification | When to Reconsider |
|------|-------------|----------------|---------------|-------------------|

### Open Issues
<!-- Issues discovered during implementation -->
| Issue | Discovered Round | Blocking AC | Resolution Path |
|-------|-----------------|-------------|-----------------|
