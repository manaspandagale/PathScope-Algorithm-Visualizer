cmake_minimum_required(VERSION 3.15)
project(PathScopeAlgorithms VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

# Native algorithm test executable
add_executable(algorithm_tests
    tests/algorithm_tests.cpp
    src/bfs.cpp
    src/dijkstra.cpp
)

# If compiling with Emscripten, build the WebAssembly target
if (EMSCRIPTEN)
    add_executable(algorithm_wasm
        src/bfs.cpp
        src/dijkstra.cpp
        src/bindings.cpp
    )
    set_target_properties(algorithm_wasm PROPERTIES
        LINK_FLAGS "--bind -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s ALLOW_MEMORY_GROWTH=1 -O3"
        OUTPUT_NAME "algorithm_wasm"
        SUFFIX ".js"
    )
endif()
