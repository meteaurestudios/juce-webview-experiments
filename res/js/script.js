function dragStart() {
	console.log("mouse down");
	window.__JUCE__.backend.emitEvent("dragStart",  {});
}