import { _decorator, Component, Graphics, UITransform, v3 } from 'cc';
import { Colors } from '../config/ColorScheme';

const { ccclass } = _decorator;

@ccclass('DebrisController')
export class DebrisController extends Component {
  private velocity = v3((Math.random() * 2 - 1) * 420, 600 + Math.random() * 200, 0);

  start(): void {
    const ui = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    ui.setContentSize(26, 26);
    const g = this.node.getComponent(Graphics) ?? this.node.addComponent(Graphics);
    g.clear();
    g.fillColor = Colors.neonPink;
    g.rect(-13, -13, 26, 26);
    g.fill();
  }

  update(dt: number): void {
    this.velocity.y -= 1900 * dt;
    const pos = this.node.position;
    this.node.setPosition(v3(pos.x + this.velocity.x * dt, pos.y + this.velocity.y * dt, 0));
    if (this.node.position.y < -1100) this.node.destroy();
  }
}
