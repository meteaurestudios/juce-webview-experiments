const source = document.querySelector("#source");

source.addEventListener("dragstart", (ev) => {
	console.log("dragStart");
	// Change the source element's background color
	// to show that drag has started
	ev.currentTarget.classList.add("dragging");
	
	window.__JUCE__.backend.emitEvent("dragStart",  {});
});

source.addEventListener("dragend", (ev) =>
	ev.target.classList.remove("dragging"),
);