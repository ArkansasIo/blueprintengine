# Blueprint System API Reference

## Table of Contents
- [Blueprint Class API](#blueprint-class-api)
- [Node Class API](#node-class-api)
- [Pin Class API](#pin-class-api)
- [BlueprintDataManager API](#blueprintdatamanager-api)
- [Screen Fit Utilities API](#screen-fit-utilities-api)
- [Type Definitions](#type-definitions)

---

## Blueprint Class API

### Constructor
```typescript
constructor(id: string, name: string, parentClass?: BlueprintClass)
```

**Parameters:**
- `id: string` - Unique identifier for the blueprint
- `name: string` - Display name of the blueprint
- `parentClass?: BlueprintClass` - Optional parent class (defaults to Blueprint)

**Example:**
```typescript
const blueprint = new Blueprint('bp-123', 'PlayerCharacter');
```

---

### Node Management Methods

#### addNode(node: EditorNode): void
Add a node to the blueprint.

```typescript
const node = new Node('node-1', NodeType.Branch, { x: 100, y: 100 });
blueprint.addNode(node);
```

**Side Effects:**
- Marks blueprint as dirty
- Invalidates compilation

---

#### removeNode(nodeId: string): void
Remove a node and all its connections.

```typescript
blueprint.removeNode('node-1');
```

**Side Effects:**
- Removes all connected edges
- Marks blueprint as dirty
- Invalidates compilation

---

#### getNode(nodeId: string): EditorNode | undefined
Get a node by its ID.

```typescript
const node = blueprint.getNode('node-1');
if (node) {
  console.log(node.displayName);
}
```

**Returns:** Node object or undefined if not found

---

#### getNodesByType(type: string): EditorNode[]
Get all nodes of a specific type.

```typescript
const branchNodes = blueprint.getNodesByType('Branch');
console.log(`Found ${branchNodes.length} branch nodes`);
```

**Returns:** Array of matching nodes (empty if none found)

---

#### getNodeConnections(nodeId: string): EditorEdge[]
Get all edges connected to a node.

```typescript
const connections = blueprint.getNodeConnections('node-1');
console.log(`Node has ${connections.length} connections`);
```

**Returns:** Array of connected edges

---

### Edge Management Methods

#### addEdge(edge: EditorEdge): void
Add a connection between two pins.

```typescript
const edge: EditorEdge = {
  id: 'edge-1',
  fromNodeId: 'node-1',
  fromPinId: 'node-1_output_Result',
  toNodeId: 'node-2',
  toPinId: 'node-2_input_Value',
  isEnabled: true,
  isValid: true,
};
blueprint.addEdge(edge);
```

**Side Effects:**
- Marks blueprint as dirty
- Invalidates compilation

---

#### removeEdge(edgeId: string): void
Remove a connection.

```typescript
blueprint.removeEdge('edge-1');
```

**Side Effects:**
- Marks blueprint as dirty
- Invalidates compilation

---

#### getEdge(edgeId: string): EditorEdge | undefined
Get an edge by ID.

```typescript
const edge = blueprint.getEdge('edge-1');
if (edge) {
  console.log(`${edge.fromNodeId} → ${edge.toNodeId}`);
}
```

**Returns:** Edge object or undefined

---

### Variable Management Methods

#### addVariable(variable: Variable): void
Add a variable to the blueprint.

```typescript
const variable: Variable = {
  id: 'var-1',
  name: 'Health',
  type: 'float',
  defaultValue: 100,
  scope: VariableScope.Instance,
  isPublic: true,
  isEditable: true,
  isExposed: true,
  createdAt: new Date(),
  modifiedAt: new Date(),
};
blueprint.addVariable(variable);
```

**Side Effects:**
- Marks blueprint as dirty

---

#### removeVariable(variableId: string): void
Remove a variable.

```typescript
blueprint.removeVariable('var-1');
```

**Side Effects:**
- Marks blueprint as dirty

---

#### getVariable(variableId: string): Variable | undefined
Get variable by ID.

```typescript
const variable = blueprint.getVariable('var-1');
```

**Returns:** Variable or undefined

---

#### getVariableByName(name: string): Variable | undefined
Get variable by name.

```typescript
const health = blueprint.getVariableByName('Health');
if (health) {
  health.defaultValue = 150;
}
```

**Returns:** Variable or undefined

---

### Function Management Methods

#### addFunction(func: Function): void
Add a function to the blueprint.

```typescript
const func: Function = {
  id: 'func-1',
  name: 'TakeDamage',
  returnType: 'void',
  inputs: [
    { id: 'param-1', name: 'Damage', type: 'float', isOut: false, isReference: false }
  ],
  outputs: [],
  isPublic: true,
  isPure: false,
  isEvent: false,
  isOverride: false,
  nodeGraphId: 'graph-1',
  nodes: [],
  createdAt: new Date(),
  modifiedAt: new Date(),
};
blueprint.addFunction(func);
```

**Side Effects:**
- Marks blueprint as dirty

---

#### removeFunction(functionId: string): void
Remove a function.

```typescript
blueprint.removeFunction('func-1');
```

**Side Effects:**
- Marks blueprint as dirty

---

#### getFunction(functionId: string): Function | undefined
Get function by ID.

```typescript
const func = blueprint.getFunction('func-1');
```

**Returns:** Function or undefined

---

#### getFunctionByName(name: string): Function | undefined
Get function by name.

```typescript
const takeDamage = blueprint.getFunctionByName('TakeDamage');
```

**Returns:** Function or undefined

---

### Event Management Methods

#### addEvent(event: Event): void
Add an event to the blueprint.

```typescript
const event: Event = {
  id: 'event-1',
  name: 'OnDeath',
  description: 'Called when character dies',
  outputs: [],
  isPublic: true,
  isNative: false,
  nodeGraphId: 'graph-2',
  nodes: [],
  boundVariables: [],
  createdAt: new Date(),
  modifiedAt: new Date(),
};
blueprint.addEvent(event);
```

---

#### removeEvent(eventId: string): void
Remove an event.

```typescript
blueprint.removeEvent('event-1');
```

---

#### getEvent(eventId: string): Event | undefined
Get event by ID.

```typescript
const event = blueprint.getEvent('event-1');
```

---

#### getEventByName(name: string): Event | undefined
Get event by name.

```typescript
const onDeath = blueprint.getEventByName('OnDeath');
```

---

### Validation & Analysis Methods

#### validate(): { isValid: boolean; errors: string[] }
Validate blueprint structure and connections.

```typescript
const { isValid, errors } = blueprint.validate();
if (!isValid) {
  errors.forEach(error => console.error(error));
}
```

**Checks:**
- Cycle detection
- Unconnected nodes
- Type mismatches

**Returns:** Object with validation result and error list

---

#### hasCycles(): boolean
Check if blueprint has circular connections.

```typescript
if (blueprint.hasCycles()) {
  console.warn('Circular dependency detected');
}
```

**Algorithm:** Depth-First Search (DFS)

**Returns:** true if cycle found

---

#### getStatistics(): BlueprintStatistics
Get blueprint statistics.

```typescript
const stats = blueprint.getStatistics();
console.log(`Nodes: ${stats.nodeCount}`);
console.log(`Complexity: ${stats.totalComplexity}`);
console.log(`Nesting Level: ${stats.nestingLevel}`);
```

**Returns:**
```typescript
{
  nodeCount: number;
  connectionCount: number;
  variableCount: number;
  functionCount: number;
  eventCount: number;
  totalComplexity: number;
  nestingLevel: number;
  branchingFactor: number;
}
```

---

### Compilation & Versioning Methods

#### async compile(mode?: CompilationMode): Promise<CompilationResult>
Compile the blueprint.

```typescript
const result = await blueprint.compile(CompilationMode.Release);
if (result.success) {
  console.log('Compilation successful');
  console.log(`Generated code size: ${result.generatedCodeSize} bytes`);
} else {
  result.errors.forEach(error => console.error(error.message));
}
```

**Modes:**
- `Debug` - Include debug info
- `Release` - Optimize
- `Shipping` - Final build
- `Validation` - Just validate
- `GenerateCode` - Generate source code

**Returns:** CompilationResult object

---

#### createSnapshot(message: string): BlueprintVersion
Create a version snapshot.

```typescript
const version = blueprint.createSnapshot('Added health system');
console.log(`Snapshot created: ${version.versionId}`);
```

**Stores:** Complete state copy + timestamp

**Returns:** BlueprintVersion object

---

#### restoreSnapshot(versionId: string): boolean
Restore blueprint from snapshot.

```typescript
const success = blueprint.restoreSnapshot('version-123');
if (success) {
  console.log('Blueprint restored');
}
```

**Side Effects:**
- Replaces all content
- Marks as dirty
- Invalidates compilation

**Returns:** true if successful

---

### Import/Export Methods

#### export(): string
Export blueprint as JSON string.

```typescript
const json = blueprint.export();
localStorage.setItem('my-blueprint', json);
```

**Returns:** JSON string representation

---

#### static import(jsonData: string): Blueprint
Import blueprint from JSON string.

```typescript
const json = localStorage.getItem('my-blueprint');
const blueprint = Blueprint.import(json);
```

**Returns:** Blueprint instance

**Throws:** JSON parsing errors

---

## Node Class API

### Constructor
```typescript
constructor(
  id: string,
  type: NodeType,
  position: Position,
  displayName?: string,
  description?: string
)
```

**Auto-initializes pins** based on node type.

---

### Pin Management Methods

#### addInputPin(name: string, type: DataType, defaultValue?: any): Pin
Add input data pin.

```typescript
const pin = node.addInputPin('Condition', 'bool', false);
```

**Returns:** Created Pin object

---

#### addOutputPin(name: string, type: DataType): Pin
Add output data pin.

```typescript
const pin = node.addOutputPin('Result', 'float');
```

**Returns:** Created Pin object

---

#### addInputExecutionPin(name?: string): Pin
Add input execution pin (for flow control).

```typescript
const pin = node.addInputExecutionPin('Execute');
```

**Default name:** 'Execute'

**Returns:** Created Pin object

---

#### addOutputExecutionPin(name?: string): Pin
Add output execution pin.

```typescript
const pin = node.addOutputExecutionPin('Then');
```

**Default name:** 'Then'

**Returns:** Created Pin object

---

#### getInputPin(name: string): Pin | undefined
Get input pin by name.

```typescript
const conditionPin = node.getInputPin('Condition');
```

---

#### getOutputPin(name: string): Pin | undefined
Get output pin by name.

```typescript
const resultPin = node.getOutputPin('Result');
```

---

#### getPinById(pinId: string): Pin | undefined
Get pin by ID.

```typescript
const pin = node.getPinById('node-1_input_Value');
```

---

### Property Management Methods

#### addProperty(property: NodeProperty): void
Add property to node.

```typescript
node.addProperty({
  id: 'prop-1',
  name: 'Threshold',
  type: 'float',
  value: 0.5,
  defaultValue: 0.5,
  isEditable: true,
});
```

---

#### getProperty(name: string): NodeProperty | undefined
Get property by name.

```typescript
const prop = node.getProperty('Threshold');
```

---

#### setPropertyValue(name: string, value: any): void
Update property value.

```typescript
node.setPropertyValue('Threshold', 0.75);
```

---

### Node Operations

#### move(x: number, y: number): void
Move node to position.

```typescript
node.move(200, 150);
```

**Updates:** position + metadata.modifiedAt

---

#### resize(width: number, height: number): void
Resize node.

```typescript
node.resize(250, 120);
```

---

#### toggleCollapsed(): void
Toggle node collapsed state.

```typescript
node.toggleCollapsed();
```

---

#### setEnabled(enabled: boolean): void
Enable/disable node.

```typescript
node.setEnabled(false);
```

---

#### setBreakpoint(enabled: boolean): void
Set debug breakpoint on node.

```typescript
node.setBreakpoint(true);
```

---

#### addComment(author: string, content: string): void
Add comment to node.

```typescript
node.addComment('Developer', 'This needs optimization');
```

---

#### validate(): { isValid: boolean; errors: string[] }
Validate node connections.

```typescript
const { isValid, errors } = node.validate();
```

**Checks:** Required pins are connected

---

#### clone(newId: string, newPosition: Position): Node
Clone node.

```typescript
const clone = node.clone('node-2', { x: 300, y: 300 });
```

**Returns:** New Node instance

---

#### export(): string
Export node as JSON.

```typescript
const json = node.export();
```

**Returns:** JSON string

---

## Pin Class API

### Constructor
```typescript
constructor(
  id: string,
  name: string,
  direction: PinDirection,
  type: DataType,
  defaultValue?: any
)
```

---

### Connection Methods

#### addConnection(connection: PinConnection): void
Add connection to pin.

```typescript
pin.addConnection({
  id: 'conn-1',
  fromNodeId: 'node-1',
  fromPinId: 'pin-1',
  toNodeId: 'node-2',
  toPinId: 'pin-2',
  isEnabled: true,
});
```

**Prevents duplicates.**

---

#### removeConnection(connectionId: string): void
Remove connection.

```typescript
pin.removeConnection('conn-1');
```

---

#### isConnected(connection: PinConnection): boolean
Check if already connected.

```typescript
if (pin.isConnected(connection)) {
  console.log('Already connected');
}
```

---

#### getConnectedPins(): Array<{ nodeId: string; pinId: string }>
Get all connected pins.

```typescript
const connected = pin.getConnectedPins();
connected.forEach(p => console.log(p.nodeId));
```

---

#### clearConnections(): void
Remove all connections.

```typescript
pin.clearConnections();
```

---

#### getConnectionCount(): number
Get number of connections.

```typescript
const count = pin.getConnectionCount();
```

---

#### hasConnections(): boolean
Check if has any connections.

```typescript
if (pin.hasConnections()) {
  // Pin is connected
}
```

---

#### canConnectTo(otherPin: Pin): boolean
Check if can connect to pin.

```typescript
if (pin.canConnectTo(otherPin)) {
  // Can connect
}
```

**Checks:**
- Different directions
- Type compatibility
- Not self-connection

---

### Configuration Methods

#### setTooltip(tooltip: string): void
Set pin tooltip.

```typescript
pin.setTooltip('Enter the condition to evaluate');
```

---

#### setAdvanced(advanced: boolean): void
Mark as advanced.

```typescript
pin.setAdvanced(true);
```

---

#### setHidden(hidden: boolean): void
Hide/show pin.

```typescript
pin.setHidden(false);
```

---

#### setArray(isArray: boolean): void
Mark as array type.

```typescript
pin.setArray(true);
```

---

#### setReference(isReference: boolean): void
Mark as reference.

```typescript
pin.setReference(true);
```

---

#### setConst(isConst: boolean): void
Mark as const.

```typescript
pin.setConst(true);
```

---

#### markAsExecution(isInput: boolean): void
Mark as execution pin.

```typescript
pin.markAsExecution(true); // Input execution
```

**Sets:** type to 'void'

---

### Utility Methods

#### export(): string
Export pin as JSON.

```typescript
const json = pin.export();
```

---

#### clone(newId: string): Pin
Clone pin.

```typescript
const clone = pin.clone('pin-2');
```

**Returns:** New Pin instance

---

## BlueprintDataManager API

### Static Methods (All)

#### static async saveBlueprint(blueprint: Blueprint): Promise<boolean>
Save blueprint to AsyncStorage.

```typescript
const success = await BlueprintDataManager.saveBlueprint(blueprint);
```

**Saves:**
- Blueprint data
- Metadata
- Checksums

**Returns:** true if successful

---

#### static async loadBlueprint(blueprintId: string): Promise<Blueprint | null>
Load blueprint from storage.

```typescript
const blueprint = await BlueprintDataManager.loadBlueprint('bp-123');
if (blueprint) {
  console.log(blueprint.name);
}
```

**Returns:** Blueprint instance or null

---

#### static async deleteBlueprint(blueprintId: string): Promise<boolean>
Delete blueprint.

```typescript
const success = await BlueprintDataManager.deleteBlueprint('bp-123');
```

**Returns:** true if successful

---

#### static async getAllBlueprints(): Promise<Array<{ id: string; name: string; modified: Date }>>
Get all blueprint metadata.

```typescript
const blueprints = await BlueprintDataManager.getAllBlueprints();
blueprints.forEach(bp => console.log(bp.name));
```

**Returns:** Array of blueprint metadata

---

#### static async saveVersion(blueprintId: string, version: BlueprintVersion): Promise<boolean>
Save version snapshot.

```typescript
const success = await BlueprintDataManager.saveVersion('bp-123', version);
```

---

#### static async loadVersion(blueprintId: string, versionId: string): Promise<BlueprintVersion | null>
Load version snapshot.

```typescript
const version = await BlueprintDataManager.loadVersion('bp-123', 'v-456');
```

---

#### static async getVersions(blueprintId: string): Promise<BlueprintVersion[]>
Get version history.

```typescript
const versions = await BlueprintDataManager.getVersions('bp-123');
versions.forEach(v => console.log(v.message));
```

**Returns:** Array of versions (newest first)

---

#### static async exportBlueprint(blueprint: Blueprint): Promise<string>
Export as JSON.

```typescript
const json = await BlueprintDataManager.exportBlueprint(blueprint);
```

**Returns:** JSON string

---

#### static async importBlueprint(jsonData: string): Promise<Blueprint | null>
Import from JSON.

```typescript
const blueprint = await BlueprintDataManager.importBlueprint(json);
```

**Returns:** Blueprint instance or null

---

#### static async searchBlueprints(query: string): Promise<Blueprint[]>
Search blueprints.

```typescript
const results = await BlueprintDataManager.searchBlueprints('player');
```

**Searches:** Name and ID

**Returns:** Array of matching blueprints

---

#### static async getBlueprintStats(blueprintId: string): Promise<BlueprintStatistics | null>
Get blueprint statistics.

```typescript
const stats = await BlueprintDataManager.getBlueprintStats('bp-123');
if (stats) {
  console.log(`Complexity: ${stats.totalComplexity}`);
}
```

---

#### static async validateBlueprint(blueprintId: string): Promise<{ isValid: boolean; errors: string[] }>
Validate blueprint.

```typescript
const { isValid, errors } = await BlueprintDataManager.validateBlueprint('bp-123');
```

---

#### static async duplicateBlueprint(sourceId: string, newName: string): Promise<Blueprint | null>
Duplicate blueprint.

```typescript
const duplicate = await BlueprintDataManager.duplicateBlueprint('bp-123', 'BP_123_Copy');
```

**Copies all content** including nodes, edges, variables, functions, events

---

#### static async clearAllBlueprints(): Promise<boolean>
Delete all blueprints.

```typescript
const success = await BlueprintDataManager.clearAllBlueprints();
```

**⚠️ WARNING:** Irreversible operation

---

#### static async getStorageInfo(): Promise<{ usedBytes: number; blueprintCount: number }>
Get storage statistics.

```typescript
const info = await BlueprintDataManager.getStorageInfo();
console.log(`Used: ${(info.usedBytes / 1024).toFixed(2)} KB`);
console.log(`Blueprints: ${info.blueprintCount}`);
```

---

## Screen Fit Utilities API

### Zoom Functions

#### calculateZoomToFit(contentBounds, viewportWidth, viewportHeight, padding?): CanvasTransform
Calculate zoom to fit all content.

```typescript
const transform = calculateZoomToFit(
  { minX: 0, minY: 0, maxX: 1000, maxY: 1000, ... },
  800,
  600,
  20
);
console.log(`Scale: ${transform.scale}, X: ${transform.offsetX}, Y: ${transform.offsetY}`);
```

**Parameters:**
- `contentBounds: ViewportBounds` - Content bounds
- `viewportWidth: number` - Viewport width
- `viewportHeight: number` - Viewport height
- `padding?: number` - Padding around content (default: 20)

**Returns:** CanvasTransform

---

#### calculateZoomToCenter(targetX, targetY, viewportWidth, viewportHeight, scale): CanvasTransform
Calculate zoom centered on point.

```typescript
const transform = calculateZoomToCenter(500, 400, 800, 600, 1);
```

---

#### calculateZoomToPoint(pointX, pointY, viewportWidth, viewportHeight, currentScale, newScale): CanvasTransform
Calculate zoom keeping point fixed.

```typescript
const transform = calculateZoomToPoint(
  mouseX, mouseY,
  viewportWidth, viewportHeight,
  currentScale, newScale
);
```

---

### Pan Functions

#### calculatePan(currentOffsetX, currentOffsetY, deltaX, deltaY, contentBounds, viewportWidth, viewportHeight, scale): CanvasTransform
Calculate pan with constraints.

```typescript
const transform = calculatePan(
  offsetX, offsetY,
  deltaX, deltaY,
  bounds,
  viewportWidth, viewportHeight,
  scale
);
```

**Prevents panning beyond content.**

---

### Coordinate Conversion

#### screenToCanvasCoordinates(screenX, screenY, offsetX, offsetY, scale): { x: number; y: number }
Convert screen to canvas coordinates.

```typescript
const canvasPos = screenToCanvasCoordinates(
  mouseScreenX, mouseScreenY,
  offsetX, offsetY, scale
);
```

---

#### canvasToScreenCoordinates(canvasX, canvasY, offsetX, offsetY, scale): { x: number; y: number }
Convert canvas to screen coordinates.

```typescript
const screenPos = canvasToScreenCoordinates(
  nodeCanvasX, nodeCanvasY,
  offsetX, offsetY, scale
);
```

---

### Selection & Visibility

#### calculateFitNode(nodeX, nodeY, nodeWidth, nodeHeight, viewportWidth, viewportHeight, padding?): CanvasTransform
Fit single node in viewport.

```typescript
const transform = calculateFitNode(100, 100, 200, 150, 800, 600);
```

---

#### calculateFitSelection(nodeIds, nodeMap, viewportWidth, viewportHeight, padding?): CanvasTransform
Fit multiple nodes in viewport.

```typescript
const transform = calculateFitSelection(
  ['node-1', 'node-2', 'node-3'],
  new Map([
    ['node-1', { x: 100, y: 100, width: 200, height: 150 }],
    ...
  ]),
  800, 600
);
```

---

#### isPointInViewport(pointX, pointY, viewportWidth, viewportHeight, offsetX, offsetY, scale): boolean
Check if point is visible.

```typescript
if (isPointInViewport(nodeX, nodeY, 800, 600, offsetX, offsetY, scale)) {
  // Point is visible
}
```

---

#### boundsIntersectViewport(bounds, viewportWidth, viewportHeight, offsetX, offsetY, scale): boolean
Check if bounds intersect viewport.

```typescript
if (boundsIntersectViewport(nodeBounds, 800, 600, offsetX, offsetY, scale)) {
  // Bounds are visible
}
```

---

### Zoom Levels

#### getOptimalZoomLevel(scale: number): ZoomLevel
Get nearest standard zoom level.

```typescript
const zoomLevel = getOptimalZoomLevel(1.23);
console.log(zoomLevel.percentage); // 125%
```

---

#### getNextZoomLevel(currentScale, direction): ZoomLevel
Get next zoom level.

```typescript
const nextZoom = getNextZoomLevel(1, 'in');  // 1.25
const prevZoom = getNextZoomLevel(1, 'out'); // 0.75
```

**Direction:** 'in' or 'out'

---

### Utilities

#### getResponsiveScale(): number
Get device scale factor.

```typescript
const scale = getResponsiveScale();
// Small phone: 0.85, Normal: 1, Tablet: 1.15
```

---

#### clampScale(scale, min?, max?): number
Clamp scale within bounds.

```typescript
const clamped = clampScale(5, 0.1, 4); // Returns 4
```

---

#### calculateSmoothZoom(startScale, targetScale, progress): number
Animate zoom smoothly.

```typescript
// In animation loop with progress 0-1
const scale = calculateSmoothZoom(1, 2, progress);
```

**Uses:** Ease-in-out interpolation

---

#### getGridSnapPoint(value, gridSize): number
Get snapped grid point.

```typescript
const snapped = getGridSnapPoint(127, 8); // Returns 128
```

---

## Type Definitions

### Blueprint Types
See `app/types/blueprint.ts` for:
- Blueprint
- BlueprintSettings
- BlueprintProperties
- BlueprintClass
- CompilationResult
- BlueprintVersion
- BlueprintMetadata

### Node Types
See `app/types/nodes.ts` for:
- EditorNode
- Pin
- EditorEdge
- Variable
- Function
- Event
- Macro
- NodeGroup

### Execution Types
See `app/types/execution.ts` for:
- ExecutionContext
- ExecutionFrame
- Breakpoint
- DebugSession
- ProfilingData

### Compilation Types
See `app/types/compilation.ts` for:
- CompilationRequest
- CompilationStatus
- ValidationReport
- BuildConfiguration
- DependencyGraph

---

**API Reference Version:** 1.0  
**Last Updated:** 2026-02-11
