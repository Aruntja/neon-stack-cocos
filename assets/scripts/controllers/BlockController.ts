import { _decorator, Color, Component, Node, Sprite, UITransform } from 'cc';
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
    const sprite = this.node.getComponent(Sprite);
    if (sprite) sprite.color = color;
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

    let sprite = this.node.getComponent(Sprite);
    if (!sprite) sprite = this.node.addComponent(Sprite);
    if (!sprite.color || sprite.color.equals(Color.TRANSPARENT)) {
      sprite.color = Colors.neonBlue;
    }
  }
}
