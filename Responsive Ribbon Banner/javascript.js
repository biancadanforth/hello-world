//Responsive Ribbon 03032016

// function to calculate rendered height of the ribbon with content
function computeRibbonHeight() {
	var ribbonEndLeft = document.getElementById('ribbon-end-left');
	var ribbonLengthLeft = document.getElementById('ribbon-length-left');
	var centerRibbon = document.getElementById('center');
	var ribbonLengthRight = document.getElementById('ribbon-length-right');
	var ribbonEndRight = document.getElementById('ribbon-end-right');
	var renderedHeight = centerRibbon.clientHeight; //includes height and vertical padding
	//getBoundingClientRect()
	console.log(renderedHeight);
	//compute border size
	borderSize = renderedHeight/2;
	console.log(borderSize);
	// update size of end pieces of left and right ribbons so they match the center piece
	ribbonEndLeft.style.borderWidth = borderSize;
	ribbonLengthLeft.style.borderWidth = borderSize;
	ribbonLengthRight.style.borderWidth = borderSize;
	ribbonEndRight.style.borderWidth = borderSize;
	centerRibbon.style.height = renderedHeight;

	// still need to address margin-top on .center div to be responsive
}

//when the page loads, get the rendered height of the center ribbon segment
window.addEventListener("load", computeRibbonHeight);