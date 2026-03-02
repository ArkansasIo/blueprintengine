/**
 * Help Content
 * Comprehensive help documentation and guides
 */

export interface HelpTopic {
  id: string;
  title: string;
  category: string;
  content: string;
  examples?: string[];
  relatedTopics?: string[];
  icon: string;
}

export interface HelpCategory {
  name: string;
  topics: HelpTopic[];
}

export const HELP_TOPICS: Record<string, HelpTopic> = {
  // Getting Started
  getting_started: {
    id: 'getting_started',
    title: 'Getting Started',
    category: 'Basics',
    icon: 'rocket',
    content: `Welcome to UE5 Blueprint Visual Editor!

This guide will help you get started with creating blueprints.

## What is a Blueprint?
A blueprint is a visual script that defines the behavior and properties of an object or system. It uses a node-based system to create logic visually.

## Creating Your First Blueprint
1. Go to File > New Blueprint
2. Give your blueprint a name
3. Start adding nodes from the Node Library
4. Connect nodes together to create logic
5. Test and compile your blueprint

## Key Concepts
- **Nodes**: Building blocks of your blueprint logic
- **Pins**: Connection points on nodes (inputs/outputs)
- **Edges**: Connections between pins
- **Variables**: Store data in your blueprint
- **Functions**: Reusable logic blocks
- **Events**: Triggered actions`,
    examples: [
      'Create a simple Branch node logic',
      'Connect math operations',
      'Add variables to your blueprint',
    ],
    relatedTopics: ['nodes_101', 'working_with_nodes'],
  },

  nodes_101: {
    id: 'nodes_101',
    title: 'Understanding Nodes',
    category: 'Basics',
    icon: 'cube',
    content: `## What are Nodes?
Nodes are the fundamental building blocks of blueprints. Each node performs a specific function or operation.

## Node Types
- **Control Flow**: Branch, Sequence, Switch (decide logic paths)
- **Data**: Get/Set Variables, Get/Set Properties
- **Math**: Add, Subtract, Multiply, Divide operations
- **Logic**: And, Or, Not, comparisons
- **String**: Text manipulation
- **Array**: Array operations
- **Events**: Triggered events and dispatchers

## Node Structure
Each node has:
- **Execution Pins** (white): Flow of execution
- **Data Pins** (colored): Values passed between nodes
- **Properties**: Node configuration options

## Creating Nodes
1. Right-click on canvas to open Node Library
2. Search for desired node
3. Click to place on canvas
4. Connect pins to other nodes`,
    examples: [
      'Place a Branch node',
      'Connect a condition pin',
      'Set node properties',
    ],
    relatedTopics: ['connections', 'node_properties'],
  },

  connections: {
    id: 'connections',
    title: 'Creating Connections',
    category: 'Basics',
    icon: 'connection',
    content: `## How to Connect Nodes
Connections allow data and execution flow between nodes.

## Types of Connections
1. **Execution Pins** (White): Control program flow
2. **Data Pins** (Colored): Pass values between nodes
3. **Array Pins**: Handle array data

## Creating a Connection
1. Click and drag from output pin
2. Drag to target input pin
3. Release to create connection
4. Green checkmark = valid connection
5. Red X = invalid connection

## Connection Rules
- Pins must be compatible types
- Can't connect output to output
- Can't connect input to input
- Each pin can have multiple connections

## Removing Connections
- Right-click connection and select Delete
- Or select and press Delete key`,
    examples: [
      'Connect two math nodes',
      'Create a branch condition',
      'Chain multiple functions',
    ],
    relatedTopics: ['nodes_101', 'working_with_nodes'],
  },

  variables: {
    id: 'variables',
    title: 'Working with Variables',
    category: 'Core Concepts',
    icon: 'variable-box',
    content: `## What are Variables?
Variables store data that your blueprint can use and modify during execution.

## Variable Types
- **Bool**: True/False values
- **Int**: Whole numbers (-2147483648 to 2147483647)
- **Float**: Decimal numbers
- **String**: Text data
- **Object**: References to objects
- **Custom**: User-defined types

## Variable Scopes
1. **Local**: Only available in current function
2. **Instance**: Available throughout the blueprint
3. **Blueprint**: Shared across all instances
4. **Global**: Available everywhere

## Creating Variables
1. Click '+' in Variables panel
2. Set name and type
3. Configure scope
4. Set default value
5. Click confirm

## Using Variables
- Use 'Get Variable' node to read value
- Use 'Set Variable' node to change value
- Access in Variables Inspector panel`,
    examples: [
      'Create Health variable',
      'Create IsAlive boolean',
      'Set variable with default value',
    ],
    relatedTopics: ['getting_started', 'node_properties'],
  },

  functions: {
    id: 'functions',
    title: 'Creating Functions',
    category: 'Core Concepts',
    icon: 'function',
    content: `## What are Functions?
Functions are reusable blocks of logic that can be called multiple times.

## Function Features
- Inputs: Data passed to function
- Outputs: Data returned from function
- Return Type: What the function returns
- Local Variables: Only available in function

## Creating a Function
1. Click '+' in Functions panel
2. Enter function name
3. Set inputs/outputs
4. Design function logic
5. Test and compile

## Function Types
- **Regular**: Standard function
- **Pure**: No side effects, always same output
- **Event**: Triggered by specific condition
- **Override**: Overrides parent class function

## Calling Functions
1. Drag function from Functions panel
2. Drop on canvas to create Call node
3. Connect inputs
4. Connect execution pins`,
    examples: [
      'Create TakeDamage function',
      'Add function parameters',
      'Return calculated value',
    ],
    relatedTopics: ['events', 'node_properties'],
  },

  events: {
    id: 'events',
    title: 'Understanding Events',
    category: 'Core Concepts',
    icon: 'bell',
    content: `## What are Events?
Events are triggered at specific times during execution and can launch chains of logic.

## Built-in Events
- **Event Begin Play**: When object spawns
- **Event End Play**: When object is destroyed
- **Event Tick**: Every frame
- **Custom Events**: User-defined events

## Creating Custom Events
1. Click '+' in Events panel
2. Name your event
3. Define outputs
4. Design event logic
5. Call with 'Event Dispatcher' node

## Event Handling
Events help organize code by response:
- Initialization (Begin Play)
- Cleanup (End Play)
- Frame updates (Tick)
- User input
- Collisions

## Best Practices
- Use events for major state changes
- Keep event logic organized
- Comment event purposes
- Test event triggers`,
    examples: [
      'Create OnDeath event',
      'Call custom event',
      'Handle Begin Play',
    ],
    relatedTopics: ['functions', 'connections'],
  },

  debugging: {
    id: 'debugging',
    title: 'Debugging Your Blueprint',
    category: 'Tools',
    icon: 'bug',
    content: `## Debugging Tools

### Breakpoints
- Set breakpoint on any node
- Execution pauses when reached
- Inspect variables at that point
- Step through execution

### Debug Console
- View execution logs
- Print debug messages
- Check variable values
- Monitor performance

### Execution Visualizer
- Watch nodes execute in real-time
- See data flow between nodes
- Identify bottlenecks
- Trace execution path

## Common Issues
1. **Connection Invalid**: Check pin types match
2. **Unconnected Pins**: Ensure all required pins connected
3. **Performance Slow**: Check for infinite loops
4. **Logic Incorrect**: Use breakpoints to trace
5. **Compilation Failed**: Check error messages

## Debugging Process
1. Enable Debug Mode
2. Set breakpoints
3. Run blueprint
4. Watch execution
5. Inspect variables
6. Fix issues`,
    examples: [
      'Set breakpoint on node',
      'Watch execution flow',
      'Inspect variable values',
    ],
    relatedTopics: ['compile_and_validate', 'performance'],
  },

  compile_and_validate: {
    id: 'compile_and_validate',
    title: 'Compiling and Validating',
    category: 'Tools',
    icon: 'check-circle',
    content: `## Compilation
Compilation converts your visual blueprint into executable code.

### Compile Modes
- **Debug**: Include debug info, slower
- **Release**: Optimized, faster
- **Shipping**: Final production build
- **Validation**: Check errors without compiling

### Compilation Steps
1. Click File > Compile
2. Check compilation panel
3. Review errors/warnings
4. Fix any issues
5. Recompile

### Common Errors
- **Unresolved References**: Variable/function not found
- **Type Mismatch**: Pin types don't match
- **Circular Dependency**: Nodes reference each other
- **Dead Code**: Unreachable nodes

## Validation
Validates blueprint structure:
- No circular connections
- All pins connected properly
- Type compatibility
- Performance issues

## Best Practices
- Compile frequently
- Fix warnings early
- Use Validation before compile
- Check error messages carefully`,
    examples: [
      'Compile in Debug mode',
      'View compilation errors',
      'Run validation check',
    ],
    relatedTopics: ['debugging', 'performance'],
  },

  keyboard_shortcuts: {
    id: 'keyboard_shortcuts',
    title: 'Keyboard Shortcuts',
    category: 'Productivity',
    icon: 'keyboard',
    content: `## Essential Shortcuts

### File Operations
- Ctrl+N: New Blueprint
- Ctrl+O: Open
- Ctrl+S: Save
- Ctrl+E: Export
- Ctrl+I: Import

### Editing
- Ctrl+Z: Undo
- Ctrl+Y: Redo
- Ctrl+X: Cut
- Ctrl+C: Copy
- Ctrl+V: Paste
- Ctrl+D: Duplicate
- Delete: Delete selection

### Canvas
- Ctrl++: Zoom In
- Ctrl+-: Zoom Out
- Ctrl+0: Zoom to Fit
- Space: Pan canvas
- Mouse wheel: Scroll

### Tools
- F5: Compile
- Ctrl+F: Search
- Ctrl+H: Find & Replace
- Ctrl+,: Preferences
- Ctrl+Shift+?: Show all shortcuts

## Custom Shortcuts
- Go to Preferences > Keyboard
- Assign custom shortcuts
- Import/export configurations`,
    examples: [
      'Save with Ctrl+S',
      'Undo with Ctrl+Z',
      'Compile with F5',
    ],
    relatedTopics: [],
  },

  node_library: {
    id: 'node_library',
    title: 'Node Library',
    category: 'Reference',
    icon: 'library-shelves',
    content: `## Accessing the Node Library
Right-click on canvas or use Node Library panel to browse available nodes.

## Node Categories
- **Control Flow**: Logic flow control (5 nodes)
- **Data**: Variable/property access (4 nodes)
- **Events**: Event handling (4 nodes)
- **Functions**: Function operations (3 nodes)
- **Math**: Mathematical operations (5 nodes)
- **Logic**: Boolean logic (7 nodes)
- **String**: Text operations (4 nodes)
- **Array**: Array operations (5 nodes)
- **Cast**: Type conversion (3 nodes)

## Searching Nodes
1. Type node name in search
2. Filter by category
3. View node details
4. Click to add to canvas

## Favorite Nodes
- Right-click node > Add to Favorites
- Quick access to frequently used nodes
- Organized in Favorites category

## Node Details
Each node shows:
- Input/output pins
- Default parameters
- Description
- Usage example`,
    examples: [
      'Search for Branch node',
      'Filter by Math category',
      'Add favorite node',
    ],
    relatedTopics: ['nodes_101', 'working_with_nodes'],
  },

  performance: {
    id: 'performance',
    title: 'Performance Optimization',
    category: 'Advanced',
    icon: 'speedometer',
    content: `## Performance Monitoring
Use Performance Monitor to track:
- FPS (Frames Per Second)
- Memory usage
- Execution time
- Node complexity

## Optimization Tips
1. **Reduce Node Count**: Combine simple operations
2. **Use Pure Functions**: Faster execution
3. **Cache Results**: Store computed values
4. **Avoid Loops**: Use array operations instead
5. **Profile Code**: Find bottlenecks
6. **Lazy Loading**: Only compute when needed

## Performance Metrics
- **Execution Time**: How long blueprint takes
- **Memory**: RAM used by blueprint
- **Complexity**: Blueprint intricacy score
- **Nesting Level**: Deepest node nesting

## Performance Analysis
1. Open Performance Monitor
2. Run blueprint
3. Check metrics
4. Identify bottlenecks
5. Optimize
6. Retest

## Best Practices
- Keep blueprints modular
- Split complex logic
- Use events efficiently
- Document performance-critical code`,
    examples: [
      'Check execution time',
      'Monitor memory usage',
      'Find slowest nodes',
    ],
    relatedTopics: ['debugging', 'compile_and_validate'],
  },

  version_control: {
    id: 'version_control',
    title: 'Version Control',
    category: 'Advanced',
    icon: 'git-branch',
    content: `## Version Control Features
Save and restore different versions of your blueprint.

## Creating Snapshots
1. Make changes to blueprint
2. Click Version Control panel
3. Enter snapshot message
4. Click Create Snapshot
5. Version saved with timestamp

## Managing Versions
- View version history
- Compare versions (diff view)
- Restore to previous version
- Delete old versions
- Tag important versions

## Snapshot Information
Each snapshot stores:
- Complete blueprint state
- Timestamp
- Author
- Description message
- All nodes, edges, variables

## Restoring Versions
1. Open Version Control panel
2. Select desired version
3. Click Restore
4. Confirm action
5. Blueprint restored

## Best Practices
- Create snapshot before major changes
- Use descriptive messages
- Clean up old versions
- Regular backups`,
    examples: [
      'Create snapshot',
      'View version history',
      'Restore previous version',
    ],
    relatedTopics: [],
  },

  working_with_nodes: {
    id: 'working_with_nodes',
    title: 'Advanced Node Techniques',
    category: 'Advanced',
    icon: 'cube-scan',
    content: `## Node Selection
- Click to select single node
- Drag to multi-select
- Ctrl+Click to add to selection
- Ctrl+A to select all

## Node Operations
- **Move**: Drag node around canvas
- **Resize**: Drag corner handles
- **Collapse**: Hide node content
- **Delete**: Select and press Delete
- **Duplicate**: Ctrl+D or right-click

## Node Grouping
- Select multiple nodes
- Right-click > Group Nodes
- Name the group
- Collapse/expand group
- Move group together

## Node Properties
- Select node
- Edit in Details panel
- Change display name
- Set default values
- Add comments

## Advanced Features
- Node search and replace
- Bulk property editing
- Template nodes
- Custom node creation

## Organization Tips
- Use meaningful names
- Group related nodes
- Add comments
- Use colors to categorize
- Align nodes neatly`,
    examples: [
      'Select multiple nodes',
      'Group related nodes',
      'Edit node properties',
    ],
    relatedTopics: ['nodes_101', 'connections'],
  },

  blueprint_sharing: {
    id: 'blueprint_sharing',
    title: 'Sharing Blueprints',
    category: 'Collaboration',
    icon: 'share-2',
    content: `## Exporting Blueprints
Share blueprints with others.

### Export Formats
- **JSON**: Human-readable format
- **Binary**: Compressed format
- **Source Code**: Generate code

### Export Steps
1. Open blueprint
2. File > Export
3. Choose format
4. Set filename
5. Save to location

## Importing Blueprints
Load blueprints from files.

### Import Steps
1. File > Import
2. Select blueprint file
3. Choose import location
4. Confirm
5. Blueprint loaded

## Sharing Options
- Email blueprint file
- Share via cloud storage
- Post to community
- Include dependencies

## Collaboration Features
- Comment on nodes
- Track changes
- Merge blueprints
- Resolve conflicts

## Best Practices
- Include documentation
- Test before sharing
- Document dependencies
- Provide examples`,
    examples: [
      'Export blueprint as JSON',
      'Import shared blueprint',
      'Add collaborator comments',
    ],
    relatedTopics: ['version_control'],
  },

  templates: {
    id: 'templates',
    title: 'Using Templates',
    category: 'Productivity',
    icon: 'layout-template',
    content: `## Blueprint Templates
Start from pre-built templates for common patterns.

## Available Templates
- **Character Blueprint**: Player/NPC character
- **Weapon Blueprint**: Weapon mechanics
- **Item Blueprint**: Collectible items
- **Trigger Blueprint**: Area triggers
- **State Machine**: State management
- **Event System**: Event handling

## Creating from Template
1. File > New from Template
2. Select template
3. Enter blueprint name
4. Configure template options
5. Click Create

## Template Structure
Templates include:
- Basic node setup
- Common variables
- Event handlers
- Example logic

## Custom Templates
Create your own templates:
1. Design blueprint
2. File > Save as Template
3. Name template
4. Reuse in future projects

## Template Library
Access all templates:
- File > Template Library
- Browse categories
- Preview templates
- Read descriptions

## Best Practices
- Customize templates
- Add your own templates
- Share templates with team
- Document template usage`,
    examples: [
      'Create from Character template',
      'Save as custom template',
      'Browse template library',
    ],
    relatedTopics: ['getting_started', 'working_with_nodes'],
  },

  ai_assistant: {
    id: 'ai_assistant',
    title: 'AI Assistant',
    category: 'AI Features',
    icon: 'robot',
    content: `## AI Blueprint Assistant
AI-powered help for blueprint creation.

## Features
- **Code Suggestions**: Get node suggestions
- **Blueprint Generation**: Generate from description
- **Optimization**: Suggest improvements
- **Bug Detection**: Find potential issues
- **Documentation**: Auto-generate docs

## Using AI Assistant
1. Open AI Chat panel
2. Describe what you want
3. AI suggests nodes/logic
4. Review suggestions
5. Apply to blueprint

## AI Suggestions
- Node recommendations
- Connection suggestions
- Performance tips
- Code improvements

## Example Prompts
- "Create damage system"
- "Add health management"
- "Optimize performance"
- "Fix compilation error"

## Tips
- Be specific in requests
- Review suggestions carefully
- Ask follow-up questions
- Report issues for improvement

## Privacy
- No data sent externally
- Local processing
- Your blueprints stay private`,
    examples: [
      'Ask for node suggestion',
      'Request optimization',
      'Generate blueprint',
    ],
    relatedTopics: [],
  },

  troubleshooting: {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    category: 'Help',
    icon: 'alert-circle',
    content: `## Common Problems & Solutions

### Compilation Errors
**Problem**: "Unresolved Reference"
- **Solution**: Check variable/function exists in list
- Verify spelling matches exactly
- Check variable scope

**Problem**: "Type Mismatch"
- **Solution**: Check pin types are compatible
- Use Cast node if needed
- Review connection

**Problem**: "Circular Dependency"
- **Solution**: Check for circular connections
- Break dependency loop
- Redesign logic flow

### Performance Issues
**Problem**: Blueprint runs slowly
- **Solution**: Check Performance Monitor
- Optimize expensive nodes
- Reduce node count
- Cache results

**Problem**: High memory usage
- **Solution**: Monitor memory panel
- Clear unused variables
- Optimize data structures
- Profile blueprint

### Connection Issues
**Problem**: Can't connect pins
- **Solution**: Check pin types match
- Verify pins are available
- Check direction (input/output)

**Problem**: Connection disappears
- **Solution**: May be invalid type
- Reconnect with correct type
- Check node wasn't deleted

### Blueprint Won't Save
**Problem**: Save fails
- **Solution**: Check disk space
- Verify file permissions
- Try Save As
- Restart application

## Getting Help
- Check Help menu
- Read documentation
- Search forums
- Contact support`,
    examples: [
      'Fix compilation error',
      'Resolve type mismatch',
      'Optimize performance',
    ],
    relatedTopics: ['debugging', 'compile_and_validate'],
  },
};

/**
 * Help Categories
 */
export const HELP_CATEGORIES: HelpCategory[] = [
  {
    name: 'Getting Started',
    topics: [
      HELP_TOPICS.getting_started,
      HELP_TOPICS.nodes_101,
      HELP_TOPICS.connections,
    ],
  },
  {
    name: 'Core Concepts',
    topics: [
      HELP_TOPICS.variables,
      HELP_TOPICS.functions,
      HELP_TOPICS.events,
    ],
  },
  {
    name: 'Tools & Debugging',
    topics: [
      HELP_TOPICS.debugging,
      HELP_TOPICS.compile_and_validate,
      HELP_TOPICS.performance,
    ],
  },
  {
    name: 'Productivity',
    topics: [
      HELP_TOPICS.keyboard_shortcuts,
      HELP_TOPICS.node_library,
      HELP_TOPICS.templates,
    ],
  },
  {
    name: 'Advanced',
    topics: [
      HELP_TOPICS.working_with_nodes,
      HELP_TOPICS.version_control,
      HELP_TOPICS.blueprint_sharing,
    ],
  },
  {
    name: 'AI & Help',
    topics: [
      HELP_TOPICS.ai_assistant,
      HELP_TOPICS.troubleshooting,
    ],
  },
];

/**
 * Quick Tips
 */
export const QUICK_TIPS = [
  'Press Ctrl+S to save your blueprint',
  'Right-click on canvas to add nodes',
  'Use Ctrl+Z to undo changes',
  'Compile frequently with F5',
  'Use breakpoints to debug issues',
  'Add comments to document your logic',
  'Group related nodes for organization',
  'Use variables to store data',
  'Create functions for reusable logic',
  'Monitor performance with the Performance Monitor',
  'Use templates to start projects faster',
  'Export blueprints to share with others',
];

/**
 * Keyboard Shortcuts Reference
 */
export const KEYBOARD_SHORTCUTS_HELP = {
  fileOperations: {
    title: 'File Operations',
    shortcuts: [
      { key: 'Ctrl+N', description: 'New Blueprint' },
      { key: 'Ctrl+O', description: 'Open Blueprint' },
      { key: 'Ctrl+S', description: 'Save Blueprint' },
      { key: 'Ctrl+Shift+S', description: 'Save As' },
      { key: 'Ctrl+E', description: 'Export Blueprint' },
      { key: 'Ctrl+I', description: 'Import Blueprint' },
    ],
  },
  editing: {
    title: 'Editing',
    shortcuts: [
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo' },
      { key: 'Ctrl+X', description: 'Cut' },
      { key: 'Ctrl+C', description: 'Copy' },
      { key: 'Ctrl+V', description: 'Paste' },
      { key: 'Ctrl+D', description: 'Duplicate' },
      { key: 'Delete', description: 'Delete' },
    ],
  },
  canvas: {
    title: 'Canvas',
    shortcuts: [
      { key: 'Ctrl++', description: 'Zoom In' },
      { key: 'Ctrl+-', description: 'Zoom Out' },
      { key: 'Ctrl+0', description: 'Zoom to Fit' },
      { key: 'Space + Drag', description: 'Pan Canvas' },
      { key: 'Mouse Wheel', description: 'Scroll' },
    ],
  },
  tools: {
    title: 'Tools',
    shortcuts: [
      { key: 'F5', description: 'Compile' },
      { key: 'Ctrl+F', description: 'Search' },
      { key: 'Ctrl+H', description: 'Find & Replace' },
      { key: 'Ctrl+,', description: 'Preferences' },
      { key: 'Ctrl+Shift+?', description: 'Show All Shortcuts' },
    ],
  },
};
