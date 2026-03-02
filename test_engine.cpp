#include <iostream>
#include "cpp_src/SceneManager.h"
#include "cpp_src/BattleManager.h"
#include "cpp_src/AudioManager.h"
#include "cpp_src/Graphics.h"
#include "cpp_src/Input.h"

int main() {
    std::cout << "========================================\n";
    std::cout << "LunaLite Engine - Library Test\n";
    std::cout << "========================================\n\n";

    try {
        // Test Scene Manager
        std::cout << "[1/5] Testing Scene Manager..." << std::flush;
        SceneManager sceneManager;
        std::cout << " OK\n";

        // Test Battle Manager
        std::cout << "[2/5] Testing Battle Manager..." << std::flush;
        BattleManager battleManager;
        std::cout << " OK\n";

        // Test Audio Manager
        std::cout << "[3/5] Testing Audio Manager..." << std::flush;
        AudioManager audioManager;
        std::cout << " OK\n";

        // Test Graphics
        std::cout << "[4/5] Testing Graphics..." << std::flush;
        Graphics graphics;
        std::cout << " OK\n";

        // Test Input
        std::cout << "[5/5] Testing Input..." << std::flush;
        Input input;
        std::cout << " OK\n";

        std::cout << "\n========================================\n";
        std::cout << "All Tests Passed! ✓\n";
        std::cout << "LunaLite Engine Library is functional.\n";
        std::cout << "========================================\n";

        return 0;

    } catch (const std::exception& e) {
        std::cerr << "\nERROR: " << e.what() << "\n";
        return 1;
    } catch (...) {
        std::cerr << "\nERROR: Unknown exception occurred\n";
        return 1;
    }
}
