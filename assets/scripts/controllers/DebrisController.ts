import { _decorator, Component, v3 } from 'cc';

const { ccclass } = _decorator;

@ccclass('DebrisController')
export class DebrisController extends Component {
  private velocity = v3((Math.random() * 2 - 1) * 420, 600 + Math.random() * 200, 0);

  update(dt: number): void {
    this.velocity.y -= 1900 * dt;
    const pos = this.node.position;
    this.node.setPosition(v3(pos.x + this.velocity.x * dt, pos.y + this.velocity.y * dt, 0));
    if (this.node.position.y < -1100) this.node.destroy();
  }
}
