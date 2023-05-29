import { Component, ComponentUpdatePriority } from '../src/component';
import { CreateEntity, Entity, GetEntityByNameOrId, UpdateEntities } from '../src/entity';

const log = console.log;

(() => {
    log('testing ecs...');

    class Component1 extends Component {
        update(enity: Entity) {
            log('Component:', enity);
        }
    }

    class Component2 extends Component {
        update(entity: Entity, time?: number, deltaTime?: number, ...args: any[]) {
            log('Component:', { entity, time, deltaTime, args });
        }
    }

    const entity1: Entity = CreateEntity();
    entity1.name = 'Entity_1';
    entity1.addComponent(Component1);
    entity1.addComponent(Component2, ComponentUpdatePriority.FIRST);

    console.debug('\nentity1.getComponent(Component2):', entity1.getComponent(Component2));

    const entity2: Entity = CreateEntity();
    entity2.name = 'Entity_2';
    entity2.addComponent(Component2);
    entity2.addComponent(Component1, ComponentUpdatePriority.FIRST);

    log('findByName entity1:', GetEntityByNameOrId('Entity_1'));
    log('findById entity1:', GetEntityByNameOrId(entity1.id));

    log('findByName entity2:', GetEntityByNameOrId('Entity_2'));
    log('findById entity2:', GetEntityByNameOrId(entity2.id));

    UpdateEntities(11, 12, 'arg1', 'arg2');
})();