import { uid } from '@h4v0c/uid';

export type Entity = { id: string, components: any };
export type Component = { name: string, data: object };
export type ServiceFunction = (deltaTime: number, entity: Entity, ...args: any) => void;
export type Service = { components: Array<string>, func: ServiceFunction };

export const ECS = {
    _entities: [],
    _services: {},
    _components: {},
    create: (): Entity => {
        const entity: Entity = { id: uid(), components: {} };
        ECS._entities.push(entity);
        return entity;
    },
    findEntitiesByComponent: (componentName: string) => (
        ECS._entities.filter((entity: Entity) => entity.components[componentName] != undefined)
    ),
    registerComponent: (componentName: string, data: Function) => {
        if (!ECS._components[componentName]) {
            ECS._components[componentName] = data;
        }
    },
    addComponent: (entity: Entity, componentNames: Array<string> | string, data?: Function) => {
        if (!Array.isArray(componentNames)) {
            componentNames = [componentNames];
        }

        componentNames.forEach((componentName) => {
            if (!entity.components[componentName]) {
                if (data == undefined) {
                    if (ECS._components[componentName] != undefined) {
                        entity.components[componentName] = ECS._components[componentName]();
                    } else throw 'addComponent: param "data" must not be undefined if the component is not registered'
                } else {
                    entity.components[componentName] = data();
                }
            }
        });
    },
    removeComponent: (entity: Entity, componentName: string) => {
        if (entity.components[componentName]) {
            delete entity.components[componentName];
        }
    },
    registerService: (name: string, components: Array<string>, func: ServiceFunction) => {
        if (!ECS._services[name]) {
            ECS._services[name] = { components, func } as Service;
        }
    },
    update: (deltaTime: number, ...args: any) => {
        for (const serviceName in ECS._services)
            for (const entity of ECS._entities)
                if (ECS._services[serviceName].components.every((componentName: string) => (
                    Object.keys(entity.components).includes(componentName)
                ))) ECS._services[serviceName].func(deltaTime, entity, ...args);
    },
};

// How to use:

// import { Main } from './core';
// import { RenderingContext } from './core/rendering-context';
// import { ECS, Entity } from './core/ecs';
// import { log } from './core/logger';
// import { vec2 } from 'gl-matrix';
// import { Input } from './core/input';

// (() => {
//     log('initializing...');

//     // Register Components:
//     ECS.registerComponent('renderable', () => ({ position: vec2.create() }));
//     ECS.registerComponent('movable', () => ({ movable: true }));
//     ECS.registerComponent('child', () => ({ parent: null }));

//     // Register Services:
//     ECS.registerService('render_service', ['renderable'], (dt: number, entity: Entity, ctx: RenderingContext) => {
//         // log(entity.id, entity.components['renderable'].position);
//         ctx.drawCircle(entity.components['renderable'].position, 10);
//     });

//     ECS.registerService('move_service', ['movable', 'renderable'], (dt: number, entity: Entity, ctx: RenderingContext) => {
//         if (entity.components['movable'].movable) {
//             entity.components['renderable'].position[0] += Input.getKeyDownValue('KeyD') - Input.getKeyDownValue('KeyA');
//             entity.components['renderable'].position[1] += Input.getKeyDownValue('KeyS') - Input.getKeyDownValue('KeyW');
//         }
//     });

//     ECS.registerService('child_service', ['child', 'renderable'], (dt: number, entity: Entity, ctx: RenderingContext) => {
//         if (entity.components['child'].parent) {
//             const parentEntity = entity.components['child'].parent;
//             // log(entity.id, 'has a parent:', parentEntity);
//         }
//     });

//     // Create Entities:
//     const e1 = ECS.create();
//     ECS.addComponent(e1, ['renderable', 'movable']);
//     e1.components['renderable'].position[0] -= 20;
//     e1.components['renderable'].position[1] -= 20;

//     const e2 = ECS.create();
//     ECS.addComponent(e2, ['renderable', 'child']);
//     e2.components['child'].parent = e1;

//     Main(document.body, (ctx: RenderingContext, dt) => {
//         ECS.update(dt, ctx);
//     });
// })();