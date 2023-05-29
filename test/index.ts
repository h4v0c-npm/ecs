import { Component, ComponentUpdatePriority } from '../src/component';
import { CreateEntity, Entity, GetEntityByNameOrId, UpdateEntities } from '../src/entity';

const log = console.log;

(() => {
    log('testing ecs...');

    class Component1 extends Component {
        update() {
            log('Component:', this.name);
        }
    }

    class Component2 extends Component {
        update(time?: number, deltaTime?: number, ...args: any[]) {
            log('Component:', this.name, { time, deltaTime, args });
        }
    }

    const entity1: Entity = CreateEntity();
    entity1.name = 'Entity_1';
    entity1.addComponent(new Component1());
    entity1.addComponent(new Component2, ComponentUpdatePriority.FIRST);

    const entity2: Entity = CreateEntity();
    entity2.name = 'Entity_2';
    entity2.addComponent(new Component2());
    entity2.addComponent(new Component1, ComponentUpdatePriority.FIRST);

    log('findByName entity1:', GetEntityByNameOrId('Entity_1'));
    log('findById entity1:', GetEntityByNameOrId(entity1.id));

    log('findByName entity2:', GetEntityByNameOrId('Entity_2'));
    log('findById entity2:', GetEntityByNameOrId(entity2.id));

    UpdateEntities(11, 12, 'arg1', 'arg2');
})();