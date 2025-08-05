# JUCE WebView Experiments

![master](https://github.com/meteaurestudios/juce-webview-experiments/actions/workflows/build.yml/badge.svg)

This project illustrates operations on external files using a JUCE WebView.

The plugin allows to:
- download a file from a specific url
- drag this file out of the plugin
- drop an external file and display its content
- drop and display plain text content

## Get started

Clone JUCE
```
git submodule update --init
```

Build project from cmake (macOS)
```
cmake . -G Xcode -B build
```
