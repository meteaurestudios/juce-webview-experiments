#pragma once

#include "PluginProcessor.h"

class PluginEditor final :
    public juce::AudioProcessorEditor,
    public juce::DragAndDropContainer
{
public:
    explicit PluginEditor(PluginProcessor&);
    ~PluginEditor() override;

    void resized() override;

private:
    
    static const char* getMimeForExtension(const String& extension);
    static auto streamToVector(InputStream& stream);
    
    using Resource = juce::WebBrowserComponent::Resource;
    std::optional<Resource> getResource(const juce::String& url);
    
    void dragginStartedFromFrontEnd(juce::var frontEndObject);
    void downloadFile(const juce::Array<juce::var>& args,
                      juce::WebBrowserComponent::NativeFunctionCompletion completion);
    
    void openLinkInBrowser(const juce::Array<juce::var>& args);
    
    std::unordered_map<std::string, std::string> mFileMap {};
    
    // This reference is provided as a quick way for your editor to
    // access the processor object that created it.
    PluginProcessor& processorRef;

    juce::WebBrowserComponent mWebView;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(PluginEditor)
};
