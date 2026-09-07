import { _decorator, Component, Graphics, Node, UITransform, v3 } from 'cc';
import { Colors } from '../config/ColorScheme';

const { ccclass } = _decorator;

@ccclass('ParticleController')
export class ParticleController extends Component {
  burst(parent: Node, x: number, y: number): void {
    for (let i = 0; i < 8; i += 1) {
      const dot = new Node(`Particle_${i}`);
      const ui = dot.addComponent(UITransform);
      ui.setContentSize(12, 12);
      const g = dot.addComponent(Graphics);
      g.fillColor = i % 2 === 0 ? Colors.neonPink : Colors.neonLime;
      g.circle(0, 0, 6);
      g.fill();
      dot.setPosition(v3(x + (Math.random() * 2 - 1) * 20, y + (Math.random() * 2 - 1) * 20, 0));
      dot.parent = parent;
      dot.addComponent(ParticleControllerMotion);
    }
  }
}

@ccclass('ParticleControllerMotion')
class ParticleControllerMotion extends Component {
  private velocity = v3((Math.random() * 2 - 1) * 320, 300 + Math.random() * 200, 0);
  private life = 0.45;

  update(dt: number): void {
    this.life -= dt;
    this.velocity.y -= 1200 * dt;
    const p = this.node.position;
    this.node.setPosition(v3(p.x + this.velocity.x * dt, p.y + this.velocity.y * dt, 0));
    if (this.life <= 0) this.node.destroy();
  }
}
