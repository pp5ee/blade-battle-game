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
