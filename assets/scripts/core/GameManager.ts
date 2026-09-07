import {
  _decorator,
  Camera,
  Component,
  instantiate,
  Node,
  Prefab,
  resources,
  Vec3,
  UITransform,
  v3
} from 'cc';
import { Colors } from '../config/ColorScheme';
import { BLOCK_HEIGHT, BLOCK_WIDTH, DEMOLITION_STEP, FLOOR_Y, INITIAL_BET, STACK_START_Y } from '../config/Constants';
import { DifficultyLevels } from '../config/DifficultyConfig';
import { BlockController } from '../controllers/BlockController';
import { ParticleController } from '../controllers/ParticleController';
import { SwingController } from '../controllers/SwingController';
import { BackendService } from '../services/BackendService';
import { AnimationManager } from '../services/AnimationManager';
import { StorageService } from '../services/StorageService';
import { GameState, RoundConfig } from '../types/Types';
import { CameraController } from './CameraController';
import { PhysicsSimulator } from './PhysicsSimulator';
import { UIManager } from './UIManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  private gameState: GameState = GameState.Idle;
  private backend = new BackendService();
  private storage = new StorageService();
  private animation = new AnimationManager();

  private uiManager!: UIManager;
  private physics!: PhysicsSimulator;
  private cameraController!: CameraController;
  private particleController!: ParticleController;

  private gameLayer!: Node;
  private effectsLayer!: Node;
  private uiLayer!: Node;

  @property(Prefab)
  private blockPrefab: Prefab | null = null;
  @property(Prefab)
  private floorPrefab: Prefab | null = null;
  @property(Prefab)
  private swingPrefab: Prefab | null = null;
  @property(Prefab)
  private debrisPrefab: Prefab | null = null;
  @property(Prefab)
  private hudPrefab: Prefab | null = null;
  @property(Prefab)
  private controlBarPrefab: Prefab | null = null;
  @property(Prefab)
  private resultBannerPrefab: Prefab | null = null;
  @property(Prefab)
  private ladderPrefab: Prefab | null = null;
  @property(Prefab)
  private particlesPrefab: Prefab | null = null;

  private swingNode: Node | null = null;
  private currentBlock: Node | null = null;
  private stackBlocks: Node[] = [];

  private balance = 0;
  private bestScore = 0;
  private score = 0;
  private bet = INITIAL_BET;
  private difficultyIndex = 1;
  private round: RoundConfig | null = null;
  private settledMultiplier = 1;

  onLoad(): void {
    this.ensureRootNodes();
    this.ensureManagers();
    this.bindControls();
    this.gameLayer.on(Node.EventType.TOUCH_END, this.onDropRequest, this);
    this.gameLayer.on(Node.EventType.MOUSE_UP, this.onDropRequest, this);
  }

  async start(): Promise<void> {
    await this.loadPrefabs();
    this.instantiateStaticPrefabs();
    const progress = this.storage.read();
    this.balance = progress.balance;
    this.bestScore = progress.bestScore;
    this.uiManager.build(this.uiLayer);
    this.refreshHUD();
    await this.startRound();
  }

  onDestroy(): void {
    this.gameLayer.off(Node.EventType.TOUCH_END, this.onDropRequest, this);
    this.gameLayer.off(Node.EventType.MOUSE_UP, this.onDropRequest, this);
  }

  private ensureRootNodes(): void {
    this.gameLayer = this.node.getChildByName('GameLayer') ?? new Node('GameLayer');
    this.effectsLayer = this.node.getChildByName('EffectsLayer') ?? new Node('EffectsLayer');
    this.uiLayer = this.node.getChildByName('UILayer') ?? new Node('UILayer');

    for (const layer of [this.gameLayer, this.effectsLayer, this.uiLayer]) {
      if (!layer.parent) layer.parent = this.node;
      if (!layer.getComponent(UITransform)) {
        const ui = layer.addComponent(UITransform);
        ui.setContentSize(1080, 1920);
      }
    }
  }

  private ensureManagers(): void {
    this.uiManager = this.getComponent(UIManager) ?? this.addComponent(UIManager);
    this.physics = this.getComponent(PhysicsSimulator) ?? this.addComponent(PhysicsSimulator);
    this.particleController = this.getComponent(ParticleController) ?? this.addComponent(ParticleController);

    let cameraNode = this.node.getChildByName('GameCamera');
    if (!cameraNode) {
      cameraNode = new Node('GameCamera');
      cameraNode.parent = this.node;
      cameraNode.setPosition(v3(0, 0, 1000));
      cameraNode.addComponent(Camera);
    }
    this.cameraController = cameraNode.getComponent(CameraController) ?? cameraNode.addComponent(CameraController);
  }

  private bindControls(): void {
    this.uiManager.onBetDown = () => {
      this.bet = Math.max(1, this.bet - 1);
      this.refreshHUD();
    };
    this.uiManager.onBetUp = () => {
      this.bet = Math.max(1, Math.min(Math.max(this.balance, 1), this.bet + 1));
      this.refreshHUD();
    };
    this.uiManager.onDifficultyDown = () => {
      this.difficultyIndex = (this.difficultyIndex - 1 + DifficultyLevels.length) % DifficultyLevels.length;
      this.refreshHUD();
    };
    this.uiManager.onDifficultyUp = () => {
      this.difficultyIndex = (this.difficultyIndex + 1) % DifficultyLevels.length;
      this.refreshHUD();
    };
  }

  private async loadPrefabs(): Promise<void> {
    const load = (path: string): Promise<Prefab | null> =>
      new Promise((resolve) => {
        resources.load(path, Prefab, (err: Error | null, prefab: Prefab) => {
          if (err || !prefab) {
            console.error(`[GameManager] Failed to load prefab at resources/${path}`, err);
            resolve(null);
            return;
          }
          resolve(prefab);
        });
      });

    const loadedPrefabs = await Promise.all([
      load('prefabs/blocks/Base'),
      load('prefabs/blocks/Floor'),
      load('prefabs/blocks/Swing'),
      load('prefabs/effects/Debris'),
      load('prefabs/ui/HUD'),
      load('prefabs/ui/ControlBar'),
      load('prefabs/ui/ResultBanner'),
      load('prefabs/ui/Ladder'),
      load('prefabs/effects/Particles')
    ]);

    [
      this.blockPrefab,
      this.floorPrefab,
      this.swingPrefab,
      this.debrisPrefab,
      this.hudPrefab,
      this.controlBarPrefab,
      this.resultBannerPrefab,
      this.ladderPrefab,
      this.particlesPrefab
    ] = loadedPrefabs;
  }

  private instantiateStaticPrefabs(): void {
    this.spawnStaticPrefab(this.hudPrefab, this.uiLayer, 'HUD', 0, 830);
    this.spawnStaticPrefab(this.controlBarPrefab, this.uiLayer, 'ControlBar', 0, -860);
    this.spawnStaticPrefab(this.resultBannerPrefab, this.uiLayer, 'ResultBanner', 0, 620);
    this.spawnStaticPrefab(this.ladderPrefab, this.uiLayer, 'Ladder', 430, -180);
    this.spawnStaticPrefab(this.particlesPrefab, this.effectsLayer, 'Particles', 0, 0);
  }

  private async startRound(): Promise<void> {
    if (this.balance < this.bet) {
      this.uiManager.showResultBanner('Insufficient balance', false);
      return;
    }

    this.clearTower();
    this.score = 0;
    this.gameState = GameState.Idle;
    this.round = await this.backend.generateRound(DifficultyLevels[this.difficultyIndex].id);

    const floor = this.makeBlockNode('Floor', this.floorPrefab, Colors.dim);
    floor.setPosition(v3(0, FLOOR_Y, 0));
    this.gameLayer.addChild(floor);

    const base = this.makeBlockNode('Base', this.blockPrefab, Colors.neonBlue);
    base.setPosition(v3(0, STACK_START_Y, 0));
    this.gameLayer.addChild(base);
    this.stackBlocks = [base];
    this.settledMultiplier = 1;

    this.balance -= this.bet;
    this.persist();

    this.uiManager.showResultBanner('Tap to drop', true);
    this.uiManager.updateLadder(this.round.multipliers.slice(0, 8), 0);
    this.refreshHUD();
    this.spawnSwing();
  }

  private spawnSwing(): void {
    if (!this.round) return;

    if (this.swingNode?.isValid) {
      this.swingNode.destroy();
      this.swingNode = null;
    }

    const swing = this.swingPrefab ? (instantiate(this.swingPrefab) as Node) : new Node('Swing');
    swing.name = 'Swing';
    swing.parent = this.gameLayer;
    const swingController = swing.getComponent(SwingController) ?? swing.addComponent(SwingController);
    swingController.speed = this.round.difficulty.swingSpeed;
    swingController.range = this.round.difficulty.swingRange;
    if (!this.swingPrefab) {
      swing.setPosition(v3(0, swingController.baseY, 0));
    }

    const block = this.makeBlockNode('FallingBlock', this.blockPrefab, Colors.neonPink);
    block.parent = swing;
    block.setPosition(v3(0, -120, 0));

    this.swingNode = swing;
    this.currentBlock = block;
    this.gameState = GameState.Swinging;
    this.uiManager.setLocked(true);
  }

  private onDropRequest(): void {
    if (this.gameState !== GameState.Swinging || !this.currentBlock || !this.round || !this.swingNode) return;

    const top = this.stackBlocks[this.stackBlocks.length - 1];
    const targetY = top.position.y + BLOCK_HEIGHT;

    const world = this.currentBlock.worldPosition;
    this.currentBlock.parent = this.gameLayer;
    this.currentBlock.setWorldPosition(world);

    this.swingNode.destroy();
    this.swingNode = null;

    const dropped = this.currentBlock;
    this.currentBlock = null;
    this.gameState = GameState.Dropping;

    this.physics.simulateDrop(
      dropped,
      this.round.targetX,
      targetY,
      this.round.difficulty.dropSpeed,
      this.round.difficulty.horizontalAssist,
      (x: number) => {
        const topX = top.position.x;
        const overlap = Math.max(0, BLOCK_WIDTH - Math.abs(x - topX));
        return { success: overlap > BLOCK_WIDTH * 0.35, overlapRatio: overlap / BLOCK_WIDTH };
      },
      (result) => this.resolveLanding(dropped, result.success)
    );
  }

  private resolveLanding(block: Node, success: boolean): void {
    this.gameState = GameState.Resolving;

    if (success) {
      this.stackBlocks.push(block);
      this.animation.squash(block);
      this.particleController.burst(this.effectsLayer, block.position.x, block.position.y + 20);

      this.score += 1;
      const multi = this.round?.multipliers[Math.min(this.score - 1, (this.round?.multipliers.length ?? 1) - 1)] ?? 1;
      const deltaMultiplier = Math.max(0, multi - this.settledMultiplier);
      if (deltaMultiplier > 0) {
        this.balance += Math.floor(this.bet * deltaMultiplier);
        this.persist();
        this.settledMultiplier = multi;
      }
      this.uiManager.updateLadder((this.round?.multipliers ?? []).slice(0, 8), Math.min(this.score, 7));
      this.uiManager.showResultBanner(`Perfect! ${multi.toFixed(2)}x`, true);

      this.cameraController.focusTower(block.position.y);
      this.refreshHUD();
      this.spawnSwing();
      return;
    }

    this.gameState = GameState.Lost;
    this.uiManager.showResultBanner('Missed! Round lost', false);
    this.uiManager.setLocked(false);

    this.bestScore = Math.max(this.bestScore, this.score);
    this.persist();
    this.refreshHUD();

    this.demolishTower();
  }

  private demolishTower(): void {
    for (let i = this.stackBlocks.length - 1; i >= 1; i -= 1) {
      const block = this.stackBlocks[i];
      const worldPos = block.getWorldPosition(new Vec3());
      this.animation.fadeOutAndDestroy(block, (this.stackBlocks.length - 1 - i) * DEMOLITION_STEP);
      if (this.debrisPrefab && block.isValid) {
        for (let p = 0; p < 3; p += 1) {
          const debris = instantiate(this.debrisPrefab) as Node;
          debris.parent = this.effectsLayer;
          debris.setWorldPosition(worldPos);
        }
      }
    }

    this.scheduleOnce(() => {
      if (!this.isValid || !this.node?.isValid) return;
      this.cameraController.reset();
      this.startRound();
    }, 1.1);
  }

  private makeBlockNode(name: string, prefab: Prefab | null, color: any): Node {
    const node = prefab ? (instantiate(prefab) as Node) : new Node(name);
    node.name = name;
    const block = node.getComponent(BlockController) ?? node.addComponent(BlockController);
    block.setSize(BLOCK_WIDTH, BLOCK_HEIGHT);
    block.setColor(color);
    return node;
  }

  private spawnStaticPrefab(prefab: Prefab | null, parent: Node, name: string, x: number, y: number): void {
    if (!prefab) return;
    if (parent.getChildByName(name)) return;
    const node = instantiate(prefab) as Node;
    node.name = name;
    node.parent = parent;
    node.setPosition(v3(x, y, 0));
  }

  private clearTower(): void {
    for (const child of this.gameLayer.children.slice()) {
      child.destroy();
    }
    this.stackBlocks = [];
  }

  private refreshHUD(): void {
    this.uiManager?.updateHUD(this.score, this.balance, this.bestScore);
    this.uiManager?.setControlLabels(this.bet, DifficultyLevels[this.difficultyIndex].label);
  }

  private persist(): void {
    this.storage.write({ balance: this.balance, bestScore: this.bestScore });
  }
}
