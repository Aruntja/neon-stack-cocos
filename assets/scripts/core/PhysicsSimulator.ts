import { _decorator, Component, Node, v3 } from 'cc';
import { DROP_GRAVITY, DROP_HORIZONTAL_LERP } from '../config/Constants';
import { LandingResult } from '../types/Types';

const { ccclass } = _decorator;

type DropState = {
  node: Node;
  targetX: number;
  targetY: number;
  speedY: number;
  assist: number;
  validate: (x: number) => LandingResult;
  onDone: (result: LandingResult) => void;
};

@ccclass('PhysicsSimulator')
export class PhysicsSimulator extends Component {
  private activeDrop: DropState | null = null;

  simulateDrop(
    node: Node,
    targetX: number,
    targetY: number,
    initialSpeed: number,
    assist: number,
    validate: (x: number) => LandingResult,
    onDone: (result: LandingResult) => void
  ): void {
    this.activeDrop = { node, targetX, targetY, speedY: initialSpeed, assist, validate, onDone };
  }

  update(dt: number): void {
    if (!this.activeDrop) return;

    const d = this.activeDrop;
    d.speedY += DROP_GRAVITY * dt;

    const p = d.node.position;
    const x = p.x + (d.targetX - p.x) * d.assist * dt * DROP_HORIZONTAL_LERP;
    const y = p.y - d.speedY * dt;
    d.node.setPosition(v3(x, y, 0));

    if (y <= d.targetY) {
      d.node.setPosition(v3(x, d.targetY, 0));
      const result = d.validate(x);
      d.onDone(result);
      this.activeDrop = null;
    }
  }
}
