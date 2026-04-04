export class EventTable {
  public name: string = "";
  public description: string = "";
  public visible: boolean = true;
  public id: string = Math.random().toString(36).substring(7);
  public events: Map<string, Function> = new Map();

  public callEvent(eventName: string, ...args: any[]) {
    const fn = this.events.get(eventName);
    if (fn) {
      return fn(this, ...args);
    }
  }

  public setEvent(eventName: string, fn: Function) {
    this.events.set(eventName, fn);
  }
}

export class Container extends EventTable {
  public inventory: Thing[] = [];
  public container: Container | null = null;

  public moveTo(c: Container | null) {
    if (this.container) {
      const idx = this.container.inventory.indexOf(this as any);
      if (idx > -1) this.container.inventory.splice(idx, 1);
    }
    this.container = c;
    if (c) {
      c.inventory.push(this as any);
    }
  }

  public contains(t: Thing): boolean {
    for (const item of this.inventory) {
      if (item === t) return true;
      if (item.contains(t)) return true;
    }
    return false;
  }
}

export class Thing extends Container {
  public active: boolean = true;
  public location: ZonePoint | null = null;
}

export class Action extends EventTable {
  public text: string = "";
  public enabled: boolean = true;
  public parameter: boolean = false;
  public targets: Thing[] = [];
  public actor: Thing | null = null;

  public isTarget(t: Thing): boolean {
    return this.targets.includes(t);
  }
}

export class Media extends EventTable {
  public mediaId: number = 0;
  public altText: string | null = null;
  public type: string | null = null;

  public play() {
    console.log(`Playing media: ${this.name} (${this.type})`);
  }
}

export class Player extends Thing {
  public health: number = 100;
  public score: number = 0;

  constructor() {
    super();
    this.name = "Player";
  }
}

export class ZonePoint {
  constructor(public lat: number, public lng: number, public alt: number = 0) {}
}

export class Zone extends Container {
  public active: boolean = true;
  public points: ZonePoint[] = [];
  public distanceRange: number = -1;
  public proximityRange: number = -1;
  public showObjects: 'OnEnter' | 'Always' | 'Never' = 'OnEnter';
  public state: 'inside' | 'proximity' | 'distant' = 'distant';

  public isInside(pt: ZonePoint): boolean {
    // Basic ray casting or bounding box check
    return false;
  }
}

export class Task extends EventTable {
  public active: boolean = true;
  public complete: boolean = false;
  public correctState: 'None' | 'Correct' | 'NotCorrect' = 'None';
  public status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
}

export class Timer extends EventTable {
  public duration: number = 0;
  public type: 'Countdown' | 'Interval' = 'Countdown';
  public active: boolean = false;
  private intervalId: any = null;

  public start() {
    this.active = true;
    this.callEvent('OnStart');
    if (this.type === 'Countdown') {
      this.intervalId = setTimeout(() => this.tick(), this.duration * 1000);
    } else {
      this.intervalId = setInterval(() => this.tick(), this.duration * 1000);
    }
  }

  public stop() {
    this.active = false;
    this.callEvent('OnStop');
    if (this.intervalId) {
      clearInterval(this.intervalId);
      clearTimeout(this.intervalId);
    }
  }

  private tick() {
    this.callEvent('OnTick');
  }
}

export class WherigoLib extends EventTable {
  public static instance: WherigoLib = new WherigoLib();
  
  public playSound(media: Media) {
    media.play();
  }

  public showScreen(screenId: number, item: any) {
    console.log(`Showing screen: ${screenId}`, item);
  }

  public message(args: { Text: string, Media?: Media, Buttons?: string[] }) {
    console.log(`Wherigo Message: ${args.Text}`);
  }
}

export class Engine extends EventTable {
  public static instance: Engine = new Engine();
  public cartridge: Cartridge | null = null;
  public player: Player = new Player();

  public static LOG_CALL = 1;
  public static LOG_ERROR = 2;

  public static log(msg: string, type: number) {
    console.log(`[Engine Log ${type}]: ${msg}`);
  }
}

export class Cartridge extends Container {
  public activity: string = "";
  public startingLocation: ZonePoint | null = null;
  public version: string = "";
  public author: string = "";
  public company: string = "";
  
  public zones: Zone[] = [];
  public tasks: Task[] = [];
  public timers: Timer[] = [];
  public things: Thing[] = [];
  public media: Media[] = [];
}
