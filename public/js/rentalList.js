(function ($) {
	// Make rows clickable
	$(".clickable-row").mouseup((event) => {
		let href = event.currentTarget.getAttribute("data-href");
		console.log(href);
		console.log(window.location);
		window.location = href;
	});
})(jQuery);

function fName(id, col) {
	let input, filter, table, row, i, txtValue;
	input = document.getElementById(id);
	filter = input.value.toUpperCase();
	rows = document.getElementsByClassName("clickable-row");
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
	no_table = document.getElementById("no-result");
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
	rows = document.getElementsByClassName("clickable-row");
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
	no_table = document.getElementById("no-result");
	if (c == 0) {
		table.hidden = true;
		no_table.hidden = false;
	} else {
		table.hidden = false;
		no_table.hidden = true;
	}
}

var bedn = document.getElementById("bedn");
var bedd = document.getElementById("bedd");
var bathn = document.getElementById("bathn");
var bathd = document.getElementById("bathd");
var pn = document.getElementById("pn");
var pd = document.getElementById("pd");
bedd.innerHTML = bedn.value;
bathd.innerHTML = bathn.value;
pd.innerHTML = pn.value;
bathn.oninput = function () {
	bathd.innerHTML = this.value;
};
bedn.oninput = function () {
	bedd.innerHTML = this.value;
};
pn.oninput = function () {
	pd.innerHTML = this.value;
};
