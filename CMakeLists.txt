cmake_minimum_required(VERSION 3.22 FATAL_ERROR)

project(WebViewPlugin VERSION 0.0.1)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_OSX_ARCHITECTURES "arm64;x86_64")
set(CMAKE_OSX_DEPLOYMENT_TARGET "11.0")

add_subdirectory(third-party/juce)

set(RESOURCE_PATH ${CMAKE_CURRENT_LIST_DIR}/res)

set(TARGET_SOURCES
    src/PluginEditor.h
    src/PluginEditor.cpp
    src/PluginProcessor.h
    src/PluginProcessor.cpp)

juce_add_plugin(${PROJECT_NAME}
    # VERSION ...                               # Set this if the plugin version is different to the project version
    # ICON_BIG ...                              # ICON_* arguments specify a path to an image file to use as an icon for the Standalone
    # ICON_SMALL ...
    COMPANY_NAME "Meteaure"                     # Specify the name of the plugin's author
    IS_SYNTH FALSE                              	# Is this a synth or an effect?
    NEEDS_MIDI_INPUT FALSE                      # Does the plugin need midi input?
    NEEDS_MIDI_OUTPUT FALSE                     # Does the plugin need midi output?
    # IS_MIDI_EFFECT TRUE/FALSE                 # Is this plugin a MIDI effect?
    # EDITOR_WANTS_KEYBOARD_FOCUS TRUE/FALSE    # Does the editor need keyboard focus?
    # COPY_PLUGIN_AFTER_BUILD TRUE/FALSE        # Should the plugin be installed to a default location after building?
    PLUGIN_MANUFACTURER_CODE Expe               # A four-character manufacturer id with at least one upper-case character
    PLUGIN_CODE WebV                            # A unique four-character plugin id with exactly one upper-case character
                                                # GarageBand 10.3 requires the first letter to be upper-case, and the remaining letters to be lower-case
    FORMATS AU VST3 Standalone                  # The formats to build. Other valid formats are: AAX Unity VST AU AUv3
    PRODUCT_NAME ${PROJECT_NAME}                # The name of the final executable, which can differ from the target name
    NEEDS_WEBVIEW2 TRUE)						# Set this true if you want to link WebView2 statically on Windows

juce_generate_juce_header(${PROJECT_NAME})

target_sources(${PROJECT_NAME} PRIVATE ${TARGET_SOURCES})
source_group(src FILES ${TARGET_SOURCES})

target_compile_definitions(${PROJECT_NAME}
    PUBLIC
        JUCE_WEB_BROWSER=1
        JUCE_USE_CURL=0
        JUCE_VST3_CAN_REPLACE_VST2=0
        JUCE_USE_WIN_WEBVIEW2_WITH_STATIC_LINKING=1
    PRIVATE
        RESOURCE_ROOT="${RESOURCE_PATH}") # Add res files location (debug builds only)

if(UNIX)
    set(COMPILE_OPTIONS -Wall -Wextra -ffast-math)

    # use -Ofast optimisation flag in release
	if(NOT CMAKE_BUILD_TYPE STREQUAL "Debug")
	    set(COMPILE_OPTIONS ${COMPILE_OPTIONS} -Ofast)
	endif()
endif()

target_compile_options(${PROJECT_NAME} PUBLIC ${COMPILE_OPTIONS})

target_link_libraries(${PROJECT_NAME}
    PRIVATE
        # AudioPluginData           # If we'd created a binary data target, we'd link to it here
        juce::juce_audio_utils
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)
