/******* G E N E R A L *************************/
var dimension = 3;
var puzzleGrid = null;
var valuesGrid = null;

var helperStrategies = new Array();
var currentHelper = null;
var loadedDataFunction = null;
var sudokuDataUrlPrefx = "/sudoku?";
var dailySudokuPrevDays = 0;

/******* O B J E C T S *************************/

/***********************
 * G R I D
 ***********************/
function Grid(el) {
	this.grid = null;
	if (el == null) el = $("#grid");
	this.el = el;
	this.isSolved = false;
	// init
	this.grid = new Array(dimension * dimension);
	for ( var i = 0; i < this.grid.length; i++) {
		this.grid[i] = new Array(dimension * dimension);
		for ( var j = 0; j < this.grid.length; j++) {
			this.grid[i][j] = new Cell(i, j, this);
		}
	}
	// end init

	/***************** functions ****************/
	this.cloneValues = function() {
		var clonedGrid = new Grid();
		this.handleCells(function(cell) {
			if (cell.getValue() != null) {
				clonedGrid.getCell(cell.row, cell.col).setValue(cell.value);
			}
		});
		return clonedGrid;
	};
	// rendering the HTML
	this.render = function() {
		// rendering the tables
		var outerTable = this.renderTable(dimension, "outerTable");
		$(this.el).append(outerTable);
		outerTable = $(this.el).find("table");
		outerTable.attr("cellspacing", 0);
		outerTable.attr("cellpadding", 0);
		var outerCells = outerTable.find("td");
		for ( var i = 0; i < outerCells.length; i++) {
			var innerTable = this.renderTable(dimension, "innerTable");
			var tds = innerTable.find("td");
			for ( var j = 0; j < tds.length; j++) {
				var td = $(tds[j]);
				td.addClass("gridCell overrideCell");
				row = (Math.floor(i / dimension) * dimension) + Math.floor(j / dimension);
				col = ((i % dimension) * dimension) + (j % dimension);
				td.attr("id", this.el.attr("id")+"shell" + row + '' + col);
			}
			$(outerCells[i]).append(innerTable);
		}
		// rendering the cells
		this.handleCells(function(cell) {
			cell.render();
		});
		return this;
	};

	this.renderTable = function(dimension, className) {
		var table = $("<table class='" + className + "'>");
		for ( var i = 0; i < dimension; i++) {
			var currentRow = $("<tr>");
			table.append(currentRow);
			for ( var j = 0; j < dimension; j++) {
				currentRow.append('<td></td>');
			}
		}
		return table;
	};

	// saving puzzle data
	this.saveAsPuzzle = function() {
		puzzleGrid = new Grid();
		this.handleCells(function(cell) {
			if (cell.value != null) {
				puzzleGrid.getCell(cell.row, cell.col).setValue(cell.value);
				cell.setPuzzleData(cell.value);
			}
		});		
		this.resetHelpers();
		return this;
	};
	// resetting to last saved puzzle
	this.resetPuzzle = function() {
		this.handleCells(function(cell) {
			cell.clear();
			if (puzzleGrid) {
				var puzzleCell = puzzleGrid.getCell(cell.row, cell.col).getValue();
				if (puzzleCell != null) {
					cell.setPuzzleData(puzzleCell);
				}				
			}
		});
		this.resetHelpers();
		return this;
	};

	this.resetHelpers = function() {
		$("#autosweep").attr("checked", null);
		this.handleAutoSweep();
		$("#removeHelperBoard").trigger("click");
		helperStrategies["none"].use();
		return this;
	};
	// resetting to last saved puzzle
	this.clearPuzzle = function() {
		puzzleGrid = new Grid();
		this.handleCells(function(cell) {
			cell.clear();
		});
		this.resetHelpers();
		this.clearHelpers();
		return this;
	};
	// get a cell from the grid by location
	this.getCell = function(row, column) {
		try {
			return this.grid[row][column];			
		} catch (exc) {
			console.log("Exception: "+row+","+column);
		}
	};
	
	// returns all cells for a row/column or grid by index
	// TODO optimize
	this.getCellsByType = function(type, index) {
		var returnArray = new Array(dimension*dimension);
		if (type == "row") {
			returnArray = this.grid[index];
		} else if (type == "col") {
			for ( var i = 0; i < this.grid.length; i++) {
				returnArray[i] = this.grid[i][index];
			}
		} else if (type == "grid") {
			var i = 0;
			this.handleCells(function(cell) {
				if (cell.getProperty("grid") == index) {	
					returnArray[i++] = cell;
				}
			});
		}
		return returnArray;
	};


	// function that runs over all the cells with callback for each cell
	this.handleCells = function(callback) {
		for ( var i = 0; i < this.grid.length; i++) {
			for ( var j = 0; j < this.grid.length; j++) {
				callback(this.grid[i][j]);
			}
		}
	};
	// checks whether a cell value is valid considering its grid, row and column
	this.checkCellValidValue = function(cell, possibleOptionValue) {
		var isValid = this.checkValuesByType("grid", cell, possibleOptionValue);
		if (isValid) {
			isValid = this.checkValuesByType("row", cell, possibleOptionValue);			
		}
		if (isValid) {
			isValid = this.checkValuesByType("col", cell, possibleOptionValue);			
		}
		return isValid;
	};
	
	// checks whether value is valid in context of row/col or grid
	this.checkValuesByType = function(type, cell, possibleOptionValue) {
		var checkCells = this.getCellsByType(type, cell.getProperty(type));
		for (var i=0;i<checkCells.length;i++) {
			if (checkCells[i] != cell) {
				var checkVal = cell.getValue();
				if (possibleOptionValue != null) {
					checkVal = possibleOptionValue;
				}
				if (checkVal == checkCells[i].getValue()) {
					return false;
				}	
			}
		}
		return true;
	};
	// check whether puzzle os solved
	this.checkSolved = function() {
		if(this.isSolved) return;
		this.isSolved = true;
		var that = this;
		this.handleCells(function(cell) {
			if (cell.getValue() == null) {
				that.isSolved = false;
			}
		});	
		if (this.isSolved) {
			alert("Congrats. sudoku solved");
		}
	};
	
	// calculates allowed values for a cell with row/col/grid constraints
	this.handleAutoSweep = function(valueCell) {
		var isChecked  = ($("#autosweep").attr("checked") == "checked");
		if (valueCell == null) {
			var that = this;
			this.handleCells(function(cell) {
				if (cell.getValue() == null) {
					cell.clear();
					if (isChecked) {
						for (var i=1;i<=dimension*dimension;i++) {
							if(that.checkCellValidValue(cell, i)) {
								cell.setPossibleValue(i);
							};
						}
					}				
				}
			});			
		} else {
			this.handleCells(function(cell) {
				if (cell.getValue() == null) {
					if (isChecked) {
						if (cell.isInRange(valueCell) && 
								cell.isPossibleValue(valueCell.getValue())) {
							cell.setPossibleValue(valueCell.getValue());
						}
					}				
				}
			});						
		}
		return this;
	};

	this.clearHelpers = function() {
		$(".foundNumber").removeClass("foundNumber");
		$(".numberIneligble").removeClass("numberIneligble");
	}
}

/***********************
 * C E L L
 ***********************/
function Cell(row, col, parentgrid) {
	this.row = row;
	this.col = col;
	var rowGrid = Math.floor(row/dimension)*dimension;
	var colGrid = Math.floor(col/dimension);
	this.grid = ((rowGrid * 1) + colGrid);
	this.id = this.row + '' + this.col;
	this.value = null;
	this.possibleValues = new Array(dimension*dimension);
	this.element = null;
	this.isErrorData = false;
	this.parentgrid = parentgrid;

	this.render = function() {
		var placeHolder = $("#"+this.parentgrid.el.attr("id")+"shell" + this.id);
		placeHolder.append("<input type='text' size='1'>");
		this.element = placeHolder.find("input");
		this.element.attr("grid", this.grid);
		this.element.attr("row", this.row);
		this.element.attr("col", this.col);
		this.element.attr("id", this.id);
		this.element.addClass("cellInput overrideCellInput");
	};

	this.setValue = function(val) {
		this.value = val;
		if (this.element) {
			this.element.val(val);
		}
	};
	this.getValue = function() {
		if (this.isErrorData) return null;
		return this.value;
	};
	// cell whether this cell is on the path of another cell
	this.isInRange = function(checkCell) {
		if (checkCell.row == this.row) {
			return true;
		} else if (checkCell.col == this.col) {
			return true;
		} else if (checkCell.grid == this.grid) {
			return true;			
		}
		return false;
	};
	// add or remove a possible value from the cell
	this.setPossibleValue = function(val) {
		this.value = null;
		this.element.addClass("cellInputOptions");
		if (this.possibleValues[val]) {
			this.possibleValues[val] = null;			
		} else {
			this.possibleValues[val] = val;
		}
		this.element.val(this.possibleValues.join(""));
	};
	// check whether value has been set as a possible value
	this.isPossibleValue = function(val) {
		return (this.possibleValues[val] != null);
	};
	// get a specific path propertys
	this.getProperty = function(prop) {
		if (prop == "row") {
			return this.row;			
		} else if (prop == "col") {
			return this.col;
		} else if (prop == "grid") {
			return this.grid;
		}
		return null;
	};
	// set value for cell as puzzle data. cannot be changed
	this.setPuzzleData = function(value) {
		this.clear();
		this.element.addClass("puzzleCell");
		this.setValue(value);
	};
	// set value for cell as user entered cell solution
	this.setUserData = function(value) {
		this.clear();
		this.element.addClass("userCell");
		this.setValue(value);
		if (!this.checkValidValue()) {
			this.setError();
		} else {
			window.valuesGrid.handleAutoSweep(this);
			window.valuesGrid.checkSolved();
		}
	};
	// check whether the value entered is valid
	this.checkValidValue = function() {
		var val = this.getValue();
		if (val < 1 || val > dimension * dimension) {
			return false;
		} 
		return window.valuesGrid.checkCellValidValue(this);
	};
	// clears the cell from UI classes and data
	this.clear = function() {
		this.setValue(null);
		this.element.removeClass("cellInputOptions");
		this.element.removeClass();
		this.element.addClass("cellInput overrideCellInput");
		this.possibleValues = new Array(dimension*dimension);
	};
	this.removeError = function() {
		this.isErrorData = false;
		this.element.removeClass("errorCell");
	};
	this.setError = function() {
		this.isErrorData = true;
		this.element.addClass("errorCell");
	};
	this.toString = function() {
		return ("row: " + this.row+", col: "+this.col+", grid: " + this.grid + ", val: " + this.value);
	};
	this.getEl = function() {
		return this.element;
	};
	this.handleKeyboard = function(evt) {
		this.removeError();
		// handling numbers
		if (evt.which >= 49 && evt.which <= 58) {
			var num = evt.which - 48;
			if (!evt.shiftKey) {
				this.setUserData(num);
			} else {
				// have the control key. will check if this fields is in editable mode
				this.setPossibleValue(num);
			}
		} else if (evt.which == 8 || evt.which == 46) {
			// handling delete or backspace
			this.setValue(null);
		} else {
			// non numbers
			evt.preventDefault();
			return false;
		}
		if (currentHelper) {
			currentHelper.use();			
		}
		evt.preventDefault();
	};
}
/***********************
 * H E L P E R   N U M B E R
 ***********************/
function HelperNumber(num) {
	this.num = num;
	helperStrategies[this.num] = this;
	this.render = function() {
		$("#helperNumbers").append("<input type='button' class='helperNumber' value='"+(this.num)+"'>");
		if (this.num%dimension == 0) {
			$("#helperNumbers").append("<br>");
		}
		return this;
	};
	this.use = function() {
		// resetting
		window.valuesGrid.clearHelpers();
		
		var helperNumberType = $('input[name="helperNumberType"]:checked').val();
		var that = this;
		if (helperNumberType == "found") {
			// graying out all cells that already have found numbers
			$(".puzzleCell").addClass("numberIneligble");	
			$(".userCell").addClass("numberIneligble");
			window.valuesGrid.handleCells(function(cell) {
				if (cell.getValue() && cell.getValue() == that.num) {
					$("[row="+cell.getProperty("row")+"]").addClass("numberIneligble");	
					$("[col="+cell.getProperty("col")+"]").addClass("numberIneligble");	
					$("[grid="+cell.getProperty("grid")+"]").addClass("numberIneligble");
					// highlighting the current cell
					cell.getEl().removeClass("numberIneligble");
					cell.getEl().addClass("foundNumber");
				}			
			});		
		} else if (helperNumberType == "possibles") {
			window.valuesGrid.handleCells(function(cell) {
				if (cell.getValue() == null && cell.isPossibleValue(that.num)) {
					cell.getEl().addClass("foundNumber");
				}			
			});	
		} else {
			$(".currentHelperNumber").removeClass("currentHelperNumber");
		}
	};
}

/***********************
 * H E L P E R   N U M B E R
 ***********************/
function Strategy(name, solveMethod) {
	this.name = name;
	this.solveMethod = solveMethod;
	helperStrategies[this.name] = this;
	this.use = function() {
		window.valuesGrid.clearHelpers();
		this.solveMethod();
	};
};
var noStrategy = new Strategy("none", function(){});
// TODO optimize for any amount of combinations
var singleOptionsStrategy = new Strategy("singleoptions", function() {
	var clonedGrid = window.valuesGrid.cloneValues();
	clonedGrid.handleCells(function(cell) {
		if (cell.getValue() == null) {
			var found = 0;
			for (var i=1;i<=dimension*dimension;i++) {
				if(clonedGrid.checkCellValidValue(cell, i)) {
					found++;
					if (found > 1) {
						break;
					}
				};
			}
			if (found == 1) {
				window.valuesGrid.getCell(cell.row, cell.col).getEl().addClass("foundNumber");
			}
		}
	});	
});
// TODO optimize
var singleOptionsStrategy = new Strategy("onlynumberoption", function() {
	var clonedGrid = window.valuesGrid.cloneValues();
	for(var i=0; i<dimension*dimension;i++) {
		var cells = clonedGrid.getCellsByType("row", i);
		this.handleNumbers(i, cells, clonedGrid);
		cells = clonedGrid.getCellsByType("col", i);
		this.handleNumbers(i, cells, clonedGrid);
		cells = clonedGrid.getCellsByType("grid", i);
		this.handleNumbers(i, cells, clonedGrid);
	}
});
singleOptionsStrategy.handleNumbers = function(number, cells, clonedGrid) {
	var numbers = new Array();
	for (var i=0;i<dimension*dimension;i++) {
		numbers[i] = new Array();
	}
	// going through the cells
	for (var i=0;i<cells.length;i++) {
		if (cells[i].getValue() == null) {
			//going through the numbers
			for (var j=0;j<dimension*dimension;j++) {
				// it doesn;t matter how many more options we have than the one. done checking
				if (numbers[j].length > 1) continue;	
				// checking
				if(clonedGrid.checkCellValidValue(cells[i], (j + 1))) {
					numbers[j][numbers[j].length] = cells[i];
				};
			}
		}
	}
	for (var i=0;i<dimension*dimension;i++) {
		if (numbers[i].length == 1) {
			var el = window.valuesGrid.getCell(numbers[i][0].row, numbers[i][0].col).getEl();
			if (!el.hasClass("foundNumber")) {
				el.addClass("foundNumber");							
			}
		}
	}
	
};
/******* J Q U E R Y *************************/
$(function() {
	// init the UI grid
	if (valuesGrid == null) {
		valuesGrid = new Grid().render();
	}
	// init the helper number
	for (var i=1; i<=(dimension*dimension);i++) {
		new HelperNumber(i).render();
	}
	
	$("#savePuzzle").click(function() {
		valuesGrid.saveAsPuzzle();
	});
	$("#resetPuzzle").click(function() {
		valuesGrid.resetPuzzle();
	});
;
	$(".cellInput").live("change", function() {
		var cell = valuesGrid.getCell($(this).attr("row"), $(this).attr("col"));
		cell.setValue($(this).val());
	});
	$('.cellInput').live("keypress", function(evt) {
		var cell = valuesGrid.getCell($(this).attr("row"), $(this).attr("col"));
		cell.handleKeyboard(evt);
	});
	$('.cellInput').live("keydown", function(evt) {
		var cell = valuesGrid.getCell($(this).attr("row"), $(this).attr("col"));
		cell.handleKeyboard(evt);
	});
	$("#autosweep").click(function() {
		valuesGrid.handleAutoSweep();
	});
	$("#removeAutoSweep").click(function() {
		$("#autosweep").attr("checked", null);
		valuesGrid.handleAutoSweep();
	});
	// number from the helper number grid
	$(".helperNumber").click(function() {
		$(".currentHelperNumber").removeClass("currentHelperNumber");
		$(this).addClass("currentHelperNumber");
		currentHelper = helperStrategies[$(this).val()];
		currentHelper.use();
	});
	// change is the options to show for the number
	$('input[name="helperNumberType"]').click(function() {
		currentHelper = helperStrategies[$(".currentHelperNumber").val()];
		if (currentHelper) {
			currentHelper.use();			
		}
	});
	// change is the options to show for the number
	$('input[name="strategies"]').click(function() {
		$(".currentHelperNumber").removeClass("currentHelperNumber");
		currentHelper = helperStrategies[$(this).val()];
		if (currentHelper) {
			currentHelper.use();			
		}
	});
	$("#addHelperBoard").click(function() {
		addHelperGrid();
		$("#addHelperBoard").attr("disabled", "disabled");
		$("#removeHelperBoard").attr("disabled", null);
	});
	$("#removeHelperBoard").click(function() {
		$("#helpergrid").empty();
		$("#addHelperBoard").attr("disabled", null);
		$("#removeHelperBoard").attr("disabled", "disabled");
	});

	$(".gridA,.gridB").live("change", function() {
		var cells = $(".firstAlternativeCell");
		if (cells.length == 0) {
			$(this).parent().addClass("firstAlternativeCell");
			$(this).addClass("firstAlternativeCell");
		}
	});

	/*********** D A I L Y    S U D O K U   S U P P O R T  *******************/
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
		getDailySudoku(date);
		var isdisabled = (dailySudokuPrevDays) ? null : "disabled";
		$("#Next.getDailysudoku").attr("disabled", isdisabled);
		
	});


	initData();

});

/******** F U N C T I O N S ******************/

function getDailySudoku(date) {
	let urlPrefix = (document.domain === 'localhost') ? "test_html.html" : "/sudoku"
	$.ajax({
		url: urlPrefix  + "?type=daily&year=" + date.getFullYear() + "&month=" + (date.getMonth()+1) + "&day="+date.getDate()
	  }).done(function(response) {
		loadDailySudoku( jQuery.parseJSON(response));
	  });

}

function loadDailySudoku(data) {
	this.valuesGrid.clearPuzzle();
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

function addHelperGrid() {
	// building the outergrid
	var outerTable = new Grid("#helpergrid");
	var outerTableHTML = outerTable.renderTable(dimension, "outerTable");
	$("#helpergrid").append(outerTableHTML);
	// getting reference on page
	var outerCells = $("#helpergrid").find("table").find("td");
	for (var i=0;i<outerCells.length;i++) {
		var innerTable =  outerTable.renderTable(dimension, "innerTable");
		var tds = innerTable.find("td");
		for (var j=0;j<tds.length;j++) {
			var td = $(tds[j]);
			var row = (Math.floor(i/dimension) * dimension) + Math.floor(j/dimension);
			var col = ((i%dimension) * dimension) + (j%dimension);
			if (window.valuesGrid.getCell(row,col).getValue()) {
				td.append("<input type='text' size='1' class='puzzleCell' disabled value="+window.valuesGrid.getCell(row,col).getValue()+">");
			} else {
				td.append("<input type='text' size='1' class='gridA'>");
				td.append("<input type='text' size='1' class='gridB'>");
			}
		}
		$(outerCells[i]).append(innerTable);
	}
}

function initData() {
		getDailySudoku(new Date());
		/**
	valuesGrid.getCell(0, 0).setValue(1);
	valuesGrid.getCell(1, 1).setValue(2);
	valuesGrid.saveAsPuzzle();
	$("#sudokutext").html("test");
	**/
}




