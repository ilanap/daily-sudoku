$(function(){
		
	$(".getWebSudoku").on("click", function() {
		$("#sudokutext").text("");
		loadedDataFunction = loadWebSudoku;
		var url = "http://show.websudoku.com/?level="+
			$("#webSudokuLevel").val();
		console.log(url);
		document.all["sudokuData"].src =sudokuDataUrlPrefx + url;
		
	});
});
function loadWebSudoku() {
	this.valuesGrid.clearPuzzle();
	var data = document.all["sudokuData"].contentWindow.document.body.innerHTML;
	var dataNumbers = $(data).find("input[readonly]");
	for (var i=0;i<dataNumbers.length;i++) {
		if (dataNumbers[i].type != "text") continue;
		var id = dataNumbers[i].id;
		var col = id.charAt(1);
		var row = id.charAt(2);
		console.log(id+", "+dataNumbers[i].value)
		this.valuesGrid.getCell(row,col).setValue(dataNumbers[i].value);		
	}	
	this.valuesGrid.saveAsPuzzle();		
	$("#sudokutext").html("<a target='_new' href='http://www.websudoku.com/?level="+$("#webSudokuLevel").val()+"'>WebSudoku</a> , difficulty: "+ $('#webSudokuLevel option:selected').text());
}

