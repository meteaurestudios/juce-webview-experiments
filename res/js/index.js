import * as Juce from "./juce/index.js";

let filePath = "https://github.com/meteaurestudios/juce-webview-experiments/raw/refs/heads/main/res/audio/sample.mp3"
let testFileId = "FileId1"

const downloadFunction = Juce.getNativeFunction("downloadFile");
const openLinkInBrowserFunction = Juce.getNativeFunction("openLinkInBrowser");

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