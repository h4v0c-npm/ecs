import { ECS, Entity } from '../src';

const log = console.log;

(() => {
    log('testing ECS...');
    
    const ecs = new ECS();

    const s1 = ecs.createSystem('s1', ['c1'], (entity: Entity, time: number, other: number) => {
        log('system: s1: entity:', entity.id, 'time:', time, 'other:', other);
    });

    const c1 = ecs.createComponent('c1', () => ({ value: 'c1' }));

    const e1 = ecs.createEntity();
    ecs.addComponent(e1, c1);

    ecs.executeSystems(12, 42);
})();