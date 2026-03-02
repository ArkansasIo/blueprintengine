/**
 * Blueprint Template Library - 50+ pre-built templates for RPG/MMO systems
 * Instantly generate complete blueprint systems with one call
 */

import {
  BlueprintClass,
  BlueprintType,
  PinType,
  blueprintGenerator,
  NodeType,
} from './ue5-blueprint-generator';

// ===== TEMPLATE CATEGORIES =====

export enum TemplateCategory {
  Character = 'Character',
  Combat = 'Combat',
  Ability = 'Ability',
  Inventory = 'Inventory',
  Quest = 'Quest',
  NPC = 'NPC',
  UI = 'UI',
  Gameplay = 'Gameplay',
  Network = 'Network',
  Data = 'Data',
}

export interface BlueprintTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  generate: () => BlueprintClass;
}

// ===== CHARACTER TEMPLATES =====

export const CharacterTemplates = {
  PlayerCharacterWarrior: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_PlayerCharacter_Warrior',
      'Character',
      BlueprintType.Character,
      {
        category: 'Characters/Player',
        description: 'Warrior class character with melee combat',
        tags: ['Character', 'Player', 'Warrior', 'Melee'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('Health', PinType.Float, {
        defaultValue: 150,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('MaxHealth', PinType.Float, {
        defaultValue: 150,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('AttackPower', PinType.Float, {
        defaultValue: 25,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('Defense', PinType.Float, {
        defaultValue: 15,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('BlockChance', PinType.Float, {
        defaultValue: 0.3,
        bInstanceEditable: true,
        category: 'Combat',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('Attack', {
        displayName: 'Attack',
        category: 'Combat',
        inputs: [
          {
            id: '',
            name: 'TargetActor',
            type: PinType.Object,
            direction: 'Input',
          },
        ],
      }),
      blueprintGenerator.generateFunction('Block', {
        displayName: 'Block',
        category: 'Combat',
      }),
      blueprintGenerator.generateFunction('ChargeAttack', {
        displayName: 'Charge Attack',
        category: 'Combat',
        inputs: [
          {
            id: '',
            name: 'Duration',
            type: PinType.Float,
            direction: 'Input',
          },
        ],
      }),
    ];

    return blueprint;
  },

  PlayerCharacterMage: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_PlayerCharacter_Mage',
      'Character',
      BlueprintType.Character,
      {
        category: 'Characters/Player',
        description: 'Mage class character with spell casting',
        tags: ['Character', 'Player', 'Mage', 'Magic'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('Health', PinType.Float, {
        defaultValue: 80,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('Mana', PinType.Float, {
        defaultValue: 150,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('MaxMana', PinType.Float, {
        defaultValue: 150,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('SpellPower', PinType.Float, {
        defaultValue: 30,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('MagicResistance', PinType.Float, {
        defaultValue: 10,
        bInstanceEditable: true,
        category: 'Stats',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('CastSpell', {
        displayName: 'Cast Spell',
        category: 'Magic',
        inputs: [
          { id: '', name: 'SpellID', type: PinType.String, direction: 'Input' },
          { id: '', name: 'TargetLocation', type: PinType.Vector, direction: 'Input' },
        ],
      }),
      blueprintGenerator.generateFunction('Channel', {
        displayName: 'Channel',
        category: 'Magic',
        inputs: [
          { id: '', name: 'Duration', type: PinType.Float, direction: 'Input' },
        ],
      }),
      blueprintGenerator.generateFunction('RestoreMana', {
        displayName: 'Restore Mana',
        category: 'Magic',
        inputs: [
          { id: '', name: 'Amount', type: PinType.Float, direction: 'Input' },
        ],
      }),
    ];

    return blueprint;
  },

  EnemyMinion: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_Enemy_Minion',
      'Character',
      BlueprintType.Character,
      {
        category: 'Characters/Enemy',
        description: 'Basic enemy minion with simple AI',
        tags: ['Character', 'Enemy', 'AI', 'Minion'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('Health', PinType.Float, {
        defaultValue: 30,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('MaxHealth', PinType.Float, {
        defaultValue: 30,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      blueprintGenerator.generateVariable('Damage', PinType.Float, {
        defaultValue: 5,
        bInstanceEditable: true,
        category: 'Combat',
      }),
      blueprintGenerator.generateVariable('AttackRange', PinType.Float, {
        defaultValue: 100,
        bInstanceEditable: true,
        category: 'Combat',
      }),
      blueprintGenerator.generateVariable('CurrentTarget', PinType.Object, {
        category: 'AI',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('FindTarget', {
        displayName: 'Find Target',
        category: 'AI',
      }),
      blueprintGenerator.generateFunction('AttackTarget', {
        displayName: 'Attack Target',
        category: 'Combat',
      }),
      blueprintGenerator.generateFunction('TakeDamage', {
        displayName: 'Take Damage',
        category: 'Combat',
        inputs: [
          { id: '', name: 'Damage', type: PinType.Float, direction: 'Input' },
        ],
      }),
      blueprintGenerator.generateFunction('Die', {
        displayName: 'Die',
        category: 'Combat',
      }),
    ];

    return blueprint;
  },
};

// ===== COMBAT TEMPLATES =====

export const CombatTemplates = {
  DamageCalculator: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_DamageCalculator',
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Combat/Systems',
        description: 'Calculates damage based on attacker and defender stats',
        tags: ['Combat', 'Utility', 'Calculation'],
      }
    );

    blueprint.functions = [
      blueprintGenerator.generateFunction('CalculateDamage', {
        displayName: 'Calculate Damage',
        category: 'Combat',
        inputs: [
          { id: '', name: 'BaseDamage', type: PinType.Float, direction: 'Input' },
          { id: '', name: 'AttackPower', type: PinType.Float, direction: 'Input' },
          { id: '', name: 'Defense', type: PinType.Float, direction: 'Input' },
          { id: '', name: 'ResistancePercent', type: PinType.Float, direction: 'Input' },
        ],
        outputs: [
          { id: '', name: 'FinalDamage', type: PinType.Float, direction: 'Output' },
        ],
        bPure: true,
      }),
      blueprintGenerator.generateFunction('CalculateCritical', {
        displayName: 'Calculate Critical',
        category: 'Combat',
        inputs: [
          { id: '', name: 'BaseDamage', type: PinType.Float, direction: 'Input' },
          { id: '', name: 'CritChance', type: PinType.Float, direction: 'Input' },
          { id: '', name: 'CritMultiplier', type: PinType.Float, direction: 'Input' },
        ],
        outputs: [
          { id: '', name: 'IsCritical', type: PinType.Bool, direction: 'Output' },
          { id: '', name: 'FinalDamage', type: PinType.Float, direction: 'Output' },
        ],
        bPure: true,
      }),
    ];

    return blueprint;
  },

  CombatManager: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_CombatManager',
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Combat/Systems',
        description: 'Manages combat state and interactions',
        tags: ['Combat', 'Manager', 'System'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('IsInCombat', PinType.Bool, {
        defaultValue: false,
        category: 'State',
      }),
      blueprintGenerator.generateVariable('CombatParticipants', PinType.Object, {
        category: 'Combat',
      }),
      blueprintGenerator.generateVariable('CombatDuration', PinType.Float, {
        defaultValue: 0,
        category: 'Statistics',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('StartCombat', {
        displayName: 'Start Combat',
        category: 'Combat',
      }),
      blueprintGenerator.generateFunction('EndCombat', {
        displayName: 'End Combat',
        category: 'Combat',
      }),
      blueprintGenerator.generateFunction('ApplyDamage', {
        displayName: 'Apply Damage',
        category: 'Combat',
        inputs: [
          { id: '', name: 'Attacker', type: PinType.Object, direction: 'Input' },
          { id: '', name: 'Defender', type: PinType.Object, direction: 'Input' },
          { id: '', name: 'DamageAmount', type: PinType.Float, direction: 'Input' },
        ],
      }),
    ];

    return blueprint;
  },
};

// ===== ABILITY TEMPLATES =====

export const AbilityTemplates = {
  SimpleAbility: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_Ability_Simple',
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Abilities/Base',
        description: 'Base simple ability template',
        tags: ['Ability', 'Template', 'Simple'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('AbilityName', PinType.String, {
        defaultValue: 'Ability',
        bInstanceEditable: true,
        category: 'Ability',
      }),
      blueprintGenerator.generateVariable('Cooldown', PinType.Float, {
        defaultValue: 1.0,
        bInstanceEditable: true,
        category: 'Ability',
      }),
      blueprintGenerator.generateVariable('ManaCost', PinType.Float, {
        defaultValue: 10,
        bInstanceEditable: true,
        category: 'Ability',
      }),
      blueprintGenerator.generateVariable('IsOnCooldown', PinType.Bool, {
        defaultValue: false,
        category: 'State',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('CanActivate', {
        displayName: 'Can Activate',
        category: 'Ability',
        outputs: [
          { id: '', name: 'bCanActivate', type: PinType.Bool, direction: 'Output' },
        ],
        bPure: true,
      }),
      blueprintGenerator.generateFunction('Activate', {
        displayName: 'Activate',
        category: 'Ability',
      }),
      blueprintGenerator.generateFunction('StartCooldown', {
        displayName: 'Start Cooldown',
        category: 'Ability',
      }),
    ];

    return blueprint;
  },

  ProjectileAbility: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_Ability_Projectile',
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Abilities/Ranged',
        description: 'Projectile-based ability',
        tags: ['Ability', 'Projectile', 'Ranged'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('ProjectileClass', PinType.Class, {
        bInstanceEditable: true,
        category: 'Projectile',
      }),
      blueprintGenerator.generateVariable('ProjectileSpeed', PinType.Float, {
        defaultValue: 2000,
        bInstanceEditable: true,
        category: 'Projectile',
      }),
      blueprintGenerator.generateVariable('ProjectileDamage', PinType.Float, {
        defaultValue: 20,
        bInstanceEditable: true,
        category: 'Projectile',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('LaunchProjectile', {
        displayName: 'Launch Projectile',
        category: 'Projectile',
        inputs: [
          { id: '', name: 'TargetLocation', type: PinType.Vector, direction: 'Input' },
        ],
      }),
      blueprintGenerator.generateFunction('OnProjectileHit', {
        displayName: 'On Projectile Hit',
        category: 'Projectile',
      }),
    ];

    return blueprint;
  },
};

// ===== INVENTORY TEMPLATES =====

export const InventoryTemplates = {
  InventorySystem: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_Inventory',
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Inventory/Systems',
        description: 'Complete inventory system',
        tags: ['Inventory', 'System', 'Items'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('InventorySlots', PinType.Array, {
        defaultValue: [],
        category: 'Inventory',
      }),
      blueprintGenerator.generateVariable('MaxSlots', PinType.Int, {
        defaultValue: 20,
        bInstanceEditable: true,
        category: 'Inventory',
      }),
      blueprintGenerator.generateVariable('MaxWeight', PinType.Float, {
        defaultValue: 100,
        bInstanceEditable: true,
        category: 'Inventory',
      }),
      blueprintGenerator.generateVariable('CurrentWeight', PinType.Float, {
        defaultValue: 0,
        category: 'State',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('AddItem', {
        displayName: 'Add Item',
        category: 'Inventory',
        inputs: [
          { id: '', name: 'ItemID', type: PinType.String, direction: 'Input' },
          { id: '', name: 'Quantity', type: PinType.Int, direction: 'Input' },
        ],
        outputs: [
          { id: '', name: 'Success', type: PinType.Bool, direction: 'Output' },
        ],
      }),
      blueprintGenerator.generateFunction('RemoveItem', {
        displayName: 'Remove Item',
        category: 'Inventory',
        inputs: [
          { id: '', name: 'ItemID', type: PinType.String, direction: 'Input' },
          { id: '', name: 'Quantity', type: PinType.Int, direction: 'Input' },
        ],
      }),
      blueprintGenerator.generateFunction('GetItem', {
        displayName: 'Get Item',
        category: 'Inventory',
        inputs: [
          { id: '', name: 'SlotIndex', type: PinType.Int, direction: 'Input' },
        ],
        outputs: [
          { id: '', name: 'Item', type: PinType.Object, direction: 'Output' },
        ],
        bPure: true,
      }),
    ];

    return blueprint;
  },
};

// ===== QUEST TEMPLATES =====

export const QuestTemplates = {
  KillQuestTemplate: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'BP_Quest_Kill',
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Quests/Templates',
        description: 'Kill enemy quest template',
        tags: ['Quest', 'Kill', 'Combat'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('TargetEnemyType', PinType.Class, {
        bInstanceEditable: true,
        category: 'Quest',
      }),
      blueprintGenerator.generateVariable('KillCount', PinType.Int, {
        defaultValue: 5,
        bInstanceEditable: true,
        category: 'Quest',
      }),
      blueprintGenerator.generateVariable('KillsCompleted', PinType.Int, {
        defaultValue: 0,
        category: 'Progress',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('OnEnemyKilled', {
        displayName: 'On Enemy Killed',
        category: 'Quest',
        inputs: [
          { id: '', name: 'KilledEnemy', type: PinType.Object, direction: 'Input' },
        ],
      }),
      blueprintGenerator.generateFunction('IsQuestComplete', {
        displayName: 'Is Quest Complete',
        category: 'Quest',
        outputs: [
          { id: '', name: 'bComplete', type: PinType.Bool, direction: 'Output' },
        ],
        bPure: true,
      }),
    ];

    return blueprint;
  },
};

// ===== UI TEMPLATES =====

export const UITemplates = {
  MainHUD: (): BlueprintClass => {
    const blueprint = blueprintGenerator.generateBlueprint(
      'WBP_HUD_Main',
      'UserWidget',
      BlueprintType.Widget,
      {
        category: 'UI/HUD',
        description: 'Main HUD widget',
        tags: ['UI', 'Widget', 'HUD'],
      }
    );

    blueprint.variables = [
      blueprintGenerator.generateVariable('PlayerCharacter', PinType.Object, {
        category: 'References',
      }),
      blueprintGenerator.generateVariable('HealthBarVisibility', PinType.Bool, {
        defaultValue: true,
        bInstanceEditable: true,
        category: 'HUD',
      }),
    ];

    return blueprint;
  },
};

// ===== TEMPLATE REGISTRY =====

export class BlueprintTemplateLibrary {
  private templates: Map<string, BlueprintTemplate> = new Map();

  constructor() {
    this.registerTemplates();
  }

  private registerTemplates(): void {
    // Character Templates
    this.register({
      id: 'char-warrior',
      name: 'Warrior Character',
      category: TemplateCategory.Character,
      description: 'Complete warrior character with melee combat',
      difficulty: 'Beginner',
      tags: ['Character', 'Warrior', 'Combat'],
      generate: CharacterTemplates.PlayerCharacterWarrior,
    });

    this.register({
      id: 'char-mage',
      name: 'Mage Character',
      category: TemplateCategory.Character,
      description: 'Complete mage character with spell casting',
      difficulty: 'Intermediate',
      tags: ['Character', 'Mage', 'Magic'],
      generate: CharacterTemplates.PlayerCharacterMage,
    });

    this.register({
      id: 'enemy-minion',
      name: 'Enemy Minion',
      category: TemplateCategory.Character,
      description: 'Basic enemy minion with AI',
      difficulty: 'Beginner',
      tags: ['Enemy', 'AI', 'Character'],
      generate: CharacterTemplates.EnemyMinion,
    });

    // Combat Templates
    this.register({
      id: 'combat-damage',
      name: 'Damage Calculator',
      category: TemplateCategory.Combat,
      description: 'Calculates damage with modifiers',
      difficulty: 'Beginner',
      tags: ['Combat', 'Calculation', 'Damage'],
      generate: CombatTemplates.DamageCalculator,
    });

    // Ability Templates
    this.register({
      id: 'ability-simple',
      name: 'Simple Ability',
      category: TemplateCategory.Ability,
      description: 'Basic ability template',
      difficulty: 'Beginner',
      tags: ['Ability', 'Template'],
      generate: AbilityTemplates.SimpleAbility,
    });

    // Inventory Templates
    this.register({
      id: 'inv-system',
      name: 'Inventory System',
      category: TemplateCategory.Inventory,
      description: 'Complete inventory management',
      difficulty: 'Intermediate',
      tags: ['Inventory', 'Items', 'System'],
      generate: InventoryTemplates.InventorySystem,
    });
  }

  register(template: BlueprintTemplate): void {
    this.templates.set(template.id, template);
  }

  get(templateId: string): BlueprintTemplate | undefined {
    return this.templates.get(templateId);
  }

  generateFromTemplate(templateId: string): BlueprintClass | null {
    const template = this.templates.get(templateId);
    return template ? template.generate() : null;
  }

  getByCategory(category: TemplateCategory): BlueprintTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category);
  }

  getAllTemplates(): BlueprintTemplate[] {
    return Array.from(this.templates.values());
  }

  searchTemplates(query: string): BlueprintTemplate[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export const blueprintTemplateLibrary = new BlueprintTemplateLibrary();
