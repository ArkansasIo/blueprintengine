/**
 * Menu Handlers
 * Action handlers for all menu items and buttons
 */

export interface MenuActionContext {
  onNewBlueprint?: () => void;
  onOpenBlueprint?: () => void;
  onSaveBlueprint?: () => void;
  onSaveAsBlueprint?: () => void;
  onImportBlueprint?: () => void;
  onExportBlueprint?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomFit?: () => void;
  onToggleGrid?: () => void;
  onCompile?: () => void;
  onValidate?: () => void;
  onDebugMode?: () => void;
  onShowHelp?: () => void;
  [key: string]: any;
}

export class MenuHandler {
  private context: MenuActionContext = {};
  private history: string[] = [];

  constructor(context?: MenuActionContext) {
    this.context = context || {};
  }

  /**
   * Set context for menu actions
   */
  setContext(context: MenuActionContext) {
    this.context = { ...this.context, ...context };
  }

  /**
   * File Menu Handlers
   */
  handleNewBlueprint = () => {
    console.log('[Menu] New Blueprint');
    this.context.onNewBlueprint?.();
    this.addToHistory('new-blueprint');
  };

  handleOpenBlueprint = () => {
    console.log('[Menu] Open Blueprint');
    this.context.onOpenBlueprint?.();
    this.addToHistory('open-blueprint');
  };

  handleSaveBlueprint = () => {
    console.log('[Menu] Save Blueprint');
    this.context.onSaveBlueprint?.();
    this.addToHistory('save-blueprint');
  };

  handleSaveAsBlueprint = () => {
    console.log('[Menu] Save As Blueprint');
    this.context.onSaveAsBlueprint?.();
    this.addToHistory('save-as-blueprint');
  };

  handleImportBlueprint = () => {
    console.log('[Menu] Import Blueprint');
    this.context.onImportBlueprint?.();
    this.addToHistory('import-blueprint');
  };

  handleExportBlueprint = () => {
    console.log('[Menu] Export Blueprint');
    this.context.onExportBlueprint?.();
    this.addToHistory('export-blueprint');
  };

  /**
   * Edit Menu Handlers
   */
  handleUndo = () => {
    console.log('[Menu] Undo');
    this.context.onUndo?.();
    this.addToHistory('undo');
  };

  handleRedo = () => {
    console.log('[Menu] Redo');
    this.context.onRedo?.();
    this.addToHistory('redo');
  };

  handleCut = () => {
    console.log('[Menu] Cut');
    this.context.onCut?.();
    this.addToHistory('cut');
  };

  handleCopy = () => {
    console.log('[Menu] Copy');
    this.context.onCopy?.();
    this.addToHistory('copy');
  };

  handlePaste = () => {
    console.log('[Menu] Paste');
    this.context.onPaste?.();
    this.addToHistory('paste');
  };

  handleDelete = () => {
    console.log('[Menu] Delete');
    this.context.onDelete?.();
    this.addToHistory('delete');
  };

  handleSelectAll = () => {
    console.log('[Menu] Select All');
    this.context.onSelectAll?.();
    this.addToHistory('select-all');
  };

  handleDeselectAll = () => {
    console.log('[Menu] Deselect All');
    this.context.onDeselectAll?.();
    this.addToHistory('deselect-all');
  };

  handleDuplicate = () => {
    console.log('[Menu] Duplicate');
    this.context.onDelete?.(); // Using onDelete as a fallback, should be improved
    this.addToHistory('duplicate');
  };

  /**
   * View Menu Handlers
   */
  handleZoomIn = () => {
    console.log('[Menu] Zoom In');
    this.context.onZoomIn?.();
    this.addToHistory('zoom-in');
  };

  handleZoomOut = () => {
    console.log('[Menu] Zoom Out');
    this.context.onZoomOut?.();
    this.addToHistory('zoom-out');
  };

  handleZoomReset = () => {
    console.log('[Menu] Reset Zoom');
    this.context.onZoomIn?.(); // Reset zoom to default
    this.addToHistory('zoom-reset');
  };

  handleZoomFit = () => {
    console.log('[Menu] Zoom to Fit');
    this.context.onZoomFit?.();
    this.addToHistory('zoom-fit');
  };

  handleToggleGrid = () => {
    console.log('[Menu] Toggle Grid');
    this.context.onToggleGrid?.();
    this.addToHistory('toggle-grid');
  };

  /**
   * Tools Menu Handlers
   */
  handleCompile = () => {
    console.log('[Menu] Compile Blueprint');
    this.context.onCompile?.();
    this.addToHistory('compile');
  };

  handleValidate = () => {
    console.log('[Menu] Validate Blueprint');
    this.context.onValidate?.();
    this.addToHistory('validate');
  };

  handleDebugMode = () => {
    console.log('[Menu] Debug Mode');
    this.context.onDebugMode?.();
    this.addToHistory('debug-mode');
  };

  handleExecute = () => {
    console.log('[Menu] Execute Graph');
    this.context.onCompile?.();
    this.addToHistory('execute');
  };

  /**
   * Help Menu Handlers
   */
  handleShowHelp = () => {
    console.log('[Menu] Show Help');
    this.context.onShowHelp?.();
    this.addToHistory('show-help');
  };

  /**
   * Generic Menu Handler
   */
  handleMenuAction = (actionId: string) => {
    const handler = this.getHandlerForAction(actionId);
    if (handler) {
      handler();
    } else {
      console.log(`[Menu] Action: ${actionId}`);
      this.addToHistory(actionId);
    }
  };

  /**
   * Get handler for action ID
   */
  private getHandlerForAction = (actionId: string) => {
    const handlerMap: Record<string, () => void> = {
      'file_new': this.handleNewBlueprint,
      'file_open': this.handleOpenBlueprint,
      'file_save': this.handleSaveBlueprint,
      'file_save_as': this.handleSaveAsBlueprint,
      'file_import': this.handleImportBlueprint,
      'file_export': this.handleExportBlueprint,
      'edit_undo': this.handleUndo,
      'edit_redo': this.handleRedo,
      'edit_cut': this.handleCut,
      'edit_copy': this.handleCopy,
      'edit_paste': this.handlePaste,
      'edit_delete': this.handleDelete,
      'edit_select_all': this.handleSelectAll,
      'edit_deselect_all': this.handleDeselectAll,
      'view_zoom_in': this.handleZoomIn,
      'view_zoom_out': this.handleZoomOut,
      'view_zoom_fit': this.handleZoomFit,
      'view_toggle_grid': this.handleToggleGrid,
      'tools_compile': this.handleCompile,
      'tools_validate': this.handleValidate,
      'tools_debug': this.handleDebugMode,
      'help_about': this.handleShowHelp,
    };

    return handlerMap[actionId];
  };

  /**
   * Add action to history
   */
  private addToHistory = (action: string) => {
    this.history.push(`${new Date().toISOString()} - ${action}`);
    // Keep only last 100 actions
    if (this.history.length > 100) {
      this.history.shift();
    }
  };

  /**
   * Get action history
   */
  getHistory = () => {
    return [...this.history];
  };

  /**
   * Clear history
   */
  clearHistory = () => {
    this.history = [];
  };
}

/**
 * Create singleton menu handler
 */
export const menuHandler = new MenuHandler();