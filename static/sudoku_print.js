$(function(){		
	if (document.location.href.indexOf("print.html") >0) {
			parent.loadedDataFunction = null;
	}
	
	$("#printPuzzle").click(function() {
		if (document.domain == "localhost") {
			document.all["sudokuData"].src = "print.html";
		} else {
			window.open("print.html");
		}
	})
	// handle the work when we are in the print window
	if (document.location.href.indexOf("print.html") >= 0 ) {
		printData();
	}
});

function printData() {
	var useOpener = opener;
	if (document.domain == "localhost") {
		useOpener = parent;
	}
	
	puzzleGrid = useOpener.puzzleGrid;
	
	var printTable = new Grid($("#printgrid1"));	
	printTable.render();
	printTable.resetPuzzle();
	
	/*
	printTable = new Grid($("#printgrid2"));	
	printTable.render();
	printTable.resetPuzzle();
	*/

	var txt = useOpener.$("#sudokutext").html();
	$("#sudokutext").html(txt);

	window.print();
}

