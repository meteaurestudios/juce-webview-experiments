# JUCE WebView Experiments

The current goal of this plugin is to display a web based UI with a draggable component, allowing to drag and drop an audio file out of the plugin window. When the dragging event is received on the UI, the JavaScript frontend emits an event for the JUCE backend to handle. The PluginEditor then calls the JUCE method `performExternalDragDropOfFiles()`, handling the JUCE native drag and drop logic.

## Illustrated issue

However this works as expected on Windows, an assert gets triggered on macOS in "juce_Windowing_mac.mm" when dropping the file. This seems to be due to the fact that no actual dragging event was received in JUCE prior to the call to `performExternalDragDropOfFiles()`.

*Note: to properly trigger the assert, ensure to be attached to the host process where the plugin is loaded.*

See the [associated topic](https://forum.juce.com/t/webview-drag-and-drop-audio-files-out-of-plugin) on the JUCE forum.

## Get started

Clone JUCE
```
git submodule update --init
```

Build project from cmake (Xcode version)
```
cmake . -G Xcode -B build
```
