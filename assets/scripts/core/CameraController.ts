import { _decorator, Camera, Component, Node, v3 } from 'cc';
import { CAM_LERP, CAM_LERP_RESET } from '../config/Constants';

const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
  @property(Camera)
  camera: Camera | null = null;

  private targetY = 0;
  private currentY = 0;
  private lerp = CAM_LERP;

  onLoad(): void {
    if (!this.camera) {
      this.camera = this.getComponent(Camera);
    }
    this.currentY = this.node.position.y;
    this.targetY = this.currentY;
  }

  focusTower(topY: number): void {
    this.lerp = CAM_LERP;
    this.targetY = Math.max(0, topY - 120);
  }

  reset(): void {
    this.lerp = CAM_LERP_RESET;
    this.targetY = 0;
  }

  update(): void {
    this.currentY += (this.targetY - this.currentY) * this.lerp;
    const p = this.node.position;
    this.node.setPosition(v3(p.x, this.currentY, p.z));
  }
}
