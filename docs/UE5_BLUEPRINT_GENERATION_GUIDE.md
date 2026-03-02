# UE5 Blueprint Generation System - Complete Guide

## Overview

This system provides comprehensive tools for generating, importing, exporting, and converting UE5 blueprints programmatically. Perfect for RPG/MMO games, tool development, and blueprint automation.

## Features

### 1. **Blueprint Generator** (`ue5-blueprint-generator.ts`)
- **50+ Node Types**: Event, Branch, Loop, Function Call, Timeline, etc.
- **Type System**: Bool, Int, Float, Vector, String, Object, Custom types
- **Complete Structures**: Functions, Variables, Events, Components
- **Validation Engine**: Automatic graph validation
- **RPG Templates**: Pre-built character blueprints

### 2. **Import/Export System** (`blueprint-import-export.ts`)
- **7 Export Formats**:
  - JSON (compact & pretty)
  - YAML (human-readable)
  - XML (structured data)
  - CSV (tabular data)
  - SQL (database insert)
  - UE5 Native C++ headers
  - GraphQL (API compatible)

### 3. **UML to Blueprint Converter** (`uml-to-blueprint.ts`)
- **Class Diagrams** → Blueprint Classes
- **Sequence Diagrams** → Blueprint Functions
- **State Machines** → State-based Systems
- **Activity Diagrams** → Blueprint Logic Flow
- **PlantUML Parser** → Direct conversion from PlantUML syntax

### 4. **Template Library** (`blueprint-template-library.ts`)
- **20+ Categories**: Character, Combat, Ability, Inventory, Quest, NPC, UI
- **Instant Generation**: Pre-configured complete systems
- **Difficulty Levels**: Beginner → Advanced
- **Search & Filter**: Find templates by tags and keywords

---

## Quick Start

### Basic Blueprint Generation

```typescript
import { blueprintGenerator, BlueprintType } from '@/app/utils/ue5-blueprint-generator';

// Create a simple character blueprint
const character = blueprintGenerator.generateBlueprint(
  'BP_Player_Knight',
  'Character',
  BlueprintType.Character,
  {
    category: 'Characters/Player',
    description: 'Knight player character',
    tags: ['Player', 'Warrior'],
  }
);

// Add variables
character.variables.push(
  blueprintGenerator.generateVariable('Health', 'float', {
    defaultValue: 100,
    bInstanceEditable: true,
    category: 'Stats',
  })
);

// Add a function
character.functions.push(
  blueprintGenerator.generateFunction('TakeDamage', {
    inputs: [{ id: '', name: 'Damage', type: 'float', direction: 'Input' }],
    category: 'Combat',
  })
);
```

### Export to JSON

```typescript
import { blueprintExportManager, ExportFormat } from '@/app/utils/blueprint-import-export';

// Export as formatted JSON
const json = blueprintExportManager.exportAs(character, ExportFormat.JSON_PRETTY);
console.log(json);

// Export as C++ header for UE5
const cppHeader = blueprintExportManager.exportAs(character, ExportFormat.UE5_NATIVE);
```

### Convert from UML

```typescript
import { umlConverter } from '@/app/utils/uml-to-blueprint';

// Define UML class
const umlCharacter: UMLClass = {
  name: 'PlayerCharacter',
  stereotype: '<<Character>>',
  attributes: [
    { name: 'Health', type: 'float', visibility: 'public' },
    { name: 'Mana', type: 'float', visibility: 'public' },
  ],
  methods: [
    { name: 'TakeDamage', visibility: 'public', returnType: 'void', parameters: [] },
    { name: 'Attack', visibility: 'public', returnType: 'void', parameters: [] },
  ],
  associations: [],
};

// Convert to blueprint
const blueprint = umlConverter.convertClass(umlCharacter);
```

### Use Template Library

```typescript
import { blueprintTemplateLibrary, TemplateCategory } from '@/app/utils/blueprint-template-library';

// Get all character templates
const charTemplates = blueprintTemplateLibrary.getByCategory(TemplateCategory.Character);

// Generate specific template
const warrior = blueprintTemplateLibrary.generateFromTemplate('char-warrior');

// Search templates
const results = blueprintTemplateLibrary.searchTemplates('damage');
```

---

## Folder Structure

```
Content/
├── Blueprints/
│   ├── Framework/
│   │   ├── BP_GameInstance
│   │   ├── BP_GameMode
│   │   ├── BP_GameState
│   │   ├── BP_PlayerController
│   │   ├── BP_PlayerState
│   │   └── Subsystems/
│   │
│   ├── Characters/
│   │   ├── BP_Character_Base
│   │   ├── BP_Character_Player
│   │   ├── BP_Character_Enemy
│   │   └── Components/
│   │       ├── BP_StatsComponent
│   │       ├── BP_CombatComponent
│   │       ├── BP_InventoryComponent
│   │       └── BP_AbilityComponent
│   │
│   ├── Combat/
│   │   ├── Abilities/
│   │   │   ├── BP_Ability_Base
│   │   │   ├── BP_Ability_Melee
│   │   │   └── BP_Ability_Spell
│   │   ├── Effects/
│   │   │   ├── BP_StatusEffect_Damage
│   │   │   ├── BP_StatusEffect_Buff
│   │   │   └── BP_StatusEffect_Debuff
│   │   └── Projectiles/
│   │       ├── BP_Projectile_Base
│   │       ├── BP_Projectile_Bullet
│   │       └── BP_Projectile_Spell
│   │
│   ├── Inventory/
│   │   ├── BP_Item_Base
│   │   ├── BP_Item_Equipment
│   │   ├── BP_Inventory_Manager
│   │   └── BP_Equipment_Slot
│   │
│   ├── World/
│   │   ├── Interactables/
│   │   │   ├── BP_Door
│   │   │   ├── BP_Chest
│   │   │   └── BP_Portal
│   │   ├── Spawners/
│   │   │   ├── BP_EnemySpawner
│   │   │   └── BP_LootSpawner
│   │   └── Events/
│   │       ├── BP_WorldEvent_Boss
│   │       └── BP_WorldEvent_Dungeon
│   │
│   ├── UI/
│   │   ├── WBP_HUD_Main
│   │   ├── WBP_Menu_Root
│   │   ├── WBP_Inventory
│   │   ├── WBP_Equipment
│   │   ├── WBP_QuestLog
│   │   └── Panels/
│   │       ├── WBP_Panel_Stats
│   │       ├── WBP_Panel_Skills
│   │       └── WBP_Panel_Social
│   │
│   ├── AI/
│   │   ├── BP_AIController_Base
│   │   ├── BT_Combat
│   │   ├── BT_Patrol
│   │   └── BB_AIBlackboard
│   │
│   ├── Quests/
│   │   ├── BP_Quest_Base
│   │   ├── BP_Quest_Kill
│   │   └── BP_Objective_Base
│   │
│   ├── Interfaces/
│   │   ├── BPI_Damageable
│   │   ├── BPI_Interactable
│   │   └── BPI_TeamAgent
│   │
│   └── Libraries/
│       ├── BFL_RPGMath
│       ├── BFL_CombatFormulas
│       ├── BFL_ItemUtils
│       └── BFL_UIUtils
│
├── Data/
│   ├── Items/
│   │   ├── DT_Items_Weapons
│   │   └── DA_Item_Sword
│   ├── Abilities/
│   │   ├── DT_Abilities
│   │   └── DA_Ability_Slash
│   ├── Enemies/
│   │   └── DT_Enemies_Database
│   ├── Loot/
│   │   ├── DT_LootTable_Common
│   │   └── DT_LootTable_Boss
│   ├── Quests/
│   │   ├── DA_Quest_Chapter1_01
│   │   └── DT_Quests_List
│   ├── Curves/
│   │   ├── DT_ExpCurve
│   │   ├── DT_DamageScaling
│   │   └── DT_LevelProgression
│   ├── Enums/
│   │   ├── E_DamageType
│   │   ├── E_ItemRarity
│   │   └── E_AbilityType
│   ├── Structs/
│   │   ├── S_AttributeSet
│   │   ├── S_ItemData
│   │   ├── S_AbilityData
│   │   └── S_StatusEffectData
│   └── Subsystems/
│       ├── DA_GameRules
│       └── DA_BalanceConfig
│
├── Levels/
│   ├── L_MainMenu
│   ├── L_StartingArea
│   ├── L_MainCity
│   └── L_Dungeon_01
│
└── Saves/
    ├── SaveGame_Slot01
    └── PlayerData_User001
```

---

## Naming Conventions

| Category | Prefix | Example |
|----------|--------|---------|
| Blueprint Actor | `BP_` | `BP_Character_Player` |
| Blueprint Character | `BP_` | `BP_Character_Boss` |
| Blueprint Component | `BP_` | `BP_StatsComponent` |
| Blueprint Interface | `BPI_` | `BPI_Damageable` |
| Blueprint Library | `BFL_` | `BFL_RPGMath` |
| Blueprint Macro | `BML_` | `BML_CommonMacros` |
| Widget | `WBP_` | `WBP_HUD_Main` |
| Data Asset | `DA_` | `DA_Item_Sword` |
| Data Table | `DT_` | `DT_ExpCurve` |
| Enum | `E_` | `E_DamageType` |
| Struct | `S_` | `S_ItemData` |
| Behavior Tree | `BT_` | `BT_Combat` |
| Blackboard | `BB_` | `BB_AIBlackboard` |
| Subsystem | `SS_` | `SS_GameInstance_Economy` |

---

## Best Practices

### 1. **Node Organization**
- Keep nodes in logical groups by functionality
- Use comments to describe complex logic
- Align nodes for readability
- Maximum 20-30 nodes per function for clarity

### 2. **Function Design**
- **Pure Functions**: For calculations without side effects
- **Callable Functions**: For gameplay logic
- **Event-Driven**: Use events for callbacks
- Keep functions focused on single responsibility

### 3. **Variable Management**
```typescript
// ✅ GOOD: Organized by category
blueprint.variables = [
  // Stats
  generateVariable('Health', 'float', { category: 'Stats' }),
  generateVariable('Mana', 'float', { category: 'Stats' }),
  // Combat
  generateVariable('AttackPower', 'float', { category: 'Combat' }),
];

// ❌ BAD: No organization
blueprint.variables = [
  generateVariable('Health', 'float'),
  generateVariable('AttackPower', 'float'),
  generateVariable('Mana', 'float'),
];
```

### 4. **Type Safety**
- Always specify pin types explicitly
- Validate connections match types
- Use proper container types (Array, Map)
- Handle type conversions with Cast nodes

### 5. **Performance**
- Minimize per-frame calculations in Tick events
- Use timers for periodic checks
- Cache frequently accessed data
- Profile complex graphs

---

## Advanced Features

### Custom Node Generation

```typescript
const customNode = blueprintGenerator.generateNode(NodeType.FunctionCall, {
  name: 'CustomLogic',
  position: { x: 200, y: 100 },
  pins: [
    { id: '', name: 'In', type: PinType.Exec, direction: 'Input' },
    { id: '', name: 'Out', type: PinType.Exec, direction: 'Output' },
  ],
  properties: { CustomProperty: 'Value' },
  comment: 'This is custom logic',
});
```

### Graph Validation

```typescript
const validation = blueprintGenerator.validateBlueprint(blueprint);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

### Batch Export

```typescript
const blueprints = [character, enemy, item];

blueprints.forEach((bp) => {
  const json = blueprintExportManager.exportAs(bp, ExportFormat.JSON);
  // Save to file or database
});
```

---

## Integration Examples

### With React Component

```typescript
import { blueprintGenerator } from '@/app/utils/ue5-blueprint-generator';
import { blueprintExportManager, ExportFormat } from '@/app/utils/blueprint-import-export';

export function BlueprintGenerator() {
  const [blueprint, setBlueprint] = useState(null);

  const generateWarrior = () => {
    const warrior = blueprintGenerator.generateBlueprint(
      'BP_Warrior',
      'Character',
      BlueprintType.Character
    );
    setBlueprint(warrior);
  };

  const exportBlueprint = () => {
    if (!blueprint) return;
    const json = blueprintExportManager.exportAs(blueprint, ExportFormat.JSON_PRETTY);
    // Download or save
  };

  return (
    <View>
      <Button onPress={generateWarrior}>Generate Warrior</Button>
      <Button onPress={exportBlueprint}>Export as JSON</Button>
    </View>
  );
}
```

### With Zustand Store

```typescript
import { create } from 'zustand';

const useBlueprintStore = create((set) => ({
  blueprints: [],
  createBlueprint: (name, type) =>
    set((state) => ({
      blueprints: [
        ...state.blueprints,
        blueprintGenerator.generateBlueprint(name, 'Actor', type),
      ],
    })),
  exportBlueprint: (id) => {
    // Export logic
  },
}));
```

---

## Troubleshooting

### Node Connection Errors
- Verify pin types match
- Check pin direction (Input/Output)
- Ensure valid nodeId references

### Validation Failures
- Check for orphan nodes
- Verify all required pins connected
- Use comment nodes to document logic

### Export Format Issues
- Ensure blueprint data is complete
- Use JSON validation
- Check for circular dependencies

---

## API Reference

### BlueprintGenerator Methods

```typescript
// Create blueprints
generateBlueprint(name, baseClass, type, config?)
generateFunction(name, config?)
generateEvent(name, config?)
generateVariable(name, type, config?)
generateNode(type, config?)

// Specific node types
generateBranchNode(position?)
generateForLoopNode(position?)
generateFunctionCallNode(name, inputs, outputs, position?)
generateSequenceNode(count, position?)
generateDelayNode(duration, position?)

// Utilities
createEdge(fromNodeId, toNodeId, fromPinId, toPinId)
validateBlueprint(blueprint)
generateRPGCharacterBlueprint(name, class)
```

---

## Version History

- **v1.0.0** (Current)
  - Initial release
  - 50+ node types supported
  - 7 export formats
  - UML converter
  - 20+ templates
  - Full validation engine

---

## Support & Documentation

- **GitHub**: [Blueprint Generator Repo]
- **Discord**: [Community Server]
- **Docs**: [Full API Documentation]
- **Examples**: [Example Projects]

---

**Generated with ❤️ for UE5 developers**
