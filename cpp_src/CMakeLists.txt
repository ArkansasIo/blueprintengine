cmake_minimum_required(VERSION 3.16)
project(LunaLite)

# C++ Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Platform-specific flags
if(MSVC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W4 /EHsc")
else()
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -fPIC")
endif()

# Optional Qt Configuration
option(USE_QT5 "Use Qt5 for GUI components" OFF)

if(USE_QT5)
    set(CMAKE_AUTOMOC ON)
    set(CMAKE_AUTORCC ON)
    set(CMAKE_AUTOUIC ON)
    
    find_package(Qt5 COMPONENTS 
        Core 
        Gui 
        Widgets 
        Multimedia 
        Network 
        REQUIRED
    )
    
    message(STATUS "Qt5 Support: ENABLED")
else()
    message(STATUS "Qt5 Support: DISABLED (set -DUSE_QT5=ON to enable)")
endif()

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)

# ============================================================================
# LUNALITE UTILITY SYSTEMS
# ============================================================================
set(LUNALITE_UTILS_HEADERS
    include/utils/Types.h
    include/utils/JsonEx.h
    include/utils/Input.h
    include/utils/Time.h
    include/utils/Math.h
)

set(LUNALITE_UTILS_SOURCES
    src/utils/Types.cpp
    src/utils/JsonEx.cpp
    src/utils/Input.cpp
    src/utils/Time.cpp
    src/utils/Math.cpp
)

# ============================================================================
# LUNALITE CORE SYSTEMS
# ============================================================================
set(LUNALITE_CORE_HEADERS
    include/core/GameObject.h
    include/core/CombatCalculator.h
    include/core/StateMachine.h
    include/core/EventSystem.h
)

set(LUNALITE_CORE_SOURCES
    src/core/GameObject.cpp
    src/core/CombatCalculator.cpp
    src/core/StateMachine.cpp
    src/core/EventSystem.cpp
)

# ============================================================================
# LUNALITE GAME LOGIC SYSTEMS
# ============================================================================
set(LUNALITE_GAMEPLAY_HEADERS
    include/gameplay/Database.h
    include/gameplay/GameActorFull.h
    include/gameplay/GameParty.h
    include/gameplay/BattleSystem.h
)

set(LUNALITE_GAMEPLAY_SOURCES
    src/gameplay/Database.cpp
    src/gameplay/GameActorFull.cpp
    src/gameplay/GameParty.cpp
    src/gameplay/BattleSystem.cpp
)

# ============================================================================
# LUNALITE MANAGER SYSTEMS
# ============================================================================
set(LUNALITE_MANAGERS_HEADERS
    include/managers/GameManager.h
    include/managers/AudioManager.h
    include/managers/ConfigurationManager.h
    include/managers/ResourceManager.h
)

set(LUNALITE_MANAGERS_SOURCES
    src/managers/GameManager.cpp
    src/managers/AudioManager.cpp
    src/managers/ConfigurationManager.cpp
    src/managers/ResourceManager.cpp
)

# ============================================================================
# LUNALITE GRAPHICS SYSTEMS
# ============================================================================
set(LUNALITE_GRAPHICS_HEADERS
    include/graphics/Sprite.h
    include/graphics/Animation.h
    include/graphics/GameMap.h
    include/graphics/GameScreen.h
)

set(LUNALITE_GRAPHICS_SOURCES
    src/graphics/Sprite.cpp
    src/graphics/Animation.cpp
    src/graphics/GameMap.cpp
    src/graphics/GameScreen.cpp
)

# ============================================================================
# LUNALITE UI SYSTEMS
# ============================================================================
set(LUNALITE_UI_HEADERS
    include/ui/WindowBase.h
    include/ui/WindowCommand.h
)

set(LUNALITE_UI_SOURCES
    src/ui/WindowBase.cpp
    src/ui/WindowCommand.cpp
)

# ============================================================================
# LUNALITE SCENE SYSTEMS
# ============================================================================
set(LUNALITE_SCENES_HEADERS
    include/scenes/SceneBase.h
    include/scenes/SceneTitle.h
    include/scenes/SceneMenu.h
)

set(LUNALITE_SCENES_SOURCES
    src/scenes/SceneBase.cpp
    src/scenes/SceneTitle.cpp
    src/scenes/SceneMenu.cpp
)

# ============================================================================
# WOLFMAN ALPHA LIBRARY
# ============================================================================
set(WOLFMAN_HEADERS
    include/wolfman/Core.h
    include/wolfman/EntityComponentSystem.h
    include/wolfman/Physics.h
    include/wolfman/Renderer.h
    include/wolfman/InputManager.h
    include/wolfman/AudioManager.h
    include/wolfman/ParticleSystem.h
    include/wolfman/AI.h
    include/wolfman/Scripting.h
    include/wolfman/Network.h
    include/wolfman/Debug.h
    include/wolfman/Utils.h
    include/wolfman/WolfManAlpha.h
    include/wolfman/all.h
)

set(WOLFMAN_SOURCES
    src/wolfman/Core.cpp
    src/wolfman/EntityComponentSystem.cpp
    src/wolfman/Physics.cpp
    src/wolfman/Renderer.cpp
    src/wolfman/InputManager.cpp
    src/wolfman/AudioManager.cpp
    src/wolfman/ParticleSystem.cpp
    src/wolfman/AI.cpp
    src/wolfman/Scripting.cpp
    src/wolfman/Network.cpp
    src/wolfman/Debug.cpp
    src/wolfman/Utils.cpp
    src/wolfman/WolfManAlpha.cpp
)

# ============================================================================
# ADDITIONAL CORE FILES
# ============================================================================
set(CORE_ENGINE_SOURCES
    Point.cpp
    Rectangle.cpp
    Bitmap.cpp
    Graphics.cpp
    Input.cpp
    CacheEntry.cpp
    CacheMap.cpp
    JsonEx.cpp
)

set(CORE_ENGINE_HEADERS
    Point.h
    Rectangle.h
    Bitmap.h
    Graphics.h
    Input.h
    CacheEntry.h
    CacheMap.h
    JsonEx.h
)

# ============================================================================
# COMBINE ALL SOURCE FILES
# ============================================================================
set(ALL_HEADERS
    ${LUNALITE_UTILS_HEADERS}
    ${LUNALITE_CORE_HEADERS}
    ${LUNALITE_GAMEPLAY_HEADERS}
    ${LUNALITE_MANAGERS_HEADERS}
    ${LUNALITE_GRAPHICS_HEADERS}
    ${LUNALITE_UI_HEADERS}
    ${LUNALITE_SCENES_HEADERS}
    ${WOLFMAN_HEADERS}
    ${CORE_ENGINE_HEADERS}
)

set(ALL_SOURCES
    ${LUNALITE_UTILS_SOURCES}
    ${LUNALITE_CORE_SOURCES}
    ${LUNALITE_GAMEPLAY_SOURCES}
    ${LUNALITE_MANAGERS_SOURCES}
    ${LUNALITE_GRAPHICS_SOURCES}
    ${LUNALITE_UI_SOURCES}
    ${LUNALITE_SCENES_SOURCES}
    ${WOLFMAN_SOURCES}
    ${CORE_ENGINE_SOURCES}
)

# ============================================================================
# CREATE LIBRARY TARGET
# ============================================================================
add_library(LunaLite_Engine STATIC ${ALL_HEADERS} ${ALL_SOURCES})

# Link Qt Libraries (optional)
if(USE_QT5)
    target_link_libraries(LunaLite_Engine PUBLIC
        Qt5::Core
        Qt5::Gui
        Qt5::Widgets
        Qt5::Multimedia
        Qt5::Network
    )
    target_compile_definitions(LunaLite_Engine PUBLIC USE_QT5)
endif()

# ============================================================================
# CREATE EXECUTABLE
# ============================================================================
# Create a simple main executable
file(WRITE "${CMAKE_CURRENT_BINARY_DIR}/main.cpp" "
int main() {
    return 0;
}
")

add_executable(LunaLite "${CMAKE_CURRENT_BINARY_DIR}/main.cpp")
target_link_libraries(LunaLite PRIVATE LunaLite_Engine)

# ============================================================================
# DISPLAY BUILD INFORMATION
# ============================================================================
message(STATUS "=====================================================")
message(STATUS "LunaLite Game Engine - Build Configuration")
message(STATUS "=====================================================")
message(STATUS "Project: ${PROJECT_NAME}")
message(STATUS "CMake Version: ${CMAKE_VERSION}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "Qt Version: ${Qt5_VERSION}")
message(STATUS "")
message(STATUS "Source Files (55+ total):")
message(STATUS "  - LunaLite Utils: 5 modules")
message(STATUS "  - LunaLite Core: 4 modules")
message(STATUS "  - LunaLite Gameplay: 4 modules")
message(STATUS "  - LunaLite Managers: 4 modules")
message(STATUS "  - LunaLite Graphics: 4 modules")
message(STATUS "  - LunaLite UI: 2 modules")
message(STATUS "  - LunaLite Scenes: 3 modules")
message(STATUS "  - WolfMan Alpha: 13 modules")
message(STATUS "  - Core Engine: 8 modules")
message(STATUS "")
message(STATUS "Build Targets:")
message(STATUS "  - Library: LunaLite_Engine (STATIC)")
message(STATUS "  - Executable: LunaLite")
message(STATUS "=====================================================")

