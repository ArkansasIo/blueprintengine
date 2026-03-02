list(FILTER SOURCES EXCLUDE REGEX "Game_Party\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Enemy\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Player\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_BattlerBase\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Party\\.cpp") 
list(FILTER SOURCES EXCLUDE REGEX "Game_Actors\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Actor\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Enemy\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Player\\.cpp")
cmake_minimum_required(VERSION 3.16)

# Set compiler based on availability
# First check if cl.exe (MSVC) is available
find_program(MSVC_COMPILER cl.exe DOC "MSVC Compiler")

if(MSVC_COMPILER)
    set(CMAKE_C_COMPILER "cl.exe" CACHE STRING "C compiler")
    set(CMAKE_CXX_COMPILER "cl.exe" CACHE STRING "C++ compiler")
elseif(WIN32)
    # On Windows, try Clang first, then GCC
    find_program(CLANG_COMPILER clang.exe DOC "Clang Compiler")
    find_program(CLANGXX_COMPILER clang++.exe DOC "Clang++ Compiler")
    find_program(GCC_COMPILER gcc.exe DOC "GCC Compiler")
    find_program(GCCXX_COMPILER g++.exe DOC "G++ Compiler")
    
    if(CLANG_COMPILER AND CLANGXX_COMPILER)
        set(CMAKE_C_COMPILER "${CLANG_COMPILER}")
        set(CMAKE_CXX_COMPILER "${CLANGXX_COMPILER}")
        message(STATUS "Using Clang compiler: ${CLANG_COMPILER}")
    elseif(GCC_COMPILER AND GCCXX_COMPILER)
        set(CMAKE_C_COMPILER "${GCC_COMPILER}")
        set(CMAKE_CXX_COMPILER "${GCCXX_COMPILER}")
        message(STATUS "Using GCC compiler: ${GCC_COMPILER}")
    endif()
endif()

project(LunaLite)

# Platform detection and compiler setup
if(MSVC)
    message(STATUS "MSVC Compiler Detected")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W4 /EHsc")
else()
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -fPIC")
endif()

# C++ Standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Make sure our current directory is first in include paths
include_directories(BEFORE ${CMAKE_CURRENT_SOURCE_DIR})

# Optional Qt Configuration
if(NOT DEFINED ENABLE_QT)
    set(ENABLE_QT OFF)
endif()

message(STATUS "ENABLE_QT: ${ENABLE_QT}")

if(ENABLE_QT)
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
    message(STATUS "Qt5 Support: DISABLED - Skipping Qt5 discovery")
endif()

# Add all source files (excluding GUI-specific files if Qt is disabled)
file(GLOB SOURCES "*.cpp")
file(GLOB HEADERS "*.h")

# If Qt is disabled, exclude GUI-specific files
if(NOT ENABLE_QT)
    list(FILTER SOURCES EXCLUDE REGEX "APIGUIWindow\\.cpp")
    list(FILTER HEADERS EXCLUDE REGEX "APIGUIWindow\\.h")
    message(STATUS "Qt disabled - excluding GUI-specific files from build")
endif()

# Exclude extension files that depend on missing base classes or Qt types
# Exclude extension files (_Ex) that duplicate base class definitions
list(FILTER SOURCES EXCLUDE REGEX "_Ex\\.cpp$")
list(FILTER HEADERS EXCLUDE REGEX "_Ex\\.h$")

# Exclude GUI/Window UI files (all depend on Qt)
list(FILTER SOURCES EXCLUDE REGEX "Window_.*\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "TilingSprite\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "TextManager\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "ShaderTilemap\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Weather\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "ScreenSprite\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Scene_.*\\.cpp")
list(FILTER SOURCES EXCLUDE REGEX "Game_Actors\\.cpp")
message(STATUS "Excluding all _Ex extension files (duplicate class definitions)")
message(STATUS "Excluding all Window UI files (Qt dependencies)")
message(STATUS "Excluding TilingSprite, TextManager (Qt dependencies)")

message(STATUS "Found ${CMAKE_CXX_COMPILER}")
message(STATUS "Project: ${PROJECT_NAME}")
message(STATUS "Build Type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")
list(LENGTH SOURCES SOURCE_COUNT)
message(STATUS "Source files count: ${SOURCE_COUNT}")

# Create library
add_library(${PROJECT_NAME}_Engine STATIC ${SOURCES} ${HEADERS})

# Link Qt libraries if enabled
if(ENABLE_QT)
    target_link_libraries(${PROJECT_NAME}_Engine 
        PUBLIC 
        Qt5::Core 
        Qt5::Gui 
        Qt5::Widgets 
        Qt5::Multimedia 
        Qt5::Network
    )
endif()

# Create executable (exclude main.cpp from library, include in exe)
list(REMOVE_ITEM SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/main.cpp")
add_executable(${PROJECT_NAME} main.cpp ${SOURCES})

# Link libraries to executable
if(ENABLE_QT)
    target_link_libraries(${PROJECT_NAME} 
        PRIVATE 
        Qt5::Core 
        Qt5::Gui 
        Qt5::Widgets 
        Qt5::Multimedia 
        Qt5::Network
    )
endif()

message(STATUS "Build targets: ${PROJECT_NAME}_Engine (library) and ${PROJECT_NAME} (executable)")
