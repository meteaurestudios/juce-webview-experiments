#include "PluginProcessor.h"
#include "PluginEditor.h"

PluginEditor::PluginEditor(PluginProcessor& p)
    : AudioProcessorEditor(&p)
    , processorRef(p)
    , mWebView{juce::WebBrowserComponent::Options{}
                .withBackend(WebBrowserComponent::Options::Backend::webview2)
                .withWinWebView2Options(WebBrowserComponent::Options::WinWebView2{}
                                        .withUserDataFolder(File::getSpecialLocation (File::SpecialLocationType::tempDirectory))
                                        .withBackgroundColour(juce::Colours::white))

                .withResourceProvider([this](const auto& url) { return getResource(url); })
                .withNativeIntegrationEnabled()
                .withEventListener("dragStart", [this](juce::var) {
                    dragginStartedFromFrontEnd();
                })
                .withNativeFunction(juce::Identifier{"downloadFile"},
                                    [this](const juce::Array<juce::var>& args,
                                           juce::WebBrowserComponent::NativeFunctionCompletion completion) {
                    downloadFile(args, std::move(completion));
                })
    }
{
    juce::ignoreUnused(processorRef);
    
    addAndMakeVisible(mWebView);
    mWebView.goToURL(mWebView.getResourceProviderRoot());
    
    setResizable(true, true);
    setSize(800, 600);
}

PluginEditor::~PluginEditor()
{
}

void PluginEditor::resized()
{
    mWebView.setBounds(getLocalBounds());
}

const char* PluginEditor::getMimeForExtension(const String& extension)
{
    static const std::unordered_map<String, const char*> mimeMap =
    {
        { { "htm"   },  "text/html"                },
        { { "html"  },  "text/html"                },
        { { "txt"   },  "text/plain"               },
        { { "jpg"   },  "image/jpeg"               },
        { { "jpeg"  },  "image/jpeg"               },
        { { "svg"   },  "image/svg+xml"            },
        { { "ico"   },  "image/vnd.microsoft.icon" },
        { { "json"  },  "application/json"         },
        { { "png"   },  "image/png"                },
        { { "css"   },  "text/css"                 },
        { { "map"   },  "application/json"         },
        { { "js"    },  "text/javascript"          },
        { { "woff2" },  "font/woff2"               }
    };

    if (const auto it = mimeMap.find(extension.toLowerCase()); it != mimeMap.end())
        return it->second;

    jassertfalse;
    return "";
}

auto PluginEditor::streamToVector(InputStream& stream)
{
    std::vector<std::byte> result ((size_t) stream.getTotalLength());
    stream.setPosition (0);
    [[maybe_unused]] const auto bytesRead = stream.read (result.data(), result.size());
    jassert (bytesRead == (ssize_t) result.size());
    return result;
}

auto PluginEditor::getResource(const juce::String& url) -> std::optional<Resource>
{
    printf("URL : %s\n", url.toStdString().c_str());
    
    static const auto resource_file_root = juce::File{ RESOURCE_ROOT };
    const auto resource_to_retrive = url == "/" ? "index.html" : url.fromFirstOccurrenceOf("/", false, false);
    const auto resource = resource_file_root.getChildFile(resource_to_retrive).createInputStream();
    
    if(resource) {
        const auto extension = resource_to_retrive.fromLastOccurrenceOf(".", false, false);
        return Resource { streamToVector(*resource), getMimeForExtension(extension)};
    }

    return std::nullopt;
}

void PluginEditor::dragginStartedFromFrontEnd()
{
    printf("Drag started in JS\n");
    
    const auto sample_path = std::string(RESOURCE_ROOT) + "/audio/sample.mp3";
    jassert(juce::File{sample_path}.existsAsFile());
    
    performExternalDragDropOfFiles(StringArray{sample_path}, false, &mWebView);
}

void PluginEditor::downloadFile(const juce::Array<juce::var>& args,
                                juce::WebBrowserComponent::NativeFunctionCompletion completion)
{
    jassert(args.size() == 1);
    const std::string url = args.getReference(0).toString().toStdString();
    
    printf("downloadFile %s\n", url.c_str());
    
    juce::URL download(url);
    File destFile = juce::File::getSpecialLocation(juce::File::tempDirectory).getChildFile(download.getFileName());
    std::unique_ptr<juce::URL::DownloadTask> taskProgress = download.downloadToFile(destFile, juce::URL::DownloadTaskOptions{});
    
    if(!taskProgress) {
        printf("Download task could not be created\n");
        return;
    }
    
    while(taskProgress->isFinished() == false) {
        printf("Downloading %s ...\n", download.getFileName().toStdString().c_str());
        Thread::sleep(500);
    }
    bool error = taskProgress->hadError();
    
    if(!error) {
        mDownloadedFile = destFile;
        printf("Downloaded file in %s\n", mDownloadedFile.getFullPathName().toStdString().c_str());
    }
    else {
        printf("Download failed");
    }
    
    const std::string download_path = mDownloadedFile.getFullPathName().toStdString();
    completion(download_path.c_str());
}
