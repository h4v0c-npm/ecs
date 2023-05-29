import { Component, ComponentUpdatePriority } from '../src/component';
import { CreateEntity, Entity, GetEntityByNameOrId, UpdateEntities } from '../src/entity';

const log = console.log;

(() => {
    log('testing ecs...');

    class Component1 extends Component {
        arg1: string = '';

        constructor(arg1?: string) {
            super();

            this.arg1 = arg1 ?? this.arg1;
        }

        update(enity: Entity) {
            log('Component:', enity);
        }
    }

    class Component2 extends Component {
        arg2: string = '';

        constructor(arg2?: string) {
            super();

            this.arg2 = arg2 ?? this.arg2;
        }

        update(entity: Entity, time?: number, deltaTime?: number, ...args: any[]) {
            log('Component:', { entity, time, deltaTime, args });
        }
    }

    const entity1: Entity = CreateEntity();
    entity1.name = 'Entity_1';
    entity1.addComponent(Component1, ComponentUpdatePriority.ANY, { arg1: 'this is arg1' });
    entity1.addComponent(Component2, ComponentUpdatePriority.FIRST, { arg2: 'this is arg2' });

    console.debug('\nentity1.getComponent(Component1):', entity1.getComponent(Component1));
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