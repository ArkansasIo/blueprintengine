/**
 * AI Blueprint Chat System - Conversational AI for blueprint generation
 * Understands natural language project descriptions and generates complete blueprints
 */

import {
  BlueprintClass,
  BlueprintFunction,
  BlueprintVariable,
  BlueprintEvent,
  BlueprintType,
  PinType,
  blueprintGenerator,
} from './ue5-blueprint-generator';
import { blueprintTemplateLibrary, TemplateCategory } from './blueprint-template-library';
import { umlConverter } from './uml-to-blueprint';

// ===== CHAT MESSAGE TYPES =====

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: {
    blueprintGenerated?: BlueprintClass;
    intent?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  blueprints: BlueprintClass[];
  projectContext?: ProjectContext;
}

export interface ProjectContext {
  name: string;
  type: 'Game' | 'Tool' | 'Framework' | 'Plugin' | 'System';
  description: string;
  platforms: string[];
  targetAudience: string;
  features: string[];
  technicalStack: string[];
}

// ===== INTENT DETECTION =====

export enum UserIntent {
  GenerateBlueprint = 'generate_blueprint',
  CreateCharacter = 'create_character',
  CreateSystem = 'create_system',
  CreateAbility = 'create_ability',
  CreateItem = 'create_item',
  CreateQuest = 'create_quest',
  CreateUI = 'create_ui',
  ExportBlueprint = 'export_blueprint',
  ModifyBlueprint = 'modify_blueprint',
  AskQuestion = 'ask_question',
  GetHelp = 'get_help',
  ListTemplates = 'list_templates',
}

// ===== AI BLUEPRINT CHAT CLASS =====

export class AIBlueprintChat {
  private conversations: Map<string, ChatConversation> = new Map();
  private currentConversationId: string | null = null;

  /**
   * Initialize a new conversation
   */
  initializeConversation(title: string, projectContext?: ProjectContext): ChatConversation {
    const conversationId = this.generateId('conv');
    const conversation: ChatConversation = {
      id: conversationId,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blueprints: [],
      projectContext,
    };

    this.conversations.set(conversationId, conversation);
    this.currentConversationId = conversationId;

    // Add welcome message
    const welcomeMessage = this.createAssistantMessage(
      `Welcome to Blueprint AI! I'll help you create ${projectContext?.name || 'your project'} blueprints. 🎨\n\nYou can ask me to:\n• Generate character blueprints\n• Create combat systems\n• Build inventory systems\n• Design UI layouts\n• Create quest systems\n• And much more!\n\nWhat would you like to create first?`
    );

    conversation.messages.push(welcomeMessage);
    conversation.updatedAt = Date.now();

    return conversation;
  }

  /**
   * Process user input and generate response
   */
  async processUserMessage(userMessage: string): Promise<ChatMessage> {
    if (!this.currentConversationId) {
      throw new Error('No active conversation');
    }

    const conversation = this.conversations.get(this.currentConversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Create user message
    const userMsg = this.createUserMessage(userMessage);
    conversation.messages.push(userMsg);

    // Detect intent
    const intent = this.detectIntent(userMessage);

    // Generate response
    let assistantResponse: ChatMessage;

    switch (intent) {
      case UserIntent.GenerateBlueprint:
        assistantResponse = await this.handleGenerateBlueprint(userMessage, conversation);
        break;
      case UserIntent.CreateCharacter:
        assistantResponse = await this.handleCreateCharacter(userMessage, conversation);
        break;
      case UserIntent.CreateSystem:
        assistantResponse = await this.handleCreateSystem(userMessage, conversation);
        break;
      case UserIntent.CreateAbility:
        assistantResponse = await this.handleCreateAbility(userMessage, conversation);
        break;
      case UserIntent.ListTemplates:
        assistantResponse = this.handleListTemplates(userMessage);
        break;
      case UserIntent.AskQuestion:
        assistantResponse = this.handleQuestion(userMessage);
        break;
      case UserIntent.GetHelp:
        assistantResponse = this.handleHelp(userMessage);
        break;
      default:
        assistantResponse = this.handleGeneralQuery(userMessage);
    }

    conversation.messages.push(assistantResponse);
    conversation.updatedAt = Date.now();

    return assistantResponse;
  }

  /**
   * Detect user intent from message
   */
  private detectIntent(message: string): UserIntent {
    const lowerMessage = message.toLowerCase();

    // Character creation
    if (
      lowerMessage.includes('character') ||
      lowerMessage.includes('player') ||
      lowerMessage.includes('hero') ||
      lowerMessage.includes('warrior') ||
      lowerMessage.includes('mage')
    ) {
      return UserIntent.CreateCharacter;
    }

    // System creation
    if (
      lowerMessage.includes('system') ||
      lowerMessage.includes('manager') ||
      lowerMessage.includes('game loop')
    ) {
      return UserIntent.CreateSystem;
    }

    // Ability creation
    if (
      lowerMessage.includes('ability') ||
      lowerMessage.includes('skill') ||
      lowerMessage.includes('spell') ||
      lowerMessage.includes('power')
    ) {
      return UserIntent.CreateAbility;
    }

    // Item creation
    if (
      lowerMessage.includes('item') ||
      lowerMessage.includes('weapon') ||
      lowerMessage.includes('equipment')
    ) {
      return UserIntent.CreateItem;
    }

    // Quest creation
    if (
      lowerMessage.includes('quest') ||
      lowerMessage.includes('mission') ||
      lowerMessage.includes('objective')
    ) {
      return UserIntent.CreateQuest;
    }

    // UI creation
    if (
      lowerMessage.includes('ui') ||
      lowerMessage.includes('interface') ||
      lowerMessage.includes('menu') ||
      lowerMessage.includes('widget')
    ) {
      return UserIntent.CreateUI;
    }

    // List templates
    if (
      lowerMessage.includes('show templates') ||
      lowerMessage.includes('list templates') ||
      lowerMessage.includes('what templates')
    ) {
      return UserIntent.ListTemplates;
    }

    // Help
    if (
      lowerMessage.includes('help') ||
      lowerMessage.includes('how to') ||
      lowerMessage.includes('can you')
    ) {
      return UserIntent.GetHelp;
    }

    // Export
    if (
      lowerMessage.includes('export') ||
      lowerMessage.includes('download') ||
      lowerMessage.includes('save')
    ) {
      return UserIntent.ExportBlueprint;
    }

    // Default to general query
    return UserIntent.AskQuestion;
  }

  /**
   * Handle generic blueprint generation
   */
  private async handleGenerateBlueprint(
    userMessage: string,
    conversation: ChatConversation
  ): Promise<ChatMessage> {
    try {
      // Parse project requirements
      const requirements = this.parseRequirements(userMessage);

      // Generate blueprint
      const blueprint = blueprintGenerator.generateBlueprint(
        requirements.name,
        requirements.baseClass,
        requirements.type,
        {
          category: requirements.category,
          description: userMessage,
          tags: requirements.tags,
        }
      );

      // Add variables based on requirements
      requirements.variables.forEach((varName) => {
        blueprint.variables.push(
          blueprintGenerator.generateVariable(varName, PinType.Float, {
            bInstanceEditable: true,
            category: 'Properties',
          })
        );
      });

      // Add functions based on requirements
      requirements.functions.forEach((funcName) => {
        blueprint.functions.push(
          blueprintGenerator.generateFunction(funcName, {
            displayName: funcName,
            category: 'Methods',
          })
        );
      });

      conversation.blueprints.push(blueprint);

      const response = this.createAssistantMessage(
        `✅ **${blueprint.name}** created successfully!\n\n` +
        `**Type**: ${blueprint.type}\n` +
        `**Base Class**: ${blueprint.baseClass}\n` +
        `**Variables**: ${blueprint.variables.length}\n` +
        `**Functions**: ${blueprint.functions.length}\n\n` +
        `Would you like me to:\n` +
        `• Add more variables or functions\n` +
        `• Export this blueprint\n` +
        `• Create related blueprints\n` +
        `• Modify the current blueprint`
      );

      response.metadata = {
        blueprintGenerated: blueprint,
        intent: UserIntent.GenerateBlueprint,
        confidence: 0.9,
      };

      return response;
    } catch (error) {
      return this.createAssistantMessage(
        `❌ Error creating blueprint: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Handle character creation
   */
  private async handleCreateCharacter(
    userMessage: string,
    conversation: ChatConversation
  ): Promise<ChatMessage> {
    // Extract character details
    const characterType = this.extractCharacterType(userMessage);
    const characterName = this.extractName(userMessage) || `Character_${characterType}`;

    let blueprint: BlueprintClass;

    // Use template if matches known type
    if (characterType.toLowerCase().includes('warrior')) {
      blueprint = blueprintTemplateLibrary.generateFromTemplate('char-warrior') ||
        blueprintGenerator.generateBlueprint(
          `BP_${characterName}`,
          'Character',
          BlueprintType.Character
        );
    } else if (characterType.toLowerCase().includes('mage')) {
      blueprint = blueprintTemplateLibrary.generateFromTemplate('char-mage') ||
        blueprintGenerator.generateBlueprint(
          `BP_${characterName}`,
          'Character',
          BlueprintType.Character
        );
    } else {
      blueprint = blueprintGenerator.generateRPGCharacterBlueprint(
        characterName,
        characterType
      );
    }

    conversation.blueprints.push(blueprint);

    const response = this.createAssistantMessage(
      `🧙 **${blueprint.name}** (${characterType}) created!\n\n` +
      `**Stats**:\n` +
      blueprint.variables
        .slice(0, 5)
        .map((v) => `• ${v.name}: ${v.defaultValue}`)
        .join('\n') +
      `\n\n**Available Actions**:\n` +
      blueprint.functions.slice(0, 3).map((f) => `• ${f.name}`).join('\n') +
      `\n\nWhat would you like to customize?`
    );

    response.metadata = {
      blueprintGenerated: blueprint,
      intent: UserIntent.CreateCharacter,
      confidence: 0.95,
    };

    return response;
  }

  /**
   * Handle system creation
   */
  private async handleCreateSystem(
    userMessage: string,
    conversation: ChatConversation
  ): Promise<ChatMessage> {
    const systemType = this.extractSystemType(userMessage);
    const systemName = this.extractName(userMessage) || `System_${systemType}`;

    const blueprint = blueprintGenerator.generateBlueprint(
      `BP_${systemName}`,
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Systems',
        description: `${systemType} system: ${userMessage}`,
        tags: [systemType, 'System', 'Generated'],
      }
    );

    // Add system-specific variables and functions
    const systemConfig = this.getSystemConfig(systemType);
    blueprint.variables = systemConfig.variables;
    blueprint.functions = systemConfig.functions;

    conversation.blueprints.push(blueprint);

    const response = this.createAssistantMessage(
      `⚙️ **${blueprint.name}** system created!\n\n` +
      `**System Type**: ${systemType}\n` +
      `**Components**: ${blueprint.variables.length} variables, ${blueprint.functions.length} functions\n\n` +
      `Key Features:\n` +
      systemConfig.features.map((f) => `• ${f}`).join('\n') +
      `\n\nWould you like to expand this system?`
    );

    response.metadata = {
      blueprintGenerated: blueprint,
      intent: UserIntent.CreateSystem,
      confidence: 0.85,
    };

    return response;
  }

  /**
   * Handle ability creation
   */
  private async handleCreateAbility(
    userMessage: string,
    conversation: ChatConversation
  ): Promise<ChatMessage> {
    const abilityName = this.extractName(userMessage) || 'CustomAbility';
    const abilityType = this.extractAbilityType(userMessage);

    const blueprint = blueprintGenerator.generateBlueprint(
      `BP_Ability_${abilityName}`,
      'Actor',
      BlueprintType.Actor,
      {
        category: 'Abilities',
        description: `${abilityType} ability: ${userMessage}`,
        tags: [abilityType, 'Ability', 'Generated'],
      }
    );

    // Add ability-specific properties
    blueprint.variables = [
      blueprintGenerator.generateVariable('AbilityName', PinType.String, {
        defaultValue: abilityName,
        category: 'Ability',
      }),
      blueprintGenerator.generateVariable('Cooldown', PinType.Float, {
        defaultValue: 1.0,
        category: 'Cooldown',
      }),
      blueprintGenerator.generateVariable('ManaCost', PinType.Float, {
        defaultValue: 10,
        category: 'Resource',
      }),
    ];

    blueprint.functions = [
      blueprintGenerator.generateFunction('Activate', {
        displayName: 'Activate',
        category: 'Ability',
      }),
      blueprintGenerator.generateFunction('Execute', {
        displayName: 'Execute',
        category: 'Ability',
      }),
      blueprintGenerator.generateFunction('StartCooldown', {
        displayName: 'Start Cooldown',
        category: 'Cooldown',
      }),
    ];

    conversation.blueprints.push(blueprint);

    const response = this.createAssistantMessage(
      `⚡ **${blueprint.name}** ability created!\n\n` +
      `**Type**: ${abilityType}\n` +
      `**Cost**: Mana\n` +
      `**Cooldown**: 1 second\n\n` +
      `This ${abilityType} ability is ready to customize. You can:\n` +
      `• Adjust cooldown and mana cost\n` +
      `• Add special effects\n` +
      `• Create projectiles\n` +
      `• Set up particle effects`
    );

    response.metadata = {
      blueprintGenerated: blueprint,
      intent: UserIntent.CreateAbility,
      confidence: 0.9,
    };

    return response;
  }

  /**
   * Handle template listing
   */
  private handleListTemplates(userMessage: string): ChatMessage {
    const allTemplates = blueprintTemplateLibrary.getAllTemplates();

    const response = this.createAssistantMessage(
      `📚 **Available Templates** (${allTemplates.length} total)\n\n` +
      `**Characters**:\n` +
      `• Warrior Character\n` +
      `• Mage Character\n` +
      `• Enemy Minion\n\n` +
      `**Combat**:\n` +
      `• Damage Calculator\n` +
      `• Combat Manager\n\n` +
      `**Abilities**:\n` +
      `• Simple Ability\n` +
      `• Projectile Ability\n\n` +
      `**Inventory**:\n` +
      `• Inventory System\n\n` +
      `Ask me to generate any of these templates, or create a custom blueprint!`
    );

    return response;
  }

  /**
   * Handle questions
   */
  private handleQuestion(userMessage: string): ChatMessage {
    const responses: Record<string, string> = {
      'what can you do': 'I can help you create UE5 blueprints! Ask me to create characters, systems, abilities, items, quests, and UI elements.',
      'how do i create': 'Just describe what you want! For example: "Create a fire wizard character" or "Make a combat system with health and mana".',
      'what is a blueprint': 'A Blueprint is a UE5 visual scripting system for creating game logic without C++.',
    };

    let response = responses['what can you do'];
    for (const [key, value] of Object.entries(responses)) {
      if (userMessage.toLowerCase().includes(key)) {
        response = value;
        break;
      }
    }

    return this.createAssistantMessage(response);
  }

  /**
   * Handle help request
   */
  private handleHelp(userMessage: string): ChatMessage {
    return this.createAssistantMessage(
      `🎯 **How to Use Blueprint AI**:\n\n` +
      `1. **Describe your needs**: "Create a combat system with damage calculation"\n` +
      `2. **Specify details**: "Add health, mana, and attack power variables"\n` +
      `3. **Request modifications**: "Add a cooldown system to abilities"\n` +
      `4. **Export your work**: "Export as JSON"\n\n` +
      `**Quick Examples**:\n` +
      `• "Create a sword attack ability"\n` +
      `• "Build an inventory with slots and weight"\n` +
      `• "Make a quest system with objectives"\n` +
      `• "Design a health bar UI widget"\n\n` +
      `What would you like to create?`
    );
  }

  /**
   * Handle general query
   */
  private handleGeneralQuery(userMessage: string): ChatMessage {
    return this.createAssistantMessage(
      `I understand you want to know about: "${userMessage}"\n\n` +
      `I specialize in creating UE5 blueprints. Try asking me to:\n` +
      `• Create a specific type of character\n` +
      `• Build a game system\n` +
      `• Design an ability or item\n` +
      `• Generate a complete blueprint structure\n\n` +
      `What blueprint would you like me to create?`
    );
  }

  /**
   * Parse requirements from user message
   */
  private parseRequirements(message: string) {
    const name = this.extractName(message) || 'GeneratedBlueprint';
    const type = this.extractBlueprintType(message);

    const variables: string[] = [];
    const functions: string[] = [];

    // Extract variable names
    const varPattern = /(?:has|with|store|track|keep)\s+(\w+)/gi;
    let match;
    while ((match = varPattern.exec(message)) !== null) {
      variables.push(match[1]);
    }

    // Extract function names
    const funcPattern = /(?:can|able to|do|perform|execute)\s+(\w+)/gi;
    while ((match = funcPattern.exec(message)) !== null) {
      functions.push(match[1]);
    }

    return {
      name: `BP_${name}`,
      baseClass: 'Actor',
      type: type,
      category: 'Generated',
      tags: ['Generated', 'AI'],
      variables,
      functions,
    };
  }

  /**
   * Extract character type from message
   */
  private extractCharacterType(message: string): string {
    const types = ['warrior', 'mage', 'rogue', 'paladin', 'archer', 'cleric', 'knight'];
    for (const type of types) {
      if (message.toLowerCase().includes(type)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    return 'Character';
  }

  /**
   * Extract system type from message
   */
  private extractSystemType(message: string): string {
    const systems = [
      'combat',
      'inventory',
      'quest',
      'experience',
      'dialogue',
      'save',
      'economy',
      'party',
      'npc',
    ];
    for (const sys of systems) {
      if (message.toLowerCase().includes(sys)) {
        return sys.charAt(0).toUpperCase() + sys.slice(1);
      }
    }
    return 'Game';
  }

  /**
   * Extract ability type from message
   */
  private extractAbilityType(message: string): string {
    const types = ['fire', 'ice', 'lightning', 'heal', 'melee', 'ranged', 'magic'];
    for (const type of types) {
      if (message.toLowerCase().includes(type)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    return 'Default';
  }

  /**
   * Extract blueprint type from message
   */
  private extractBlueprintType(message: string): BlueprintType {
    if (message.toLowerCase().includes('character')) return BlueprintType.Character;
    if (message.toLowerCase().includes('widget')) return BlueprintType.Widget;
    if (message.toLowerCase().includes('interface')) return BlueprintType.Interface;
    if (message.toLowerCase().includes('component')) return BlueprintType.Component;
    return BlueprintType.Actor;
  }

  /**
   * Extract name from message
   */
  private extractName(message: string): string | null {
    const namePatterns = [
      /(?:called|named|name|create|make)\s+"?([A-Za-z0-9_]+)"?/i,
      /(?:for)\s+([A-Za-z0-9_]+)\s+(?:system|character|ability)/i,
    ];

    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get system configuration based on type
   */
  private getSystemConfig(systemType: string) {
    const configs: Record<
      string,
      {
        variables: BlueprintVariable[];
        functions: BlueprintFunction[];
        features: string[];
      }
    > = {
      Combat: {
        variables: [
          blueprintGenerator.generateVariable('Health', PinType.Float, {
            defaultValue: 100,
            category: 'Stats',
          }),
          blueprintGenerator.generateVariable('MaxHealth', PinType.Float, {
            defaultValue: 100,
            category: 'Stats',
          }),
          blueprintGenerator.generateVariable('AttackPower', PinType.Float, {
            defaultValue: 10,
            category: 'Combat',
          }),
        ],
        functions: [
          blueprintGenerator.generateFunction('TakeDamage', {
            category: 'Combat',
            inputs: [{ id: '', name: 'Damage', type: PinType.Float, direction: 'Input' }],
          }),
          blueprintGenerator.generateFunction('Attack', {
            category: 'Combat',
            inputs: [{ id: '', name: 'Target', type: PinType.Object, direction: 'Input' }],
          }),
        ],
        features: ['Health tracking', 'Damage calculation', 'Attack execution'],
      },
      Inventory: {
        variables: [
          blueprintGenerator.generateVariable('MaxSlots', PinType.Int, {
            defaultValue: 20,
            category: 'Inventory',
          }),
          blueprintGenerator.generateVariable('CurrentWeight', PinType.Float, {
            defaultValue: 0,
            category: 'Inventory',
          }),
        ],
        functions: [
          blueprintGenerator.generateFunction('AddItem', {
            category: 'Inventory',
            inputs: [
              { id: '', name: 'ItemID', type: PinType.String, direction: 'Input' },
            ],
          }),
          blueprintGenerator.generateFunction('RemoveItem', {
            category: 'Inventory',
            inputs: [
              { id: '', name: 'ItemID', type: PinType.String, direction: 'Input' },
            ],
          }),
        ],
        features: ['Item storage', 'Weight management', 'Slot system'],
      },
    };

    return (
      configs[systemType] || {
        variables: [
          blueprintGenerator.generateVariable('IsActive', PinType.Bool, {
            defaultValue: true,
          }),
        ],
        functions: [
          blueprintGenerator.generateFunction('Initialize', { category: 'System' }),
          blueprintGenerator.generateFunction('Update', { category: 'System' }),
        ],
        features: ['System initialized', 'Basic structure created'],
      }
    );
  }

  /**
   * Create user message
   */
  private createUserMessage(content: string): ChatMessage {
    return {
      id: this.generateId('msg'),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
  }

  /**
   * Create assistant message
   */
  private createAssistantMessage(content: string): ChatMessage {
    return {
      id: this.generateId('msg'),
      role: 'assistant',
      content,
      timestamp: Date.now(),
    };
  }

  /**
   * Get current conversation
   */
  getCurrentConversation(): ChatConversation | null {
    if (!this.currentConversationId) return null;
    return this.conversations.get(this.currentConversationId) || null;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ChatMessage[] {
    const conversation = this.getCurrentConversation();
    return conversation?.messages || [];
  }

  /**
   * Get generated blueprints
   */
  getGeneratedBlueprints(): BlueprintClass[] {
    const conversation = this.getCurrentConversation();
    return conversation?.blueprints || [];
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear conversation
   */
  clearConversation(): void {
    if (this.currentConversationId) {
      this.conversations.delete(this.currentConversationId);
      this.currentConversationId = null;
    }
  }
}

export const aiBlueprintChat = new AIBlueprintChat();
