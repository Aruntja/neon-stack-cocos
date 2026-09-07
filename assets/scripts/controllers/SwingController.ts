import { _decorator, Component, Node, v3 } from 'cc';

const { ccclass } = _decorator;

@ccclass('SwingController')
export class SwingController extends Component {
  public speed = 1.1;
  public range = 220;
  public baseY = 620;

  private t = 0;

  update(dt: number): void {
    this.t += dt * this.speed;
    const x = Math.sin(this.t) * this.range;
    this.node.setPosition(v3(x, this.baseY, 0));
  }
}
