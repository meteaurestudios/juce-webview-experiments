import * as Juce from "./juce/index.js";

let filePath = "https://github.com/meteaurestudios/juce-webview-experiments/raw/refs/heads/main/res/audio/sample.mp3"
let testFileId = "FileId1"

const downloadFunction = Juce.getNativeFunction("downloadFile");

function downloadFile() {
    downloadFunction(filePath, testFileId).then(result => {
        console.log("File downloaded at: " + result);
        
        const downLoadButton = document.getElementById("downloadButton");
        downLoadButton.style.color = "#42f584";
        downLoadButton.style.backgroundColor = "#444";
        downLoadButton.textContent = "download successful"
        
        const downloadedFilePath = document.getElementById("downloadedFilePath");
        downloadedFilePath.textContent = result
        downloadedFilePath.style.display = 'inline-block'
        
        const dragBox = document.getElementById("dragSource");
        dragBox.style.display = 'block'
    });
}

function dragStart() {
    window.__JUCE__.backend.emitEvent("dragStart",  {
        fileId: testFileId
    });
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Download button behavior -----
    
    const downLoadButton = document.getElementById("downloadButton");
    downLoadButton.addEventListener("mouseup", () => {
        downloadFile();
    });
    
    // Drag out event -----
    
    const dragBox = document.getElementById("dragSource");
    dragBox.addEventListener("mousedown", () => {
        dragStart()
    });
    
    dragBox.style.display = 'none'
    
    // Drop zone -----
    
    const dropZone = document.getElementById('drop-zone');
    const fileName = document.getElementById('file-name');
    const fileContent = document.getElementById('file-content');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => e.preventDefault());
    });
    
    dropZone.addEventListener('dragover', () => dropZone.classList.add('hover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));
    
    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('hover');

        console.log('Available types:', Array.from(e.dataTransfer.types));
        
        const file = e.dataTransfer.files[0];

        if (!file) {
            fileContent.textContent = 'No file received';
            return;
        }
        
        fileName.textContent = `File: ${file.name}`;
        fileContent.textContent = 'Loading...';
        
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;
            fileContent.textContent = text;
        };

        reader.onerror = () => {
            fileContent.textContent = 'Error reading file';
        };

        reader.onabort = () => {
            fileContent.textContent = 'Operation aborted';
        };
        
        reader.readAsText(file);
    });
});
