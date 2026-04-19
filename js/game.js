// 转刀刀 - Blade Blade Game
// Core Game Engine

class BladeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'playing';

        // Game world dimensions
        this.worldWidth = 1600;
        this.worldHeight = 1200;

        // Camera/viewport
        this.camera = { x: 0, y: 0 };

        // Game entities
        this.player = null;
        this.blades = [];
        this.npcs = [];
        this.particles = [];

        // Game state
        this.score = 0;
        // bladeCounts moved to Player entity as single source of truth
        this.autoSaveInterval = null;

        // Input handling
        this.keys = {};
        this.setupInput();

        // Game loop control
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;

        // Initialize game
        this.init();
    }

    init() {
        // Load saved game state if available
        this.loadGameState();

        // Create player at center of world (or loaded position)
        if (!this.player) {
            this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
        }

        // Create initial blades if none loaded
        if (this.blades.length === 0) {
            this.createInitialBlades();
        }

        // Create initial NPCs if none loaded
        if (this.npcs.length === 0) {
            this.createInitialNPCs();
        }

        // Auto-save game state periodically
        this.setupAutoSave();

        // Start game loop
        this.gameLoop();
    }

    setupAutoSave() {
        // Clear existing interval if any
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000);

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
        });
    }

    saveGameState() {
        const gameState = {
            player: {
                x: this.player.x,
                y: this.player.y,
                bladeCounts: this.player.bladeCounts
            },
            blades: this.blades.map(blade => ({
                x: blade.x,
                y: blade.y,
                color: blade.color
            })),
            npcs: this.npcs.map(npc => ({
                x: npc.x,
                y: npc.y,
                bladeCounts: npc.bladeCounts
            })),
            score: this.score,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('bladeBladeGameState', JSON.stringify(gameState));
            console.log('Game state saved successfully');
        } catch (error) {
            console.warn('Failed to save game state:', error);
        }
    }

    loadGameState() {
        try {
            const savedState = localStorage.getItem('bladeBladeGameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);

                // Check if save is not too old (1 hour max)
                const saveAge = Date.now() - gameState.timestamp;
                if (saveAge < 3600000) { // 1 hour in milliseconds

                    // Load player state
                    this.player = new Player(gameState.player.x, gameState.player.y);
                    this.player.bladeCounts = gameState.player.bladeCounts;

                    // Load blades
                    this.blades = gameState.blades.map(bladeData =>
                        new Blade(bladeData.x, bladeData.y, bladeData.color)
                    );

                    // Load NPCs
                    this.npcs = gameState.npcs.map(npcData => {
                        const npc = new NPC(npcData.x, npcData.y);
                        npc.bladeCounts = npcData.bladeCounts;
                        return npc;
                    });

                    // Load game stats
                    this.score = gameState.score;

                    console.log('Game state loaded successfully');
                } else {
                    console.log('Save file too old, starting fresh game');
                }
            }
        } catch (error) {
            console.warn('Failed to load game state, starting fresh:', error);
        }
    }

    resetGame() {
        // Clear autosave interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }

        // Clear saved game state
        localStorage.removeItem('bladeBladeGameState');

        // Reset game state
        this.gameState = 'playing';
        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
        this.blades = [];
        this.npcs = [];
        this.score = 0;

        // Hide game over overlay
        this.hideGameOver();

        // Create new game elements
        this.createInitialBlades();
        this.createInitialNPCs();

        // Re-initialize autosave
        this.setupAutoSave();

        console.log('Game reset successfully');
    }

    setupInput() {
        // Prevent default behavior for game keys to avoid scrolling
        const preventDefaultKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '];

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;

            // Prevent default for game controls to avoid page scrolling
            if (preventDefaultKeys.includes(key)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;

            // Prevent default for game controls
            if (preventDefaultKeys.includes(key)) {
                e.preventDefault();
            }
        });

        // Handle window blur/focus to reset key states
        window.addEventListener('blur', () => {
            this.keys = {};
        });

        window.addEventListener('focus', () => {
            this.keys = {};
        });
    }

    createInitialBlades() {
        // Create 20 blades of each color distributed around the world
        for (let i = 0; i < 20; i++) {
            this.blades.push(new Blade(
                Math.random() * this.worldWidth,
                Math.random() * this.worldHeight,
                'red'
            ));

            this.blades.push(new Blade(
                Math.random() * this.worldWidth,
                Math.random() * this.worldHeight,
                'yellow'
            ));

            this.blades.push(new Blade(
                Math.random() * this.worldWidth,
                Math.random() * this.worldHeight,
                'blue'
            ));
        }
    }

    createInitialNPCs() {
        // Create 5 NPCs with different starting positions
        for (let i = 0; i < 5; i++) {
            this.npcs.push(new NPC(
                Math.random() * this.worldWidth,
                Math.random() * this.worldHeight
            ));
        }
    }

    update(deltaTime) {
        // Check game state first
        if (this.gameState === 'gameover') {
            return; // Stop updating game logic during game over
        }

        // Update player
        this.player.update(deltaTime, this.keys, this.worldWidth, this.worldHeight);

        // Update camera to follow player
        this.updateCamera();

        // Update NPCs
        this.npcs.forEach(npc => npc.update(deltaTime, this.player, this.worldWidth, this.worldHeight, this));

        // Update blades (animation and effects) - ensure blade.update is called
        this.blades.forEach(blade => blade.update(deltaTime));

        // Update particles
        this.updateParticles(deltaTime);

        // Check collisions
        this.checkCollisions();

        // Check for game over condition
        this.checkGameOver();

        // Update UI
        this.updateUI();

        // Update strategic indicator
        this.updateStrategicIndicator();
    }

    updateCamera() {
        // Center camera on player
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;

        // Clamp camera to world boundaries
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldWidth - this.canvas.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldHeight - this.canvas.height));
    }

    checkCollisions() {
        // Check player-blade collisions
        this.blades = this.blades.filter(blade => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - blade.x, 2) +
                Math.pow(this.player.y - blade.y, 2)
            );

            if (distance < this.player.radius + blade.radius) {
                // Player collected blade - update player entity only
                this.player.bladeCounts[blade.color]++;
                this.score += 10;
                return false; // Remove blade from array
            }
            return true;
        });

        // Check player-NPC collisions (combat)
        this.npcs.forEach(npc => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - npc.x, 2) +
                Math.pow(this.player.y - npc.y, 2)
            );

            if (distance < this.player.radius + npc.radius) {
                this.handleCombat(this.player, npc);
            }
        });
    }

    handleCombat(player, npc) {
        // Advanced combat system with strategic elements
        const playerPower = this.calculateCombatPower(player.bladeCounts);
        const npcPower = this.calculateCombatPower(npc.bladeCounts);
        const powerDifference = Math.abs(playerPower - npcPower);

        // Combat outcomes based on power difference
        if (playerPower > npcPower) {
            // Player wins - NPC drops blades
            const dropMultiplier = Math.min(1 + (powerDifference / 100), 3);
            this.createBladeDrop(npc, dropMultiplier);

            // Score based on power difference
            this.score += 50 + Math.floor(powerDifference / 10);

            // Remove defeated NPC
            const npcIndex = this.npcs.indexOf(npc);
            if (npcIndex > -1) {
                this.npcs.splice(npcIndex, 1);
            }

            // Create new, stronger NPC after delay
            setTimeout(() => {
                const newNPC = new NPC(
                    Math.random() * this.worldWidth,
                    Math.random() * this.worldHeight
                );
                // Make new NPC slightly stronger based on player progress
                newNPC.bladeCounts.red += Math.floor(this.score / 500);
                newNPC.bladeCounts.yellow += Math.floor(this.score / 300);
                newNPC.bladeCounts.blue += Math.floor(this.score / 200);
                this.npcs.push(newNPC);
            }, 2000);

        } else if (npcPower > playerPower) {
            // NPC wins - player loses some blades
            this.playerLosesBlades(npc, powerDifference);
        }
        // If equal power, no combat outcome (stalemate)
    }

    calculateCombatPower(bladeCounts) {
        // Unified combat formula considering color hierarchy and strategic factors
        // Red (3x) > Yellow (2x) > Blue (1x) with diminishing returns
        const redValue = bladeCounts.red * 3;
        const yellowValue = bladeCounts.yellow * 2;
        const blueValue = bladeCounts.blue * 1;

        // Diminishing returns for large blade counts
        const totalBlades = bladeCounts.red + bladeCounts.yellow + bladeCounts.blue;
        const diminishingFactor = Math.min(1, 100 / (100 + totalBlades * 1.0));

        return (redValue + yellowValue + blueValue) * diminishingFactor;
    }

    playerLosesBlades(npc, powerDifference) {
        // Player loses blades based on how much stronger the NPC is
        const bladesToLose = Math.min(3, Math.floor(powerDifference / 50) + 1);

        // Lose blades in reverse color hierarchy (blue first, then yellow, then red)
        for (let i = 0; i < bladesToLose; i++) {
            if (this.player.bladeCounts.blue > 0) {
                this.player.bladeCounts.blue--;
            } else if (this.player.bladeCounts.yellow > 0) {
                this.player.bladeCounts.yellow--;
            } else if (this.player.bladeCounts.red > 0) {
                this.player.bladeCounts.red--;
            }
        }

        // Create visual feedback for blade loss
        this.createBladeLossEffect(this.player.x, this.player.y, bladesToLose);
    }

    createBladeLossEffect(x, y, count) {
        // Visual effect when player loses blades
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                // Create particle effect
                this.createParticle(x, y, '#ff0000', 5);
            }, i * 100);
        }
    }

    createParticle(x, y, color, count = 1) {
        // Create particles for visual effects
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 50 + 20;
            const size = Math.random() * 3 + 1;
            const lifetime = Math.random() * 0.5 + 0.3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                lifetime: lifetime,
                maxLifetime: lifetime
            });
        }
    }

    updateParticles(deltaTime) {
        // Update and remove expired particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.lifetime -= deltaTime;
            return particle.lifetime > 0;
        });
    }

    createBladeDrop(npc, multiplier = 1) {
        // NPC drops blades based on what it had with multiplier
        Object.entries(npc.bladeCounts).forEach(([color, count]) => {
            const bladesToDrop = Math.floor(count * multiplier);
            for (let i = 0; i < bladesToDrop; i++) {
                this.blades.push(new Blade(npc.x + Math.random() * 40 - 20, npc.y + Math.random() * 40 - 20, color));
            }
        });
    }

    updateUI() {
        // Update blade counts display from player entity (single source of truth)
        document.getElementById('red-count').textContent = this.player.bladeCounts.red;
        document.getElementById('yellow-count').textContent = this.player.bladeCounts.yellow;
        document.getElementById('blue-count').textContent = this.player.bladeCounts.blue;

        // Update score display
        document.getElementById('score').textContent = this.score;
    }

    updateStrategicIndicator() {
        const indicator = document.getElementById('strategic-indicator');

        // Check if any NPC is in strategic mode (avoiding, fleeing, or approaching)
        const strategicNPCs = this.npcs.filter(npc =>
            npc.state === 'avoiding' || npc.state === 'fleeing' || npc.state === 'approaching'
        );

        if (strategicNPCs.length > 0) {
            indicator.style.display = 'block';

            // Update indicator text based on NPC behavior
            const avoidingNPCs = this.npcs.filter(npc => npc.state === 'avoiding').length;
            const fleeingNPCs = this.npcs.filter(npc => npc.state === 'fleeing').length;
            const approachingNPCs = this.npcs.filter(npc => npc.state === 'approaching').length;

            let statusText = '战略模式: ';
            if (fleeingNPCs > 0) {
                statusText += `${fleeingNPCs}个敌人逃跑`;
            } else if (avoidingNPCs > 0) {
                statusText += `${avoidingNPCs}个敌人躲避`;
            } else if (approachingNPCs > 0) {
                statusText += `${approachingNPCs}个敌人接近`;
            }

            indicator.textContent = statusText;
        } else {
            indicator.style.display = 'none';
        }
    }

    checkGameOver() {
        // Game over condition: player has collected at least one blade and then lost all
        const totalBlades = this.player.bladeCounts.red + this.player.bladeCounts.yellow + this.player.bladeCounts.blue;

        // Only trigger game over if player had blades before and now has none
        if (totalBlades === 0 && this.player.hadBlades) {
            this.gameState = 'gameover';
            this.showGameOver();
        }

        // Track if player ever had blades
        if (totalBlades > 0) {
            this.player.hadBlades = true;
        }
    }

    showGameOver() {
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideGameOver() {
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context for camera transformation
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Render game world background grid
        this.renderGrid();

        // Render blades
        this.blades.forEach(blade => blade.render(this.ctx));

        // Render NPCs
        this.npcs.forEach(npc => npc.render(this.ctx));

        // Render player
        this.player.render(this.ctx);

        // Render particles
        this.particles.forEach(particle => {
            const alpha = particle.lifetime / particle.maxLifetime;
            this.ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Restore context
        this.ctx.restore();

        // Render FPS counter
        this.renderFPS();
    }

    renderGrid() {
        // Draw grid for visual reference
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 1;

        const gridSize = 100;
        for (let x = 0; x < this.worldWidth; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.worldHeight);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.worldHeight; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.worldWidth, y);
            this.ctx.stroke();
        }
    }

    renderFPS() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`FPS: ${Math.round(this.fps)}`, 10, this.canvas.height - 10);
    }

    gameLoop(currentTime = 0) {
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Calculate FPS
        this.fps = 1 / this.deltaTime;

        // Update game state
        this.update(this.deltaTime);

        // Render game
        this.render();

        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 300; // pixels per second
        this.acceleration = 800; // pixels per second squared
        this.friction = 600; // pixels per second squared
        this.velocity = { x: 0, y: 0 };
        this.color = '#ffffff';
        this.bladeCounts = { red: 0, yellow: 0, blue: 0 };
        this.direction = 0; // in radians
        this.hadBlades = false; // Track if player ever had blades
    }

    update(deltaTime, keys, worldWidth, worldHeight) {
        // Movement input
        let inputX = 0, inputY = 0;

        if (keys['w'] || keys['arrowup']) inputY -= 1;
        if (keys['s'] || keys['arrowdown']) inputY += 1;
        if (keys['a'] || keys['arrowleft']) inputX -= 1;
        if (keys['d'] || keys['arrowright']) inputX += 1;

        // Calculate acceleration
        const accelerationX = inputX * this.acceleration * deltaTime;
        const accelerationY = inputY * this.acceleration * deltaTime;

        // Apply acceleration to velocity
        this.velocity.x += accelerationX;
        this.velocity.y += accelerationY;

        // Apply friction
        if (Math.abs(this.velocity.x) > 0) {
            this.velocity.x -= Math.sign(this.velocity.x) * this.friction * deltaTime;
            if (Math.abs(this.velocity.x) < 1) this.velocity.x = 0;
        }

        if (Math.abs(this.velocity.y) > 0) {
            this.velocity.y -= Math.sign(this.velocity.y) * this.friction * deltaTime;
            if (Math.abs(this.velocity.y) < 1) this.velocity.y = 0;
        }

        // Limit maximum speed
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.speed) {
            this.velocity.x = (this.velocity.x / speed) * this.speed;
            this.velocity.y = (this.velocity.y / speed) * this.speed;
        }

        // Update position
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Update direction based on movement
        if (speed > 10) {
            this.direction = Math.atan2(this.velocity.y, this.velocity.x);
        }

        // Clamp to world boundaries with bounce effect
        if (this.x < this.radius) {
            this.x = this.radius;
            this.velocity.x *= -0.5; // Bounce effect
        } else if (this.x > worldWidth - this.radius) {
            this.x = worldWidth - this.radius;
            this.velocity.x *= -0.5;
        }

        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocity.y *= -0.5;
        } else if (this.y > worldHeight - this.radius) {
            this.y = worldHeight - this.radius;
            this.velocity.y *= -0.5;
        }
    }

    render(ctx) {
        // Draw player circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw player direction indicator
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const dx = Math.cos(this.direction) * this.radius * 0.8;
        const dy = Math.sin(this.direction) * this.radius * 0.8;
        ctx.lineTo(this.x + dx, this.y + dy);
        ctx.stroke();
    }
}

// Blade class
class Blade {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.color = color;
        this.colors = {
            red: '#ff4444',
            yellow: '#ffff44',
            blue: '#4444ff'
        };
        this.glowColors = {
            red: 'rgba(255, 0, 0, 0.3)',
            yellow: 'rgba(255, 255, 0, 0.3)',
            blue: 'rgba(0, 0, 255, 0.3)'
        };
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 3 - 1.5) * 0.05;
        this.pulse = 0;
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.collected = false;
    }

    update(deltaTime) {
        this.rotation += this.rotationSpeed;
        this.pulse += this.pulseSpeed;

        // Pulse effect
        const pulseScale = 1 + Math.sin(this.pulse) * 0.2;
        this.currentRadius = this.radius * pulseScale;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw glow effect
        ctx.fillStyle = this.glowColors[this.color];
        ctx.beginPath();
        ctx.arc(0, 0, this.currentRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw blade shape with gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.currentRadius);
        gradient.addColorStop(0, this.colors[this.color]);
        gradient.addColorStop(1, this.darkenColor(this.colors[this.color], 0.7));

        ctx.fillStyle = gradient;
        ctx.beginPath();

        // More detailed blade shape
        ctx.moveTo(0, -this.currentRadius);
        ctx.lineTo(this.currentRadius * 0.6, -this.currentRadius * 0.3);
        ctx.lineTo(this.currentRadius * 0.8, 0);
        ctx.lineTo(this.currentRadius * 0.6, this.currentRadius * 0.3);
        ctx.lineTo(0, this.currentRadius);
        ctx.lineTo(-this.currentRadius * 0.6, this.currentRadius * 0.3);
        ctx.lineTo(-this.currentRadius * 0.8, 0);
        ctx.lineTo(-this.currentRadius * 0.6, -this.currentRadius * 0.3);
        ctx.closePath();
        ctx.fill();

        // Draw blade edge
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
    }

    darkenColor(color, factor) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        return `#${Math.round(r * factor).toString(16).padStart(2, '0')}${Math.round(g * factor).toString(16).padStart(2, '0')}${Math.round(b * factor).toString(16).padStart(2, '0')}`;
    }
}

// NPC class
class NPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 120;
        this.color = '#ff88ff';
        this.bladeCounts = {
            red: Math.floor(Math.random() * 3),
            yellow: Math.floor(Math.random() * 5),
            blue: Math.floor(Math.random() * 7)
        };
        this.state = 'wandering'; // wandering, chasing, fleeing, avoiding
        this.wanderDirection = Math.random() * Math.PI * 2;
        this.wanderTimer = 0;
        this.chaseTimer = 0;
        this.avoidanceTimer = 0;
        this.personality = Math.random(); // 0-1, determines behavior patterns
        this.awarenessRadius = 400;
        this.aggressionRadius = 200;
        this.fleeRadius = 150;
    }

    update(deltaTime, player, worldWidth, worldHeight, game) {
        const distanceToPlayer = Math.sqrt(
            Math.pow(this.x - player.x, 2) +
            Math.pow(this.y - player.y, 2)
        );

        // Calculate power difference using unified formula (same as player)
        const playerPower = game.calculateCombatPower(player.bladeCounts);
        const npcPower = game.calculateCombatPower(this.bladeCounts);
        const powerDifference = playerPower - npcPower;

        // Strategic AI behavior
        if (distanceToPlayer < this.fleeRadius && powerDifference > 20) {
            // Flee if player is much stronger and close
            this.state = 'fleeing';
            this.fleeFromPlayer(deltaTime, player);
        } else if (distanceToPlayer < this.aggressionRadius && powerDifference < 30) {
            // Chase if player is within aggression range and not too strong
            this.state = 'chasing';
            this.chasePlayer(deltaTime, player);
            this.chaseTimer += deltaTime;
        } else if (distanceToPlayer < this.awarenessRadius) {
            // Strategic movement based on power difference
            if (powerDifference > 50) {
                // Avoid player if much stronger
                this.state = 'avoiding';
                this.avoidPlayer(deltaTime, player);
            } else if (powerDifference < -20) {
                // Approach cautiously if weaker
                this.state = 'approaching';
                this.approachPlayer(deltaTime, player);
            } else {
                // Circle around player if evenly matched
                this.state = 'circling';
                this.circlePlayer(deltaTime, player);
            }
        } else {
            // Wander randomly
            this.state = 'wandering';
            this.wander(deltaTime);
        }

        // Clamp to world boundaries
        this.x = Math.max(this.radius, Math.min(this.x, worldWidth - this.radius));
        this.y = Math.max(this.radius, Math.min(this.y, worldHeight - this.radius));
    }

    // calculateCombatPower removed - using unified function from BladeGame

    fleeFromPlayer(deltaTime, player) {
        const angle = Math.atan2(this.y - player.y, this.x - player.x);
        this.x += Math.cos(angle) * this.speed * 1.2 * deltaTime;
        this.y += Math.sin(angle) * this.speed * 1.2 * deltaTime;
    }

    chasePlayer(deltaTime, player) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed * deltaTime;
        this.y += Math.sin(angle) * this.speed * deltaTime;
    }

    avoidPlayer(deltaTime, player) {
        const angle = Math.atan2(this.y - player.y, this.x - player.x);
        // Move perpendicular to escape path for more strategic avoidance
        const perpendicularAngle = angle + (Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
        this.x += Math.cos(perpendicularAngle) * this.speed * 0.8 * deltaTime;
        this.y += Math.sin(perpendicularAngle) * this.speed * 0.8 * deltaTime;
    }

    approachPlayer(deltaTime, player) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Approach slowly and cautiously
        this.x += Math.cos(angle) * this.speed * 0.6 * deltaTime;
        this.y += Math.sin(angle) * this.speed * 0.6 * deltaTime;
    }

    circlePlayer(deltaTime, player) {
        const distance = Math.sqrt(
            Math.pow(this.x - player.x, 2) +
            Math.pow(this.y - player.y, 2)
        );
        const idealDistance = 250;

        if (distance > idealDistance) {
            // Move closer
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            this.x += Math.cos(angle) * this.speed * 0.7 * deltaTime;
            this.y += Math.sin(angle) * this.speed * 0.7 * deltaTime;
        } else {
            // Circle around player
            const currentAngle = Math.atan2(this.y - player.y, this.x - player.x);
            const circleAngle = currentAngle + (Math.PI / 4) * deltaTime;
            this.x = player.x + Math.cos(circleAngle) * idealDistance;
            this.y = player.y + Math.sin(circleAngle) * idealDistance;
        }
    }

    wander(deltaTime) {
        this.wanderTimer -= deltaTime;

        if (this.wanderTimer <= 0) {
            this.wanderDirection = Math.random() * Math.PI * 2;
            this.wanderTimer = Math.random() * 3 + 1; // 1-4 seconds
        }

        this.x += Math.cos(this.wanderDirection) * this.speed * 0.4 * deltaTime;
        this.y += Math.sin(this.wanderDirection) * this.speed * 0.4 * deltaTime;
    }

    render(ctx) {
        // Draw NPC circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw blade indicators around NPC
        Object.entries(this.bladeCounts).forEach(([color, count]) => {
            if (count > 0) {
                const angle = Math.PI * 2 * (color === 'red' ? 0 : color === 'yellow' ? 0.33 : 0.66);
                const indicatorRadius = this.radius + 5;

                ctx.fillStyle = this.getColor(color);
                ctx.beginPath();
                ctx.arc(
                    this.x + Math.cos(angle) * indicatorRadius,
                    this.y + Math.sin(angle) * indicatorRadius,
                    3, 0, Math.PI * 2
                );
                ctx.fill();
            }
        });
    }

    getColor(color) {
        const colors = {
            red: '#ff4444',
            yellow: '#ffff44',
            blue: '#4444ff'
        };
        return colors[color];
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new BladeGame();
    // Expose game instance for debugging
    window.game = game;
    document.getElementById('game-canvas').__game = game;

    // Setup restart button functionality
    document.getElementById('restart-button').addEventListener('click', () => {
        game.resetGame();
    });

    document.getElementById('restart-game-button').addEventListener('click', () => {
        game.resetGame();
    });
});