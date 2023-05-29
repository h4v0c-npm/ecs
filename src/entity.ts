import { uid, UID } from '@h4v0c/uid';
import { Component, ComponentUpdatePriority } from './component';
import { FindFirstIndexByKeyValue, FindLastIndexByKeyValue } from './helpers';
import { EventEmitter } from '@h4v0c/event-emitter';

class _Entity extends EventEmitter {
    readonly id: UID = uid();

    name: string = this.constructor.name;

    components: Component[] = [];

    getComponent(nameOrType: string) {
        return this.components.find((component: Component) =>
            (component.name === nameOrType || component.type === nameOrType)
        );
    }

    addComponent(component: Component, priority: ComponentUpdatePriority = ComponentUpdatePriority.ANY): number {
        let index: number = -1;

        switch (priority) {
            case ComponentUpdatePriority.FIRST: {
                component.priority = ComponentUpdatePriority.FIRST;
                this.components.unshift(component);
                index = 0;
                break;
            }

            case ComponentUpdatePriority.LAST_FIRST: {
                component.priority = ComponentUpdatePriority.FIRST;
                index = FindLastIndexByKeyValue(this.components, 'priority', ComponentUpdatePriority.FIRST);

                if (index === -1) {
                    this.components.unshift(component);
                    index = 0;
                } else {
                    this.components.splice(index, 0, component);
                }

                break;
            }

            case ComponentUpdatePriority.ANY: {
                component.priority = ComponentUpdatePriority.ANY;
                index = FindFirstIndexByKeyValue(this.components, 'priority', ComponentUpdatePriority.LAST);

                if (index === -1) {
                    this.components.push(component);
                    index = this.components.length - 1;
                } else {
                    this.components.splice(index, 0, component);
                }

                break;
            }

            case ComponentUpdatePriority.FIRST_LAST: {
                component.priority = ComponentUpdatePriority.LAST;
                index = FindFirstIndexByKeyValue(this.components, 'priority', ComponentUpdatePriority.LAST);

                if (index === -1) {
                    this.components.push(component);
                    index = this.components.length - 1;
                } else {
                    this.components.splice(index, 0, component);
                }

                break;
            }

            case ComponentUpdatePriority.LAST: {
                component.priority = ComponentUpdatePriority.LAST;
                this.components.push(component);
                index = this.components.length - 1;
                break;
            }

            default: throw `Entity.addComponent: unhandled priority: ${priority}`;
        }

        return index;
    }

    removeComponent(component: Component) {
        const index: number = this.components.findIndex((c: Component) => (c.id === component.id));

        if (index >= 0) {
            this.components.splice(index, 1);
        } else console.warn('*** Entity.removeComponent: component not found');
    }

    update(...args: any[]) {
        for (const component of this.components) {
            component.update(this, ...args);
        }
    }
}

let _entities: Entity[] = [];

export declare type Entity = _Entity;

export function CreateEntity(): Entity {
    const entity: Entity = (new _Entity() as Entity);

    _entities.push(entity);

    return entity;
}

export function GetAllEntities(): Entity[] {
    return new Array<Entity>(..._entities);
}

export function GetEntityByNameOrId(nameOrId: string | UID) {
    return _entities.find((entity: Entity) => (entity.name === nameOrId || entity.id === nameOrId));
}

export function UpdateEntities(...args: any[]) {
    for (const entity of _entities) {
        entity.update(...args);
    }
}
