import { _decorator, Button, Color, Component, Label, Node, UITransform, v3 } from 'cc';
import { Colors } from '../config/ColorScheme';
import { VISIBLE_LADDER_ITEMS } from '../config/Constants';

const { ccclass } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
  private scoreLabel: Label | null = null;
  private balanceLabel: Label | null = null;
  private bestLabel: Label | null = null;
  private bannerLabel: Label | null = null;
  private ladderLabels: Label[] = [];
  private controlsLocked = false;
  private controlBar: Node | null = null;
  private betValueLabel: Label | null = null;
  private difficultyValueLabel: Label | null = null;

  onBetDown: (() => void) | null = null;
  onBetUp: (() => void) | null = null;
  onDifficultyDown: (() => void) | null = null;
  onDifficultyUp: (() => void) | null = null;

  build(root: Node): void {
    const hudRoot = root.getChildByName('HUD') ?? root;
    const bannerRoot = root.getChildByName('ResultBanner') ?? root;
    const controlRoot = root.getChildByName('ControlBar') ?? root;
    const ladderRoot = root.getChildByName('Ladder') ?? root;

    const hud = this.createLabel(hudRoot, 'HUD_Score', -460, 30, 'Score: 0', 38, Colors.text);
    this.scoreLabel = hud;
    this.balanceLabel = this.createLabel(hudRoot, 'HUD_Balance', -460, -20, 'Balance: 0', 30, Colors.text);
    this.bestLabel = this.createLabel(hudRoot, 'HUD_Best', 250, 30, 'Best: 0', 34, Colors.text);

    this.bannerLabel = bannerRoot.getComponent(Label) ?? this.createLabel(bannerRoot, 'ResultBannerText', 0, 0, '', 56, Colors.neonLime);
    this.bannerLabel.node.setPosition(v3(0, 0, 0));

    this.createControlBar(controlRoot);
    this.createLadder(ladderRoot);
  }

  setLocked(locked: boolean): void {
    this.controlsLocked = locked;
  }

  updateHUD(score: number, balance: number, best: number): void {
    if (this.scoreLabel) this.scoreLabel.string = `Score: ${score}`;
    if (this.balanceLabel) this.balanceLabel.string = `Balance: ${balance}`;
    if (this.bestLabel) this.bestLabel.string = `Best: ${best}`;
  }

  showResultBanner(text: string, success: boolean): void {
    if (!this.bannerLabel) return;
    this.bannerLabel.string = text;
    this.bannerLabel.color = success ? Colors.neonLime : Colors.fail;
  }

  updateLadder(values: number[], activeIndex: number): void {
    for (let i = 0; i < this.ladderLabels.length; i += 1) {
      const value = values[i] ?? 1;
      const label = this.ladderLabels[i];
      label.string = `${value.toFixed(2)}x`;
      label.color = i === activeIndex ? Colors.neonPink : Colors.text;
    }
  }

  setControlLabels(bet: number, difficultyLabel: string): void {
    if (this.betValueLabel) this.betValueLabel.string = `Bet: ${bet}`;
    if (this.difficultyValueLabel) this.difficultyValueLabel.string = difficultyLabel;
  }

  private createControlBar(root: Node): void {
    const reused = root.name === 'ControlBar';
    const bar = reused ? root : new Node('ControlBar');
    if (!bar.parent) bar.parent = root;
    if (!reused) bar.setPosition(v3(0, -860, 0));
    if (!bar.getComponent(UITransform)) {
      const ui = bar.addComponent(UITransform);
      ui.setContentSize(1000, 150);
    }

    const betValue = this.createLabel(bar, 'BetValue', -260, 0, 'Bet: 10', 30, Colors.text);
    betValue.node.name = 'BetValue';
    const diffValue = this.createLabel(bar, 'DifficultyValue', 250, 0, 'Normal', 30, Colors.text);
    diffValue.node.name = 'DifficultyValue';
    this.controlBar = bar;
    this.betValueLabel = betValue;
    this.difficultyValueLabel = diffValue;

    this.createActionLabel(bar, 'Bet-', -420, 0, '<', () => this.onBetDown?.());
    this.createActionLabel(bar, 'Bet+', -110, 0, '>', () => this.onBetUp?.());
    this.createActionLabel(bar, 'Diff-', 80, 0, '<', () => this.onDifficultyDown?.());
    this.createActionLabel(bar, 'Diff+', 420, 0, '>', () => this.onDifficultyUp?.());
  }

  private createLadder(root: Node): void {
    const reused = root.name === 'Ladder';
    const ladder = reused ? root : new Node('Ladder');
    if (!ladder.parent) ladder.parent = root;
    if (!reused) ladder.setPosition(v3(430, -180, 0));
    if (!ladder.getComponent(UITransform)) {
      const ui = ladder.addComponent(UITransform);
      ui.setContentSize(180, 1080);
    }

    for (let i = 0; i < VISIBLE_LADDER_ITEMS; i += 1) {
      const label = this.createLabel(ladder, `Ladder_${i}`, 0, i * 90, `${(1 + i * 0.1).toFixed(2)}x`, 28, Colors.text);
      this.ladderLabels.push(label);
    }
  }

  private createActionLabel(parent: Node, name: string, x: number, y: number, text: string, cb: () => void): void {
    const label = this.createLabel(parent, name, x, y, text, 48, Colors.neonBlue);
    const ui = label.node.getComponent(UITransform);
    if (ui) ui.setContentSize(90, 90);
    label.node.addComponent(Button);
    const handler = () => {
      if (!this.controlsLocked) cb();
    };
    label.node.on(Node.EventType.TOUCH_END, handler);
    label.node.on(Node.EventType.MOUSE_UP, handler);
  }

  private createLabel(parent: Node, name: string, x: number, y: number, text: string, size: number, color: Color): Label {
    const node = parent.getChildByName(name) ?? new Node(name);
    if (!node.parent) node.parent = parent;
    node.setPosition(v3(x, y, 0));
    const ui = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    ui.setContentSize(420, 70);
    const label = node.getComponent(Label) ?? node.addComponent(Label);
    label.string = text;
    label.fontSize = size;
    label.lineHeight = size + 8;
    label.color = color;
    return label;
  }
}
