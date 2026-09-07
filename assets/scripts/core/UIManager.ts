import { _decorator, Color, Component, Label, Node, UITransform, v3 } from 'cc';
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
    const hud = this.createLabel(root, 'HUD_Score', -460, 860, 'Score: 0', 38, Colors.text);
    this.scoreLabel = hud;
    this.balanceLabel = this.createLabel(root, 'HUD_Balance', -460, 810, 'Balance: 0', 30, Colors.text);
    this.bestLabel = this.createLabel(root, 'HUD_Best', 250, 860, 'Best: 0', 34, Colors.text);
    this.bannerLabel = this.createLabel(root, 'ResultBanner', 0, 620, '', 56, Colors.neonLime);

    this.createControlBar(root);
    this.createLadder(root);
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
    const bar = new Node('ControlBar');
    bar.parent = root;
    bar.setPosition(v3(0, -860, 0));
    const ui = bar.addComponent(UITransform);
    ui.setContentSize(1000, 150);

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
    const ladder = new Node('Ladder');
    ladder.parent = root;
    ladder.setPosition(v3(430, -180, 0));
    const ui = ladder.addComponent(UITransform);
    ui.setContentSize(180, 1080);

    for (let i = 0; i < VISIBLE_LADDER_ITEMS; i += 1) {
      const label = this.createLabel(ladder, `Ladder_${i}`, 0, i * 90, `${(1 + i * 0.1).toFixed(2)}x`, 28, Colors.text);
      this.ladderLabels.push(label);
    }
  }

  private createActionLabel(parent: Node, name: string, x: number, y: number, text: string, cb: () => void): void {
    const label = this.createLabel(parent, name, x, y, text, 48, Colors.neonBlue);
    label.node.on(Node.EventType.TOUCH_END, () => {
      if (!this.controlsLocked) cb();
    });
  }

  private createLabel(parent: Node, name: string, x: number, y: number, text: string, size: number, color: Color): Label {
    const node = new Node(name);
    node.parent = parent;
    node.setPosition(v3(x, y, 0));
    const ui = node.addComponent(UITransform);
    ui.setContentSize(420, 70);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = size;
    label.lineHeight = size + 8;
    label.color = color;
    return label;
  }
}
