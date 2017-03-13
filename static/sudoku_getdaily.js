var dailySudokuPrevDays =0;
$(function(){
		
	$(".getDailysudoku").on("click", function() {
		$("#sudokutext").text("");
		var type = $(this).attr("id");
		var date = new Date();
		loadedDataFunction = loadDailySudoku;
		if (type == "Today") {
			dailySudokuPrevDays=0;
		} else if (type=="Prev") {
			dailySudokuPrevDays++;
		} else if (type=="Next"){
			dailySudokuPrevDays--;
		}
		if (dailySudokuPrevDays) {
			date.setDate(date.getDate()  - dailySudokuPrevDays);
		}
		var url = "http://www.dailysudoku.com/cgi-bin/sudoku/get_board.pl?year="+
				date.getFullYear()+"&month="+(date.getMonth()+1)+"&day="+date.getDate()+"&type=";
		if (document.domain == "localhost") {
			sudokuDataUrlPrefx="";
			url = "test_html.html";
		}
		document.all["sudokuData"].src =sudokuDataUrlPrefx + url;
		var isdisabled = (dailySudokuPrevDays) ? null : "disabled";
		$("#Next.getDailysudoku").attr("disabled", isdisabled);
		
	});
});
function loadDailySudoku() {
	this.valuesGrid.clearPuzzle();
	var data = jQuery.parseJSON(document.all["sudokuData"].contentWindow.document.body.innerHTML);
	var dimSquare = dimension*dimension;
	for (var i=0;i<data.numbers.length;i++) {
		var row = Math.floor(i/dimSquare);
		var col = i%dimSquare;
		if (data.numbers[i] != ".") {
			this.valuesGrid.getCell(row,col).setValue(data.numbers[i]);
		}
	}	
	this.valuesGrid.saveAsPuzzle();		
	var difficulties = new Array();
	difficulties[4] = "very hard";
	difficulties[3] = "hard";
	difficulties[2] = "medium";
	difficulties[1] = "easy";
	$("#sudokutext").html("<a target='_new' href='http://www.dailysudoku.com'>"+data.title+"</a> , difficulty: "+ difficulties[data.difficulty]);

}

