import { uid } from '@h4v0c/uid';

export type Entity = { id: string, components: any };

export type ComponentDataFunc = () => any;
export type Component = { name: string, dataFunc: ComponentDataFunc };

export type SystemFunc = (entity: Entity, time: number) => void;
export type System = { name: string, components: Array<string>, func: SystemFunc };

export class ECS {
    private entities: Array<Entity> = [];
    private systems: Array<System> = [];

    getEntityById(id: string): Entity {
        return this.entities.find((entity: Entity) => (entity.id === id));
    }

    getEntitiesWithComponents(components: Array<string>): Array<Entity> {
        return this.entities.filter((entity: Entity) => (
            components.every((component: string) => (component in entity.components)))
        );
    }

    createEntity(): Entity {
        const entity: Entity = { id: uid(), components: {} };
        this.entities.push(entity);
        return entity;
    }

    createComponent(name: string, dataFunc: ComponentDataFunc): Component {
        const component: Component = { name, dataFunc };
        return component;
    }

    createSystem(name: string, components: Array<string>, func: SystemFunc): System {
        const system: System = { name, components, func };
        this.systems.push(system);
        return system;
    }

    addComponent(entity: Entity, ...components: Component[]) {
        components.forEach((component: Component) => {
            if (!(component.name in entity.components)) {
                entity.components[component.name] = component.dataFunc();
            }
        });
    }

    removeComponent(entity: Entity, ...componentNames: Component[]) {
        componentNames.forEach((component: Component) => {
            if (component.name in entity.components) {
                delete entity.components[component.name];
            }
        });
    }

    executeSystems(time: number) {
        this.systems.forEach((system: System) =>
            this.getEntitiesWithComponents(system.components)
                .forEach((entity: Entity) => system.func(entity, time))
        );
    }
}
