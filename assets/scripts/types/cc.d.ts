declare module 'cc' {
  export const _decorator: {
    ccclass: (name: string) => ClassDecorator;
    property: (type?: any) => PropertyDecorator;
  };

  export class Vec3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
  }

  export class Component {
    node: Node;
    isValid: boolean;
    getComponent<T>(type: new (...args: any[]) => T): T | null;
    addComponent<T>(type: new (...args: any[]) => T): T;
    scheduleOnce(callback: () => void, delay?: number): void;
  }

  export class Node {
    static EventType: any;
    constructor(name?: string);
    name: string;
    parent: Node | null;
    children: Node[];
    isValid: boolean;
    position: Vec3;
    worldPosition: Vec3;
    addChild(child: Node): void;
    setPosition(pos: Vec3): void;
    setWorldPosition(pos: Vec3): void;
    getWorldPosition(out?: Vec3): Vec3;
    destroy(): void;
    on(...args: any[]): void;
    off(...args: any[]): void;
    getChildByName(name: string): Node | null;
    getComponent<T>(type: new (...args: any[]) => T): T | null;
    addComponent<T>(type: new (...args: any[]) => T): T;
  }

  export class Prefab {}
  export class Camera extends Component {}
  export class UITransform extends Component { setContentSize(width: number, height: number): void; }
  export class Label extends Component { string: string; fontSize: number; lineHeight: number; color: Color; horizontalAlign: number; }
  export class Button extends Component { clickEvents: any[]; interactable: boolean; }
  export class Color { constructor(r?: number, g?: number, b?: number, a?: number); static WHITE: Color; }
  export class Sprite extends Component { color: Color; spriteFrame: SpriteFrame | null; }
  export class Graphics extends Component {
    fillColor: Color;
    clear(): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, radius: number): void;
    circle(x: number, y: number, radius: number): void;
    fill(): void;
  }
  export class SpriteFrame { texture: Texture2D | null; }
  export class Texture2D { image: ImageAsset | null; }
  export class ImageAsset { reset(data: any): void; }
  export class Size { constructor(width?: number, height?: number); }
  export class EventTouch {}

  export const resources: {
    load<T>(path: string, type: any, callback: (err: Error | null, asset: T) => void): void;
  };
  export function instantiate(prefab: Prefab): Node;
  export function tween(target: any): any;
  export function v3(x?: number, y?: number, z?: number): Vec3;
  export function v2(x?: number, y?: number): any;
  export const input: any;
  export const Input: any;
  export const math: any;
}
