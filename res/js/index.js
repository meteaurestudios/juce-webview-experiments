import * as Juce from "./juce/index.js";

let filePath = "https://github.com/meteaurestudios/juce-webview-experiments/raw/refs/heads/main/res/audio/sample.mp3"
let testFileId = "FileId1"

const downloadFunction = Juce.getNativeFunction("downloadFile");
const openLinkInBrowserFunction = Juce.getNativeFunction("openLinkInBrowser");

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
    const file = e.dataTransfer.files[0];
    if (!file) return;

    fileName.textContent = `File: ${file.name}`;
    fileContent.textContent = 'Loading...';

    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        fileContent.textContent = text;

        // Extract content inside <filename>...</filename>
        const match = text.match(/<filename>(.*?)<\/filename>/);
        if (match) {
          const extracted = match[1];
          const extractedEl = document.createElement('div');
          extractedEl.innerHTML = `Extracted filename: ${extracted}`;
          fileContent.insertAdjacentElement('beforebegin', extractedEl);
        }

    };
    reader.onerror = () => {
        fileContent.textContent = 'Error reading file.';
    };

    reader.readAsText(file);
});

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
	const downLoadButton = document.getElementById("downloadButton");
	downLoadButton.addEventListener("mouseup", () => {
		downloadFile();
	});

	const dragBox = document.getElementById("dragSource");
	dragBox.addEventListener("mousedown", () => {
		dragStart()
	});

	dragBox.style.display = 'none'
});