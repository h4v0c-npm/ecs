import { EventEmitter } from '@h4v0c/event-emitter';
import { uid } from '@h4v0c/uid';
import { Entity } from './entity';

export enum ComponentUpdatePriority {
    FIRST,
    LAST_FIRST,
    ANY,
    FIRST_LAST,
    LAST,
};

export abstract class Component extends EventEmitter {
    readonly id: string = uid();
    readonly type: string = this.constructor.name;

    name: string = this.constructor.name;

    priority: ComponentUpdatePriority = ComponentUpdatePriority.ANY;

    abstract update(entity: Entity, ...args: any[]);
}
