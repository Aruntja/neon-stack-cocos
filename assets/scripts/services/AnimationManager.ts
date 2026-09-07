import { Node, tween, v3 } from 'cc';

export class AnimationManager {
  pulse(node: Node, scale = 1.08, duration = 0.08): void {
    tween(node)
      .to(duration, { scale: v3(scale, scale, 1) })
      .to(duration * 1.6, { scale: v3(1, 1, 1) })
      .start();
  }

  squash(node: Node): void {
    tween(node)
      .to(0.06, { scale: v3(1.06, 0.9, 1) })
      .to(0.12, { scale: v3(0.96, 1.05, 1) })
      .to(0.08, { scale: v3(1, 1, 1) })
      .start();
  }

  fadeOutAndDestroy(node: Node, delay = 0): void {
    tween(node).delay(delay).to(0.2, { scale: v3(0.8, 0.8, 1) }).call(() => node.destroy()).start();
  }
}
