import { _decorator, Color, Component, Graphics, UITransform } from 'cc';
import { BLOCK_HEIGHT, BLOCK_WIDTH } from '../config/Constants';
import { Colors } from '../config/ColorScheme';

const { ccclass } = _decorator;

@ccclass('BlockController')
export class BlockController extends Component {
  public width = BLOCK_WIDTH;
  public height = BLOCK_HEIGHT;

  start(): void {
    this.ensureVisual();
  }

  setColor(color: Color): void {
    this.ensureVisual();
    const graphics = this.node.getComponent(Graphics);
    if (graphics) {
      graphics.clear();
      graphics.fillColor = color;
      graphics.roundRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height, 14);
      graphics.fill();
    }
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.ensureVisual();
  }

  private ensureVisual(): void {
    let ui = this.node.getComponent(UITransform);
    if (!ui) ui = this.node.addComponent(UITransform);
    ui.setContentSize(this.width, this.height);

    let graphics = this.node.getComponent(Graphics);
    if (!graphics) graphics = this.node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = Colors.neonBlue;
    graphics.roundRect(-this.width * 0.5, -this.height * 0.5, this.width, this.height, 14);
    graphics.fill();
  }
}
