/**
 * @file main.cpp
 * @brief Entry point for the LunaLite Game Engine
 * 
 * This is a minimal executable entry point that initializes the core engine
 * without GUI dependencies. The actual application can link against
 * LunaLite_Engine.lib to use the engine functionality.
 */

#include <iostream>

int main(int argc, char *argv[]) {
    std::cout << "LunaLite Game Engine v1.0" << std::endl;
    std::cout << "Compiled: " << __DATE__ << " " << __TIME__ << std::endl;
    std::cout << "Ready for linking against LunaLite_Engine.lib" << std::endl;
    
    return 0;
}
