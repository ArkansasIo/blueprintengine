/**
 * Menu Options
 * Complete menu structure with all sub-menus, options, and details
 */

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action?: string;
  submenu?: MenuItem[];
  divider?: boolean;
  disabled?: boolean;
  tooltip?: string;
  description?: string;
  category?: string;
}

export interface MenuStructure {
  menus: Record<string, MenuItem[]>;
}

export const MENU_OPTIONS: MenuStructure = {
  menus: {
    // File Menu
    file: [
      {
        id: 'file_new',
        label: 'New Blueprint',
        icon: 'plus-circle',
        shortcut: 'Ctrl+N',
        action: 'createNewBlueprint',
      },
      {
        id: 'file_open',
        label: 'Open Blueprint',
        icon: 'folder-open',
        shortcut: 'Ctrl+O',
        action: 'openBlueprint',
      },
      {
        id: 'file_open_recent',
        label: 'Open Recent',
        icon: 'history',
        submenu: [
          {
            id: 'file_recent_1',
            label: 'Blueprint_1.bp',
            action: 'openRecentBlueprint',
          },
          {
            id: 'file_recent_2',
            label: 'Blueprint_2.bp',
            action: 'openRecentBlueprint',
          },
          {
            id: 'file_recent_3',
            label: 'Blueprint_3.bp',
            action: 'openRecentBlueprint',
          },
          { divider: true },
          {
            id: 'file_clear_recent',
            label: 'Clear Recent Files',
            action: 'clearRecentFiles',
          },
        ],
      },
      { divider: true },
      {
        id: 'file_save',
        label: 'Save',
        icon: 'content-save',
        shortcut: 'Ctrl+S',
        action: 'saveBlueprint',
      },
      {
        id: 'file_save_as',
        label: 'Save As...',
        icon: 'content-save-all',
        shortcut: 'Ctrl+Shift+S',
        action: 'saveBlueprintAs',
      },
      {
        id: 'file_save_all',
        label: 'Save All',
        icon: 'content-save-multiple',
        shortcut: 'Ctrl+Alt+S',
        action: 'saveAllBlueprints',
      },
      { divider: true },
      {
        id: 'file_import',
        label: 'Import',
        icon: 'import',
        submenu: [
          {
            id: 'file_import_json',
            label: 'Import from JSON',
            icon: 'code-json',
            action: 'importFromJSON',
          },
          {
            id: 'file_import_file',
            label: 'Import from File',
            icon: 'folder-upload',
            action: 'importFromFile',
          },
          {
            id: 'file_import_url',
            label: 'Import from URL',
            icon: 'link-variant',
            action: 'importFromURL',
          },
          {
            id: 'file_import_cloud',
            label: 'Import from Cloud',
            icon: 'cloud-download',
            action: 'importFromCloud',
          },
        ],
      },
      {
        id: 'file_export',
        label: 'Export',
        icon: 'export',
        submenu: [
          {
            id: 'file_export_json',
            label: 'Export as JSON',
            icon: 'code-json',
            shortcut: 'Ctrl+E',
            action: 'exportAsJSON',
          },
          {
            id: 'file_export_code',
            label: 'Generate Code',
            icon: 'code-braces',
            action: 'generateCode',
          },
          {
            id: 'file_export_image',
            label: 'Export as Image',
            icon: 'image',
            action: 'exportAsImage',
          },
          {
            id: 'file_export_pdf',
            label: 'Export as PDF',
            icon: 'file-pdf',
            action: 'exportAsPDF',
          },
        ],
      },
      { divider: true },
      {
        id: 'file_print',
        label: 'Print',
        icon: 'printer',
        shortcut: 'Ctrl+P',
        action: 'printBlueprint',
      },
      { divider: true },
      {
        id: 'file_close',
        label: 'Close',
        icon: 'close-circle',
        shortcut: 'Ctrl+W',
        action: 'closeBlueprint',
      },
      {
        id: 'file_exit',
        label: 'Exit',
        icon: 'exit-to-app',
        shortcut: 'Alt+F4',
        action: 'exitApplication',
      },
    ],

    // Edit Menu
    edit: [
      {
        id: 'edit_undo',
        label: 'Undo',
        icon: 'undo',
        shortcut: 'Ctrl+Z',
        action: 'undo',
      },
      {
        id: 'edit_redo',
        label: 'Redo',
        icon: 'redo',
        shortcut: 'Ctrl+Y',
        action: 'redo',
      },
      { divider: true },
      {
        id: 'edit_cut',
        label: 'Cut',
        icon: 'content-cut',
        shortcut: 'Ctrl+X',
        action: 'cut',
      },
      {
        id: 'edit_copy',
        label: 'Copy',
        icon: 'content-copy',
        shortcut: 'Ctrl+C',
        action: 'copy',
      },
      {
        id: 'edit_paste',
        label: 'Paste',
        icon: 'content-paste',
        shortcut: 'Ctrl+V',
        action: 'paste',
      },
      { divider: true },
      {
        id: 'edit_duplicate',
        label: 'Duplicate',
        icon: 'content-duplicate',
        shortcut: 'Ctrl+D',
        action: 'duplicate',
      },
      {
        id: 'edit_delete',
        label: 'Delete',
        icon: 'delete',
        shortcut: 'Delete',
        action: 'delete',
      },
      { divider: true },
      {
        id: 'edit_select_all',
        label: 'Select All',
        icon: 'select-all',
        shortcut: 'Ctrl+A',
        action: 'selectAll',
      },
      {
        id: 'edit_deselect_all',
        label: 'Deselect All',
        icon: 'select-multiple-off',
        shortcut: 'Ctrl+Shift+A',
        action: 'deselectAll',
      },
      { divider: true },
      {
        id: 'edit_find',
        label: 'Find',
        icon: 'magnify',
        shortcut: 'Ctrl+F',
        action: 'find',
      },
      {
        id: 'edit_replace',
        label: 'Find & Replace',
        icon: 'find-replace',
        shortcut: 'Ctrl+H',
        action: 'findReplace',
      },
    ],

    // View Menu
    view: [
      {
        id: 'view_zoom_in',
        label: 'Zoom In',
        icon: 'magnify-plus',
        shortcut: 'Ctrl++',
        action: 'zoomIn',
      },
      {
        id: 'view_zoom_out',
        label: 'Zoom Out',
        icon: 'magnify-minus',
        shortcut: 'Ctrl+-',
        action: 'zoomOut',
      },
      {
        id: 'view_zoom_fit',
        label: 'Zoom to Fit',
        icon: 'fit-to-screen',
        shortcut: 'Ctrl+0',
        action: 'zoomToFit',
      },
      {
        id: 'view_zoom_100',
        label: 'Reset Zoom',
        icon: 'magnify-scan',
        action: 'resetZoom',
      },
      { divider: true },
      {
        id: 'view_toggle_grid',
        label: 'Show Grid',
        icon: 'grid',
        shortcut: 'Ctrl+G',
        action: 'toggleGrid',
      },
      {
        id: 'view_toggle_minimap',
        label: 'Show Mini Map',
        icon: 'map-outline',
        action: 'toggleMiniMap',
      },
      {
        id: 'view_toggle_toolbar',
        label: 'Show Toolbar',
        icon: 'toolbox',
        action: 'toggleToolbar',
      },
      { divider: true },
      {
        id: 'view_panels',
        label: 'Panels',
        icon: 'window-maximize',
        submenu: [
          {
            id: 'view_panel_inspector',
            label: 'Show Inspector',
            action: 'toggleInspector',
          },
          {
            id: 'view_panel_details',
            label: 'Show Details',
            action: 'toggleDetails',
          },
          {
            id: 'view_panel_library',
            label: 'Show Node Library',
            action: 'toggleLibrary',
          },
          {
            id: 'view_panel_console',
            label: 'Show Console',
            action: 'toggleConsole',
          },
          { divider: true },
          {
            id: 'view_panel_reset',
            label: 'Reset Layout',
            action: 'resetLayout',
          },
        ],
      },
      {
        id: 'view_layout',
        label: 'Layout',
        icon: 'view-dashboard',
        submenu: [
          {
            id: 'view_layout_default',
            label: 'Default',
            action: 'setDefaultLayout',
          },
          {
            id: 'view_layout_compact',
            label: 'Compact',
            action: 'setCompactLayout',
          },
          {
            id: 'view_layout_wide',
            label: 'Wide',
            action: 'setWideLayout',
          },
          {
            id: 'view_layout_focus',
            label: 'Focus Mode',
            action: 'setFocusLayout',
          },
        ],
      },
      { divider: true },
      {
        id: 'view_theme',
        label: 'Theme',
        icon: 'palette',
        submenu: [
          {
            id: 'view_theme_dark',
            label: 'Dark',
            action: 'setDarkTheme',
          },
          {
            id: 'view_theme_light',
            label: 'Light',
            action: 'setLightTheme',
          },
          {
            id: 'view_theme_auto',
            label: 'Auto',
            action: 'setAutoTheme',
          },
        ],
      },
    ],

    // Tools Menu
    tools: [
      {
        id: 'tools_compile',
        label: 'Compile',
        icon: 'wrench',
        submenu: [
          {
            id: 'tools_compile_debug',
            label: 'Compile (Debug)',
            icon: 'debug',
            shortcut: 'F5',
            action: 'compileDebug',
          },
          {
            id: 'tools_compile_release',
            label: 'Compile (Release)',
            icon: 'package',
            action: 'compileRelease',
          },
          {
            id: 'tools_compile_shipping',
            label: 'Compile (Shipping)',
            icon: 'package-check',
            action: 'compileShipping',
          },
          { divider: true },
          {
            id: 'tools_validate',
            label: 'Validate Blueprint',
            icon: 'check-circle',
            action: 'validateBlueprint',
          },
        ],
      },
      {
        id: 'tools_analyze',
        label: 'Analysis',
        icon: 'chart-line',
        submenu: [
          {
            id: 'tools_analyze_complexity',
            label: 'Complexity Analysis',
            icon: 'function',
            action: 'analyzeComplexity',
          },
          {
            id: 'tools_analyze_performance',
            label: 'Performance Analysis',
            icon: 'speedometer',
            action: 'analyzePerformance',
          },
          {
            id: 'tools_analyze_cycles',
            label: 'Detect Cycles',
            icon: 'circle-multiple-outline',
            action: 'detectCycles',
          },
          {
            id: 'tools_analyze_deadcode',
            label: 'Find Dead Code',
            icon: 'skull',
            action: 'findDeadCode',
          },
        ],
      },
      {
        id: 'tools_align',
        label: 'Alignment',
        icon: 'format-align-left',
        submenu: [
          {
            id: 'tools_align_left',
            label: 'Align Left',
            action: 'alignLeft',
          },
          {
            id: 'tools_align_right',
            label: 'Align Right',
            action: 'alignRight',
          },
          {
            id: 'tools_align_top',
            label: 'Align Top',
            action: 'alignTop',
          },
          {
            id: 'tools_align_bottom',
            label: 'Align Bottom',
            action: 'alignBottom',
          },
          { divider: true },
          {
            id: 'tools_align_center_h',
            label: 'Center Horizontally',
            action: 'centerHorizontally',
          },
          {
            id: 'tools_align_center_v',
            label: 'Center Vertically',
            action: 'centerVertically',
          },
          { divider: true },
          {
            id: 'tools_align_distribute_h',
            label: 'Distribute Horizontally',
            action: 'distributeHorizontally',
          },
          {
            id: 'tools_align_distribute_v',
            label: 'Distribute Vertically',
            action: 'distributeVertically',
          },
        ],
      },
      {
        id: 'tools_batch',
        label: 'Batch Operations',
        icon: 'playlist-edit',
        submenu: [
          {
            id: 'tools_batch_enable',
            label: 'Enable Selected Nodes',
            action: 'batchEnable',
          },
          {
            id: 'tools_batch_disable',
            label: 'Disable Selected Nodes',
            action: 'batchDisable',
          },
          {
            id: 'tools_batch_delete',
            label: 'Delete Selected Nodes',
            action: 'batchDelete',
          },
          {
            id: 'tools_batch_group',
            label: 'Group Selected Nodes',
            action: 'batchGroup',
          },
        ],
      },
      { divider: true },
      {
        id: 'tools_debug',
        label: 'Debug Mode',
        icon: 'bug',
        action: 'toggleDebugMode',
      },
      {
        id: 'tools_ai',
        label: 'AI Assistant',
        icon: 'robot',
        submenu: [
          {
            id: 'tools_ai_chat',
            label: 'AI Chat',
            action: 'openAIChat',
          },
          {
            id: 'tools_ai_suggest',
            label: 'Get Suggestions',
            action: 'aiGetSuggestions',
          },
          {
            id: 'tools_ai_generate',
            label: 'Generate Blueprint',
            action: 'aiGenerateBlueprint',
          },
          {
            id: 'tools_ai_optimize',
            label: 'Optimize Blueprint',
            action: 'aiOptimizeBlueprint',
          },
        ],
      },
      { divider: true },
      {
        id: 'tools_preferences',
        label: 'Preferences',
        icon: 'cog',
        shortcut: 'Ctrl+,',
        action: 'openPreferences',
      },
    ],

    // Help Menu
    help: [
      {
        id: 'help_welcome',
        label: 'Welcome Guide',
        icon: 'book-open',
        action: 'openWelcomeGuide',
      },
      {
        id: 'help_documentation',
        label: 'Documentation',
        icon: 'file-document',
        submenu: [
          {
            id: 'help_doc_getting_started',
            label: 'Getting Started',
            action: 'openGettingStarted',
          },
          {
            id: 'help_doc_nodes',
            label: 'Node Reference',
            action: 'openNodeReference',
          },
          {
            id: 'help_doc_api',
            label: 'API Reference',
            action: 'openAPIReference',
          },
          {
            id: 'help_doc_examples',
            label: 'Examples',
            action: 'openExamples',
          },
          {
            id: 'help_doc_tutorials',
            label: 'Tutorials',
            action: 'openTutorials',
          },
        ],
      },
      {
        id: 'help_topics',
        label: 'Help Topics',
        icon: 'help-circle',
        submenu: [
          {
            id: 'help_topic_basics',
            label: 'Basics',
            action: 'openHelpTopicBasics',
          },
          {
            id: 'help_topic_concepts',
            label: 'Core Concepts',
            action: 'openHelpTopicConcepts',
          },
          {
            id: 'help_topic_advanced',
            label: 'Advanced Topics',
            action: 'openHelpTopicAdvanced',
          },
          {
            id: 'help_topic_tools',
            label: 'Tools & Debugging',
            action: 'openHelpTopicTools',
          },
          {
            id: 'help_topic_troubleshooting',
            label: 'Troubleshooting',
            action: 'openTroubleshooting',
          },
        ],
      },
      {
        id: 'help_shortcuts',
        label: 'Keyboard Shortcuts',
        icon: 'keyboard',
        shortcut: 'Ctrl+Shift+?',
        action: 'openKeyboardShortcuts',
      },
      {
        id: 'help_tips',
        label: 'Tips & Tricks',
        icon: 'lightbulb',
        submenu: [
          {
            id: 'help_tips_daily',
            label: 'Daily Tip',
            action: 'showDailyTip',
          },
          {
            id: 'help_tips_productivity',
            label: 'Productivity Tips',
            action: 'showProductivityTips',
          },
          {
            id: 'help_tips_advanced',
            label: 'Advanced Tips',
            action: 'showAdvancedTips',
          },
        ],
      },
      { divider: true },
      {
        id: 'help_community',
        label: 'Community',
        icon: 'account-group',
        submenu: [
          {
            id: 'help_community_forum',
            label: 'Community Forum',
            action: 'openCommunityForum',
          },
          {
            id: 'help_community_discord',
            label: 'Discord Server',
            action: 'openDiscordServer',
          },
          {
            id: 'help_community_github',
            label: 'GitHub Repository',
            action: 'openGitHub',
          },
          {
            id: 'help_community_share',
            label: 'Share Blueprint',
            action: 'shareBlueprint',
          },
        ],
      },
      {
        id: 'help_support',
        label: 'Support',
        icon: 'email',
        submenu: [
          {
            id: 'help_support_contact',
            label: 'Contact Support',
            action: 'openSupportForm',
          },
          {
            id: 'help_support_report',
            label: 'Report Bug',
            action: 'openBugReport',
          },
          {
            id: 'help_support_feedback',
            label: 'Send Feedback',
            action: 'openFeedbackForm',
          },
          {
            id: 'help_support_faq',
            label: 'FAQ',
            action: 'openFAQ',
          },
        ],
      },
      { divider: true },
      {
        id: 'help_about',
        label: 'About',
        icon: 'information',
        action: 'openAbout',
      },
      {
        id: 'help_version',
        label: 'Check for Updates',
        icon: 'refresh',
        action: 'checkUpdates',
      },
    ],
  },
};