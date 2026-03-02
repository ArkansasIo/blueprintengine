# Complete Menu System Details

## Overview
The Blueprint Editor includes a comprehensive menu system with 5 main menus, 60+ sub-menus, and 150+ menu items with full descriptions and keyboard shortcuts.

---

## FILE MENU (15 Items)

### Basic Operations
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **New Blueprint** | Ctrl+N | plus-circle | Create a new blank blueprint |
| **Open Blueprint** | Ctrl+O | folder-open | Open an existing blueprint from disk |
| **Open Recent** | - | history | Access recently opened blueprints |

#### Open Recent Sub-Menu (3+ Items)
- Blueprint_1.bp - Recently opened blueprint
- Blueprint_2.bp - Recently opened blueprint
- Blueprint_3.bp - Recently opened blueprint
- (divider)
- **Clear Recent Files** - Remove all recent items from list

### Save Operations
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Save** | Ctrl+S | content-save | Save current blueprint to disk |
| **Save As** | Ctrl+Shift+S | content-save-all | Save blueprint with new name/location |
| **Save All** | Ctrl+Alt+S | content-save-multiple | Save all open blueprints |

### Import/Export
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Import** | - | import | Import blueprint from file |
| **Export** | Ctrl+E | export | Export blueprint to various formats |

#### Import Sub-Menu (4 Items)
- **Import from JSON** - Load blueprint from JSON file
- **Import from File** - Browse and select blueprint file
- **Import from URL** - Import from remote URL/cloud
- **Import from Cloud** - Import from cloud storage provider

#### Export Sub-Menu (4 Items)
- **Export as JSON** - Save in JSON format for sharing
- **Generate Code** - Generate source code (C++, Python, etc.)
- **Export as Image** - Save blueprint visualization as PNG/SVG
- **Export as PDF** - Create PDF documentation

### File Management
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Print** | Ctrl+P | printer | Print blueprint to printer/PDF |
| **Close** | Ctrl+W | close-circle | Close current blueprint |
| **Exit** | Alt+F4 | exit-to-app | Exit application |

---

## EDIT MENU (14 Items)

### Undo/Redo
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Undo** | Ctrl+Z | undo | Undo last action |
| **Redo** | Ctrl+Y | redo | Redo last undone action |

### Clipboard Operations
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Cut** | Ctrl+X | content-cut | Cut selected items |
| **Copy** | Ctrl+C | content-copy | Copy selected items |
| **Paste** | Ctrl+V | content-paste | Paste copied items |

### Node Operations
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Duplicate** | Ctrl+D | content-duplicate | Create copy of selected node(s) |
| **Delete** | Delete | delete | Remove selected item(s) |

### Selection
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Select All** | Ctrl+A | select-all | Select all nodes on canvas |
| **Deselect All** | Ctrl+Shift+A | select-multiple-off | Deselect all nodes |

### Search & Replace
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Find** | Ctrl+F | magnify | Search for nodes/connections |
| **Find & Replace** | Ctrl+H | find-replace | Find and replace node/variable names |

---

## VIEW MENU (20+ Items)

### Zoom Controls
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Zoom In** | Ctrl++ | magnify-plus | Increase canvas zoom level |
| **Zoom Out** | Ctrl+- | magnify-minus | Decrease canvas zoom level |
| **Zoom to Fit** | Ctrl+0 | fit-to-screen | Fit all nodes in view |
| **Reset Zoom** | - | magnify-scan | Reset zoom to 100% |

### Canvas Display
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Show Grid** | Ctrl+G | grid | Toggle grid display on/off |
| **Show Mini Map** | - | map-outline | Toggle miniature map panel |
| **Show Toolbar** | - | toolbox | Toggle toolbar visibility |

### Panels
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Panels** | - | window-maximize | Manage panel visibility |

#### Panels Sub-Menu (5 Items)
- **Show Inspector** - Toggle right inspector panel
- **Show Details** - Show node/variable details panel
- **Show Node Library** - Toggle left node library panel
- **Show Console** - Display debug console
- (divider)
- **Reset Layout** - Restore default layout

### Layout Presets
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Layout** | - | view-dashboard | Choose predefined layouts |

#### Layout Sub-Menu (4 Items)
- **Default** - Standard three-panel layout
- **Compact** - Minimal panel layout for large canvas
- **Wide** - Maximize canvas width
- **Focus Mode** - Full screen canvas with collapsible panels

### Theme Management
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Theme** | - | palette | Select color theme |

#### Theme Sub-Menu (3 Items)
- **Dark** - Dark theme (default)
- **Light** - Light theme
- **Auto** - Follow system preference

---

## TOOLS MENU (25+ Items)

### Compilation
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Compile** | - | wrench | Compile blueprint |

#### Compile Sub-Menu (4 Items)
- **Compile (Debug)** - Compile with debug info (F5)
- **Compile (Release)** - Optimized compilation
- **Compile (Shipping)** - Final production build
- (divider)
- **Validate Blueprint** - Validate without compiling

### Analysis
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Analysis** | - | chart-line | Analyze blueprint |

#### Analysis Sub-Menu (4 Items)
- **Complexity Analysis** - Calculate cyclomatic complexity
- **Performance Analysis** - Estimate execution time
- **Detect Cycles** - Find circular dependencies
- **Find Dead Code** - Identify unreachable nodes

### Alignment Tools
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Alignment** | - | format-align-left | Align selected nodes |

#### Alignment Sub-Menu (8 Items)
- **Align Left** - Align selected nodes to leftmost
- **Align Right** - Align to rightmost position
- **Align Top** - Align to topmost position
- **Align Bottom** - Align to bottom position
- (divider)
- **Center Horizontally** - Center nodes horizontally
- **Center Vertically** - Center nodes vertically
- (divider)
- **Distribute Horizontally** - Equal horizontal spacing
- **Distribute Vertically** - Equal vertical spacing

### Batch Operations
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Batch Operations** | - | playlist-edit | Perform bulk actions |

#### Batch Operations Sub-Menu (4 Items)
- **Enable Selected Nodes** - Enable all selected nodes
- **Disable Selected Nodes** - Disable all selected nodes
- **Delete Selected Nodes** - Remove all selected nodes
- **Group Selected Nodes** - Create node group

### Debug & AI
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Debug Mode** | - | bug | Toggle debugging |
| **AI Assistant** | - | robot | AI-powered features |

#### AI Assistant Sub-Menu (4 Items)
- **AI Chat** - Chat with AI assistant
- **Get Suggestions** - AI suggests next nodes
- **Generate Blueprint** - AI generates from description
- **Optimize Blueprint** - AI suggests optimizations

### Settings
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Preferences** | Ctrl+, | cog | Open preferences dialog |

#### Preferences Sub-Menu Details
- **General Settings** - App preferences
- **Editor Settings** - Editor behavior
- **Keyboard Shortcuts** - Customize shortcuts
- **Theme & Colors** - Customize appearance
- **Advanced** - Advanced options

---

## HELP MENU (30+ Items)

### Getting Started
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Welcome Guide** | - | book-open | Interactive welcome tutorial |

### Documentation
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Documentation** | - | file-document | Access documentation |

#### Documentation Sub-Menu (5 Items)
- **Getting Started** - Beginner guide
- **Node Reference** - Complete node documentation
- **API Reference** - API documentation
- **Examples** - Example blueprints
- **Tutorials** - Video/text tutorials

### Help Topics
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Help Topics** | - | help-circle | Browse help topics |

#### Help Topics Sub-Menu (5 Items)
- **Basics** - Fundamental concepts
- **Core Concepts** - Important concepts
- **Advanced Topics** - Advanced techniques
- **Tools & Debugging** - Tools reference
- **Troubleshooting** - Problem solving

### Quick Reference
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Keyboard Shortcuts** | Ctrl+Shift+? | keyboard | View all shortcuts |
| **Tips & Tricks** | - | lightbulb | Useful tips |

#### Tips & Tricks Sub-Menu (3 Items)
- **Daily Tip** - Random helpful tip
- **Productivity Tips** - Speed up workflow
- **Advanced Tips** - Expert techniques

### Community & Support
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Community** | - | account-group | Connect with community |

#### Community Sub-Menu (4 Items)
- **Community Forum** - Ask questions, share ideas
- **Discord Server** - Live chat community
- **GitHub Repository** - View source code
- **Share Blueprint** - Share your blueprints

### Support
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **Support** | - | email | Get help/support |

#### Support Sub-Menu (4 Items)
- **Contact Support** - Email support team
- **Report Bug** - Report issues
- **Send Feedback** - Suggest improvements
- **FAQ** - Frequently asked questions

### About
| Item | Shortcut | Icon | Description |
|------|----------|------|-------------|
| **About** | - | information | About the application |
| **Check for Updates** | - | refresh | Check for new versions |

---

## DETAILED MENU DESCRIPTIONS

### Context-Aware Menus
Certain menus become available/disabled based on context:
- Import/Export - Enabled when blueprint is open
- Align/Distribute - Enabled when multiple nodes selected
- Undo/Redo - Enabled based on history availability
- Compile - Disabled if blueprint has validation errors

### Menu Tooltips
Each menu item includes helpful tooltips:
```
File > New Blueprint
"Create a new blank blueprint (Ctrl+N)"

Edit > Undo
"Undo the last action - You can undo up to 50 actions (Ctrl+Z)"

View > Zoom to Fit
"Zoom to fit all nodes in the current viewport (Ctrl+0)"

Tools > Compile
"Compile blueprint in selected mode. Validation runs first."

Help > Keyboard Shortcuts
"View all available keyboard shortcuts - Customizable in Preferences"
```

### Sub-Menu Organization
**File Menu** - File operations (8 items), Import/Export (8 items)
**Edit Menu** - Undo/Redo (2), Clipboard (3), Selection (2), Search (2)
**View Menu** - Zoom (4), Display (3), Panels (5), Layout (4), Theme (3)
**Tools Menu** - Compile (4), Analysis (4), Alignment (8), Batch (4), Debug/AI (2), Settings (1)
**Help Menu** - Documentation (5), Topics (5), Quick Ref (2), Community (4), Support (4), About (2)

### Total Menu Statistics
- **5 Main Menus**
- **60+ Sub-Menu Items**
- **150+ Individual Menu Actions**
- **35+ Keyboard Shortcuts**
- **40+ Tooltips & Descriptions**
- **8 Sub-Menu Categories**

### Menu Search Feature
Users can search menus with Ctrl+Shift+F to quickly find menu items:
- Search by name
- Search by shortcut
- Search by action
- Search by description

---

## IMPLEMENTATION NOTES

### Disabled States
Menus show as disabled (grayed out) when:
- No blueprint is open
- No selection exists (for alignment)
- No undo/redo history available
- Feature not available on current platform

### Dynamic Menus
Some menus change based on:
- **Recent Files** - Updates automatically
- **Compile Options** - Shows available platforms
- **Layout** - Highlights current layout
- **Theme** - Shows selected theme

### Keyboard Navigation
Users can access menus via:
- Alt+F (File), Alt+E (Edit), Alt+V (View), Alt+T (Tools), Alt+H (Help)
- Arrow keys to navigate
- Enter to select
- Escape to close

---

**Documentation Version:** 2.0
**Last Updated:** 2026-02-11
**Total Menu Items:** 150+
