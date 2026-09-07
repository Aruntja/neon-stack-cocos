# Neon Stack (Cocos Creator 3.x)

Ready-to-play Cocos Creator project for **Neon Stack**.

## Quick Start

1. Clone this repository.
2. Open **Cocos Creator 3.8+**.
3. Choose **Open** and select your cloned `neon-stack-cocos` project folder.
4. Open scene: `assets/scenes/GameScene.scene`
5. Click **Play**.

No imports, extra setup, or build steps are required.

## Controls

- **Tap / click** anywhere to drop the swinging block.
- Use **Bet** stepper (`<` `>`) in the bottom control bar.
- Use **Difficulty** stepper (`<` `>`) in the bottom control bar.
- Difficulty and bet controls lock while a block is in motion.

## Implemented Features

- 1080×1920 portrait game scene
- Pendulum swing intro and block drop
- X-axis target slide while falling
- Squash-spring landing animation
- Multiplier ladder (8 visible values)
- Bottom HUD/control bar + result banner
- Loss demolition animation (top-down vanish + debris)
- Camera framing/easing (`CAM_LERP`, `CAM_LERP_RESET`)
- Particle burst and debris effects
- LocalStorage persistence (balance and best score)
- Mock backend round generation + difficulty profiles
- Full game state flow (idle, swinging, dropping, resolving, lost)

## Project Structure

- `project.json`, `package.json`, `tsconfig.json`
- `assets/scenes/GameScene.scene`
- `assets/resources/prefabs/blocks` (Base, Floor, Swing)
- `assets/resources/prefabs/ui` (HUD, ControlBar, ResultBanner, Ladder)
- `assets/resources/prefabs/effects` (Debris, Particles)
- `assets/scripts/core` (GameManager, CameraController, PhysicsSimulator, UIManager)
- `assets/scripts/controllers` (Block, Swing, Debris, Particle)
- `assets/scripts/services` (Backend, Storage, Animation)
- `assets/scripts/config` (Constants, DifficultyConfig, ColorScheme)
- `assets/scripts/types` (Types)

## Customization Guide

- **Gameplay constants**: `assets/scripts/config/Constants.ts`
- **Difficulty tuning**: `assets/scripts/config/DifficultyConfig.ts`
- **Colors / neon palette**: `assets/scripts/config/ColorScheme.ts`
- **Round generation logic**: `assets/scripts/services/BackendService.ts`
- **Persistence keys and defaults**: `assets/scripts/services/StorageService.ts`
