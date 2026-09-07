import { _decorator, Component, Graphics, UITransform, v3 } from 'cc';
import { Colors } from '../config/ColorScheme';

const { ccclass } = _decorator;

@ccclass('SwingController')
export class SwingController extends Component {
  public speed = 1.1;
  public range = 220;
  public baseY = 620;

  private t = 0;

  start(): void {
    const ui = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    ui.setContentSize(20, 240);
    const g = this.node.getComponent(Graphics) ?? this.node.addComponent(Graphics);
    g.clear();
    g.fillColor = Colors.text;
    g.rect(-3, -240, 6, 240);
    g.fill();
  }

  update(dt: number): void {
    this.t += dt * this.speed;
    const x = Math.sin(this.t) * this.range;
    this.node.setPosition(v3(x, this.baseY, 0));
  }
}
