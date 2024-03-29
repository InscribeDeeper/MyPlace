$(".clickable-row").mouseup((event) => {
	let href = event.currentTarget.getAttribute("data-href");
	console.log(href);
	console.log(window.location);
	window.location = href;
});

var rsb = document.getElementById$("rsb");
var rsd = document.getElementById("rsd");
var psb = document.getElementById("psb");
var psd = document.getElementById("psd");

rsd.innerHTML = rsb.value;
psd.innerHTML = psb.value;
rsb.oninput = function () {
	rsd.innerHTML = this.value;
};
psb.oninput = function () {
	psd.innerHTML = this.value;
};

function searchFromList(id, col) {
	let input, filter, table, row, i, txtValue;
	input = document.getElementById(id);
	filter = input.value.toUpperCase();
	let rows = document.getElementsByClassName("clickable-row");
	let c = 0;
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		txtValue = row.cells[col].innerHTML;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			row.style.display = "";
			c = c + 1;
		} else {
			row.style.display = "none";
		}
	}
	table = document.getElementsByClassName("m-5")[1];
	let no_table = document.getElementById("no-result");
	if (c == 0) {
		table.hidden = true;
		no_table.hidden = false;
	} else {
		table.hidden = false;
		no_table.hidden = true;
	}
}

function fNum(id, col, compareFn = (a, b) => a >= b) {
	let input, filter, table, row, i, txtValue;
	input = document.getElementById(id);
	filter = parseFloat(input.value);
	let rows = document.getElementsByClassName("clickable-row");
	let c = 0;
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		txtValue = parseFloat(row.cells[col].innerHTML);
		if (compareFn(txtValue, filter)) {
			row.style.display = "";
			c = c + 1;
		} else {
			row.style.display = "none";
		}
	}
	table = document.getElementsByClassName("m-5")[1];
	let no_table = document.getElementById("no-result");
	if (c == 0) {
		table.hidden = true;
		no_table.hidden = false;
	} else {
		table.hidden = false;
		no_table.hidden = true;
	}
}
