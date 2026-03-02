#ifndef APIGUIWINDOW_H
#define APIGUIWINDOW_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

/**
 * @class APIGUIWindow
 * @brief Main window for the LunaLite API GUI Desktop Application
 * 
 * This class creates a desktop GUI application with RPG Maker MZ styling
 * for browsing and referencing the LunaLite API documentation.
 */
class APIGUIWindow : public QMainWindow {
    Q_OBJECT

public:
    /**
     * @brief Constructor for APIGUIWindow
     * @param parent Parent widget pointer
     */
    explicit APIGUIWindow(QWidget *parent = nullptr);
    
    /**
     * @brief Destructor for APIGUIWindow
     */
    ~APIGUIWindow();

protected:
    /**
     * @brief Handle window close event
     */
    void closeEvent(QCloseEvent *event) override;

private slots:
    /**
     * @brief Handle menu item selection
     */
    void onMenuItemClicked(QListWidgetItem *item);
    
    /**
     * @brief Handle category button clicks
     */
    void onCategoryClicked();
    
    /**
     * @brief Handle search functionality
     */
    void onSearchTextChanged(const QString &text);
    
    /**
     * @brief Handle filter by category
     */
    void filterByCategory(const QString &category);
    
    /**
     * @brief Display class documentation
     */
    void displayClassDoc(const QString &className);
    
    /**
     * @brief Export API data to JSON
     */
    void exportToJSON();
    
    /**
     * @brief Print current view
     */
    void printView();
    
    /**
     * @brief Show about dialog
     */
    void showAboutDialog();

private:
    /**
     * @brief Initialize the UI components
     */
    void initializeUI();
    
    /**
     * @brief Setup the stylesheet with RPG Maker MZ colors
     */
    void setupStylesheet();
    
    /**
     * @brief Populate the navigation menu
     */
    void populateMenu();
    
    /**
     * @brief Populate API cards with class information
     */
    void populateAPICards();
    
    /**
     * @brief Create category buttons
     */
    void createCategoryButtons();
    
    /**
     * @brief Setup connections between signals and slots
     */
    void setupConnections();
    
    /**
     * @brief Load API data from definitions
     */
    void loadAPIData();

    // UI Components
    QWidget *centralWidget;
    QSplitter *mainSplitter;
    
    // Sidebar widgets
    QWidget *sidebarWidget;
    QListWidget *menuList;
    QListWidget *categoryList;
    
    // Main content area
    QWidget *contentWidget;
    QLineEdit *searchBox;
    QWidget *cardsContainer;
    QListWidget *apiCardsList;
    QTextEdit *detailsPanel;
    
    // Buttons
    QPushButton *exportBtn;
    QPushButton *printBtn;
    QPushButton *aboutBtn;
    
    // Data storage
    struct APIClass {
        QString name;
        QString description;
        QString type;
        QString category;
        QStringList methods;
    };
    
    QList<APIClass> apiClasses;
    QString currentCategory;
    QString currentSearchText;
};

#endif // APIGUIWINDOW_H
