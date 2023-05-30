# @h4v0c/ecs (WiP)
A simple Entity-Component system, meaning, it is NOT a 'Entities-Components-Systems' system, it is an 'Entity-Component' system.
This means that Components are both the Data Container and the System (via: Component.update() method).

## Usage:
```javascript
import { ComponentUpdatePriority, CreateEntity, UpdateEntities } from '@h4v0c/ecs';

// Define components:
class MyComponent extends Component {
    constructor(count = 10) {
        super();
        this.count = count;
    }

    update(entity) {
        console.debug(`${entity.name}: MyComponent.count: ${this.count}`);
    }
}

class MyOtherComponent extends Component {
    constructor(value = 'some_value') {
        super();
        this.value = value;
    }

    update(entity, { time }) {
        console.debug(`${entity.name}: MyOtherComponent.value: ${this.value}:`, time);
    }
}

// Create an Entity:
const myEntity = CreateEntity();
myEntity.name = 'My_Entity';

// Add Component(s):

// syntax: addComponent(
//     class: (MyComponent),
//     priority: enum ComponentUpdatePriority { FIRST, LAST_FIRST, ANY, FIRST_LAST, LAST }
//     args?: any (in form: { argName: argValue, }, will set member 'argName' to value 'argValue')
// );

myEntity.addComponent(MyComponent);
myEntity.addComponent(MyOtherComponent, ComponentUpdatePriority.FIRST, { value: 'new_value' });

// In main loop:
let time = 5;

while (time--) {
    UpdateEntities({ time }); // time is passed to all Component.update methods
}
```

### Output:
```
My_Entity: MyOtherComponent.value: new_value: 4
My_Entity: MyComponent.count: 10
My_Entity: MyOtherComponent.value: new_value: 3
My_Entity: MyComponent.count: 10
My_Entity: MyOtherComponent.value: new_value: 2
My_Entity: MyComponent.count: 10
My_Entity: MyOtherComponent.value: new_value: 1
My_Entity: MyComponent.count: 10
My_Entity: MyOtherComponent.value: new_value: 0
My_Entity: MyComponent.count: 10
```