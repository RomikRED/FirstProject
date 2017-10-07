var tabContentContext;
var incorrectInput;
var activeElement;

var allShips=[];
var shipCategories=[];
var shipCategoriesTypes=[];
var shipCountries=[];
var shipCountriesNames=[];
var shipBattles=[];
var shipBattlesNames=[];
var shipOutcomes=[];

var cantBeEmptyShip=[];
var cantBeEmptyCategory=[];
var cantBeEmptyBattle=[];
var cantBeEmptyCountry=[];
var cantBeEmptyOutcomes=[];

var toDataBaseUpdate=[];
var toDataBaseInsert=[];
var toDataBaseRemove=[];

var addShipBtn = '<input type="button" class="button button-add" id="addShip" value="Add new SHIP"/>'
var addCategoryBtn = '<input type="button" class="button button-add" id="addCategory" value="Add new Category"/>'
var addBattleBtn = '<input type="button" class="button button-add" id="addBattle" value="Add new Battle"/>'
var addCountryBtn = '<input type="button" class="button button-add" id="addCountry" value="Add new Country"/>'
var addOutcomesBtn  = '<input type="button" class="button button-add" id="addOutcome" value="Add new Outcome"/>'
var submitBtn = '<input type="button" class="button" id="submit" value="Submit changes"/>'
var exportPDFBtn = '<input type="button" class="button" id="exp-pdf" value="Export PDF"/>'
var exportExcelBtn = '<input type="button" class="button" id="exp-xls" value="Export XLS"/>'


$(document).ready(function() {
	$('.content').css({'display' : 'none'});
	$('.tabcontent:eq(0)').css({'display' : 'block'});
	$('.tabs button:eq(0)').click();
	
	fillShipCountriesArray();
	fillShipCategoriesArray();
	fillShipBattlesArray();
});

function fillShipCountriesArray(){
	$.post('ListCountriesServlet', function(json) {
		shipCountries=[];
//		shipCountriesNames=[];
		$.each(json, function(indx, elem) {
			shipCountries[indx]= {id: elem.id, name: elem.name, agressor:elem.agressor };
//			shipCountriesNames = elem.name;
		});
	});
}

function fillShipCategoriesArray(){
	$.post('ListCategoriesServlet', function(json) {
		shipCategories=[];
//		shipCategoriesTypes=[];
		$.each(json, function(indx, elem) {
			shipCategories[indx] = {	
				id:			elem.id, 
				type:		elem.type, 
				guns:		elem.numGuns, 
				caliber:	elem.caliber, 
				tonnage:	elem.tonnage
			};
//			shipCategoriesTypes[indx] = elem.type;
		});
	});
}

function fillShipBattlesArray(){
	$.post('ShowBattlesServlet', function(json) {
		shipBattles=[];
//		shipBattlesNames=[];
		$.each(json, function(indx, elem) {
			shipBattles[indx]={
				id:			elem.id, 
				name:		elem.name, 
				date:		elem.date 
			};
//			shipBattlesNames[indx]=elem.name;
		});
	});
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!--SHIPS--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
$(document).on('click', '.tabs button:eq(0)', function() {
	tabContentContext = 'ship_Id'
	checkForSubmit();
	
	var involved ='.tabcontent:eq(0)'
	setDefaultView(0, involved)
	$(involved).html('<div id="divName"><h3>'+$(this).text()+'</h3> '+
			addShipBtn + submitBtn + exportPDFBtn + exportExcelBtn+' </div>')
	
	$.post('ShowShipsServlet', function(json) {
		cantBeEmptyShip.length=0;
		var table = '<table class="shipsList" id="idshipsList">';
			table += '<thead><tr>'	+
			'<th style="width:10%">'+	'Ship'					+'</th>'+
			'<th style="width:10%">'+	'Launched'				+'</th>'+
			'<th style="width:10%">'+	'Type'					+'</th>'+ 
			'<th style="width:15%">'+	'Guns, units'			+'</th>'+
			'<th style="width:20%">'+	'Weapon caliber, inch'	+'</th>'+
			'<th style="width:15%">'+	'Ship tonnage, t'		+'</th>'+
			'<th style="width:10%">'+	'Country'				+'</th>'+
			'<th style="width:2%" class="noExp">'				+'</th>'+//noExp - for not printing in XLSand PDF
			'</tr></thead><tbody>';	
		
		allShips.length=0;
		var rowId=0;
		$.each(json, function() {
			table+=	'<tr id="'+(rowId++)+'">'+
				'<td ship_Id="'+(this.id)+'" class="editable ship-name">'				+	this.name+				'</td>'+
				'<td maxlength="4" class="editable only-number ship-launched">' 		+	this.launched+			'</td>'+
				'<td category_id="'+(this.categoryId)+'" class="selectable category">' 	+ 	this.category.type+		'</td>'+
				'<td class="numGuns">'													+	this.category.numGuns+	'</td>'+
				'<td class="caliber">'													+	this.category.caliber+	'</td>'+
				'<td class="tonnage">'													+	this.category.tonnage+	'</td>'+
				'<td country_id="'+(this.countryId)+'"  class="selectable country">'	+	this.country.name+		'</td>'+
				'<td class="trash noExp">'+'<span class="tooltiptext">delete</span>'	+	'&#9746;'+				'</td></tr>';
			
			allShips.push({
				id		:this.id, 
				name	:this.name, 
				type	:this.category.type, 
				country	:this.country.name, 
				status	:this.country.agressor});
		});

		cantBeEmptyShip.push('ship-name','ship-launched','category','country');
		
		table += '</tbody></table>';
		$(involved).append(table);
		
		$('.shipsList').tablesorter({
	        headers: {7: {sorter: false}}
	    }); 
	});
});

$(document).on('click', '#addShip', function() {
	var emptyCell = findEmptyCell(cantBeEmptyShip); 
	if(emptyCell != null) { 
		emptyCell.dblclick();
		return;
	}
	
	var trId = (parseInt($('tr:last').attr('id'))+1);
	var newRow='<tr id="'+ trId +'row"		class="newRow">'+
		'<td ship_Id=""'		+' class="editable ship-name">'						+'--Name--'		+	'</td>'+
		'<td maxlength="4"'		+' class="editable only-number ship-launched">'		+'--Year--'		+	'</td>'+
		'<td category_id=""'	+' class="selectable category">'					+'--Type--'		+	'</td>'+
		'<td' 					+' class="numGuns">'								+''				+	'</td>'+
		'<td' 					+' class="caliber">'								+''				+	'</td>'+
		'<td' 					+' class="tonnage">'								+''				+	'</td>'+
		'<td country_id=""' 	+' class="selectable country">'						+'--Country--'	+	'</td></tr>';
	
	if(toDataBaseInsert.indexOf(trId)==-1){
		toDataBaseInsert.push(trId);
	}
	$('.shipsList tbody').append(newRow);
	$('.newRow :first').dblclick();
});


//-------EDIT addTextInputField to change values
$(document).on('dblclick', '.editable', function() {
	$('.approvable').focusout();
	var currValue=$(this).text();
	var currElem = $(this)

	var input = '<input type="text" placeholder="'+$(this).text()+'" maxlength="'+$(this).attr('maxlength')+'" style="width: 95%; height: 95%;" autofocus ';
	
	if($(this).hasClass('battle-date')){
		input += ' class="picker"/>';
		$(this).html(input);
		$('.picker').datepicker({
			    language: 	'ru',
			    position:	"bottom left",
			    autoClose: 	true,
			    dateFormat: 'yyyy-mm-dd',
			    minDate: 	new Date('1700-01-01'),
			    maxDate:	new Date(),
			    onHide: function(dp, animationCompleted){
			        if (animationCompleted) {
			        	var choised = currElem.children('input').val();
			        	if(choised==""){
			        		currElem.html(currValue);
			        	}else{
			        		currElem.html(currElem.children('input').val());
			        		toUpdate(currElem.parent().children().attr(tabContentContext));
			        	}
			        } 
			    }
		})
	}else{
		$(this).html((input += ' />'))
	}
	
	if($(this).hasClass('only-number')){
		$(this).ForceNumericOnly()
	}

	$(this).addClass('approvable')
	$(this).children().focus()
//	toUpdate($(this).parent().children().attr(tabContentContext));
})


//------SELECT addDropDownList of ship types/countries
$(document).on('dblclick', '.selectable', function() {
	$('.approvable').focusout()
	var select = '<select style="width: 98%; height: 98%;">'
	var currentText=$(this).text()
	
	if(currentText.includes('--')){
		select+='<option selected value="--">'+currentText+'</option>'
	}
	
	if($(this).hasClass('category')){
		$.each(shipCategories, function(){
			select+='<option '+(this.type==currentText?'selected':'')
			select+=' value="'+this.id+'">'+this.type+'</option>'
		})
	}else if($(this).hasClass('country')){
		$.each(shipCountries, function(){
			select+='<option '+(this.name==currentText?'selected':'')
			select+=' value="'+this.id+'">'+this.name+'</option>'
		})
	}else if($(this).hasClass('agressor')){
		var options = ['Agressor','Defender']
		$.each(options, function(){
			select+='<option '+(this==currentText?'selected ':' ')
			select+='value="'+this+'">'+this+'</option>'
		})
	}else if($(this).hasClass('result')){
		var options = ['sunk','damaged']
		$.each(options, function(){
			select+='<option '+(this==currentText?'selected':'')
			select+=' value="'+this+'">'+this+'</option>'
		})
	}else if($(this).hasClass('shipName')){
		$.each(allShips, function(){
			select+='<option '+(this.name==currentText?'selected':'')
			select+=' value="'+this.id+'">'+this.name+'</option>'
		})
	}else if($(this).hasClass('battleName')){
		$.each(shipBattles, function(){
			select+='<option '+(this.name==currentText?'selected':'')
			select+=' value="'+this.id+'">'+this.name+'</option>'
		})
	}
	
	$(this).html(select+'</select>')
	$(this).addClass('approvable')
})

$(document).on('focusout', '.approvable', function(){
	var currElemen = $(this)
	var needUpdate=false
	if(currElemen.hasClass('editable')){
		var inputed = currElemen.children().val()
		var placeholder = currElemen.children().attr('placeholder')
		
		if(currElemen.hasClass('only-number')){
			var min, max;
			switch(tabContentContext){
			case 'ship_Id':
				min = 1700; max= new Date().getFullYear();
				break;
			case 'category_Id':
				min = 1; max= 500;
				break;
			}
			
			if(!checkValidNumber(inputed, min, max)){
				apprise("Invalid data. The value should to be  between <<"+min+">> and <<"+max+">>", {'input':true}, function(response){
					if(response){
						if(checkValidNumber(response, min, max)){
							currElemen.html(response);
							needUpdate = true;
						}else{
							apprise("Invalid data. The value should to be  between <<"+min+">> and <<"+max+">>"+
									'<br>REMAINED OLD VALUE');
							currElemen.html(placeholder);
						}
					}
					else{	
						currElemen.html(placeholder);
					}
				});
			}else{
				currElemen.html(inputed);
				needUpdate = true;
			}
		}else if(currElemen.hasClass('battle-date')){
			//NOP 
		}else if(inputed != ''){
			currElemen.html(inputed);
			needUpdate = true;
		}else{
			currElemen.html(placeholder);
		}
		
		if(needUpdate){	toUpdate(currElemen.parent().children().attr(tabContentContext))}
		
	}else if(currElemen.hasClass('selectable')){
		currElemen.html(currElemen.find(':selected').text());
	}
	currElemen.removeClass('approvable');
});

$(document).on('change', '.selectable', function(){
	var currentRow = $(this).parent();
	var selected = $('option:selected').val();

	if($(this).hasClass('country')){
		$.each(shipCountries, function(){
			if(this.id == selected){
				currentRow.children('.country').attr('country_id', selected);
			}
		});
	} else if($(this).hasClass('category')){
		$.each(shipCategories, function(){
			if(this.id == selected){
				currentRow.children('.category').attr('category_id', selected);
				currentRow.children('.numGuns').text(this.guns);
				currentRow.children('.caliber').text(this.caliber);
				currentRow.children('.tonnage').text(this.tonnage);
			}
		});
	}else if($(this).hasClass('shipName')){
		$.each(allShips, function(){
			if(this.id == selected){
				currentRow.children('.shipName').attr('ship_Id', selected);
				currentRow.children('.shipType').text(this.type);//
				currentRow.children('.country').text(this.country);
				currentRow.children('.agressor').text((this.status?'Agressor':'Defender'));
			}
		});
	}else if($(this).hasClass('battleName')){
		$.each(shipBattles, function(){
			if(this.id == selected){
				currentRow.children('.battleName').attr('battle_Id', selected);
			}
		});
	}
	toUpdate(currentRow.children().attr(tabContentContext));
});

function toUpdate(updatableID){
	if(updatableID=='') { return }
	if(toDataBaseUpdate.indexOf(updatableID)==-1){ toDataBaseUpdate.push(updatableID) }
}

function findEmptyCell(cells){
var emptyCell = null;
	$.each(cells, function(){
		if($('.newRow .'+this).text().includes('--')){
			emptyCell = $('.newRow .'+this);
			return;
		}
	});
	
	if(emptyCell==null){
		$('.newRow').removeClass('newRow');
	}else{
		apprise('Please fill data in the last ROW the table!',{},function(){
			emptyCell.dblclick();
		});
	}
	return emptyCell;
}

$(document).on('click','.trash', function(){
	var elem = $(this).parent();
	var elemId = elem.children().attr(tabContentContext);
	apprise('Are you really want delete the row?',{'verify':true}, function(resp){
		if(resp){
			elem.css({'display': 'none'});
			if(toDataBaseRemove.indexOf(elemId)==-1){
				toDataBaseRemove.push(elemId);
			}
		}
	});
});

$(document).on('click', '#exp-xls', function() {
	exportExcel('.shipsList', 'Ships');
});

$(document).on('click', '#exp-pdf', function() {
	exportPDF('.shipsList', 'Ships');
});

function checkForSubmit(){
	if(toDataBaseUpdate.length>0 || toDataBaseInsert.length>0 || toDataBaseRemove.length>0){
		apprise('Submit changes?',{'verify':true}, function(resp){
			resp ? $('#submit').click(): eraseArraysToSubmit()
		})
	}
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!--CATALOGUE--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
$(document).on('click', '.tabs button:eq(1)', function() {
	var involved ='.tabcontent:eq(1)';
	setDefaultView(1, involved);
	var sub_buttons = 	'<div class="sub-tabs">'+
							'<button class="btn">Categories</button>'+
							'<button class="btn">Battles</button>'+
							'<button class="btn">Countries</button>'+
						'</div>';
	$(involved).html(sub_buttons);
	var sub_content = 	'<div class="sub_content"><h3>Categories</h3></div>'+
						'<div class="sub_content"><h3>Battles</h3></div>'+
						'<div class="sub_content"><h3>Countries</h3></div>';
	$(involved).append(sub_content);
	
	$('.sub_content').css({'display' : 'none'});
	$('.sub-tabs button:eq(0)').click();
});

//-------------CATEGORY
$(document).on('click', '.sub-tabs button:eq(0)', function() {
	tabContentContext = 'category_Id';
	checkForSubmit();
	
	$('.sub-tabs .btn').css({'background-color': 'inherit'});
	$(this).css({'background-color': '#ff8000'});
	$('.sub_content').css({'display' : 'none'});
	var involved ='.sub_content:eq(0)';
	$(involved).html('<div><h3>'+$(this).text()+'</h3>'+addCategoryBtn+submitBtn+'</div>');
	$(involved).css({'display' : 'block'});
	
	$.post('ListCategoriesServlet', function(json) {
		shipCategories=[];
		$.each(json, function(indx, elem) {
			shipCategories[indx] = {	
				id:			elem.id, 
				type:		elem.type, 
				guns:		elem.numGuns, 
				caliber:	elem.caliber, 
				tonnage:	elem.tonnage
			};
		});
		loadTableCategories(involved)
	});
});

function loadTableCategories(where){
	cantBeEmptyCategory.length=0;
	var tableCategories = '<table class="categoriesList"><thead><tr>'+
				'<th style="width:25%">'+	'Type'			+'</th>'+
				'<th style="width:25%">'+	'Guns, pcs'		+'</th>'+
				'<th style="width:25%">'+	'Caliber, inc'	+'</th>'+
				'<th style="width:20%">'+	'Tonnage, t'	+'</th>'+
				'<th style="width:2%" class="noExp">'		+'</th>'+//noExp - for not printing in XLS and PDF
				'</tr></thead><tbody>';
	
	var rowId=0;
	$.each(shipCategories, function(){
		tableCategories+='<tr id="'+(rowId++)+'">'+
		'<td category_Id="'+this.id+'" class="editable category-type">'		+	this.type		+'</td>'+
		'<td maxlength="3" class="editable only-number category-guns">'		+	this.guns		+'</td>'+
		'<td maxlength="3" class="editable only-number category-caliber">'	+	this.caliber	+'</td>'+
		'<td maxlength="4" class="editable only-number category-tonnage">'	+	this.tonnage	+'</td>'+
		'<td class="trash noExp"><span class="tooltiptext">delete</span>'	+	'&#9746;'		+'</td></tr>';
	});
	tableCategories += '</tbody></table>';

	cantBeEmptyCategory.push('category-type','category-guns','category-caliber', 'category-tonnage');
	$(where).append(tableCategories);
}

$(document).on('click', '#addCategory', function() {
	var emptyCell = findEmptyCell(cantBeEmptyCategory); 
	if(emptyCell != null) { 
		emptyCell.dblclick();
		return;
	}
	
	var trId = (parseInt($('tr:last').attr('id'))+1);
	var newRow='<tr id="'+ trId +'row"		class="newRow">'+
		'<td category_Id="" class="editable category-type">'				+'--Type--'		+	'</td>'+
		'<td maxlength="3" class="editable only-number category-guns">'		+'--Guns--'		+	'</td>'+
		'<td maxlength="3" class="editable only-number category-caliber">'	+'--Caliber--'	+	'</td>'+
		'<td maxlength="4" class="editable only-number category-tonnage">'	+'--Tonnage--'	+	'</td></tr>';
	
	if(toDataBaseInsert.indexOf(trId)==-1){
		toDataBaseInsert.push(trId);
	}
	$('.categoriesList tbody').append(newRow);
	$('.newRow :first').dblclick();
});

//-------------BATTLE
$(document).on('click', '.sub-tabs button:eq(1)', function() {
	tabContentContext = 'battle_Id';
	checkForSubmit();
	
	$('.sub-tabs .btn').css({'background-color': 'inherit'});
	$(this).css({'background-color': '#ff8000'});
	$('.sub_content').css({'display' : 'none'});
	var involved ='.sub_content:eq(1)';
	
	$(involved).html('<div><h3>'+$(this).text()+'</h3>'+addBattleBtn+submitBtn+'</div>');
	$(involved).css({'display' : 'block'});
	
	$.post('ShowBattlesServlet', function(json) {
		shipBattles=[];
		$.each(json, function(indx, elem) {
			shipBattles[indx]={
				id:			elem.id, 
				name:		elem.name, 
				date:		elem.date 
			};
		});
		loadTableBattles(involved);
	});
});

function loadTableBattles(where){
	cantBeEmptyBattle.length=0;
	var tableBattles = '<table class="battlesList"><thead><tr>'+
				'<th  style="width:25%">'+	'Name'			+'</th>'+
				'<th  style="width:25%">'+	'Date'			+'</th>'+
				'<th style="width:2%" class="noExp">'		+'</th>'+//noExp - for not printing in XLSand PDF
				'</tr></thead><tbody>';
	var rowId=0;
	$.each(shipBattles, function(){
		tableBattles+='<tr id="'+(rowId++)+'">'+
		'<td battle_Id="'+this.id+'" class ="editable battle-name">'		+	this.name				+'</td>'+
		'<td class="editable battle-date">'									+	(this.date).substr(0,10)+'</td>'+
		'<td class="trash noExp"><span class="tooltiptext">delete</span>'	+	'&#9746;'				+'</td></tr>';
	});
	tableBattles += '</tbody></table>';

	cantBeEmptyBattle.push('battle-name','battle-date');
	$(where).append(tableBattles);
}

$(document).on('click', '#addBattle', function() {
	var emptyCell = findEmptyCell(cantBeEmptyBattle); 
	if(emptyCell != null) { 
		emptyCell.dblclick();
		return;
	}
	
	var trId = (parseInt($('tr:last').attr('id'))+1);
	var newRow='<tr id="'+ trId +'row"		class="newRow">'+
		'<td battle_Id="" class="editable battle-name">'	+'--Battle NAME--'		+	'</td>'+
		'<td class="editable battle-date">'					+'--DATE--'				+	'</td></tr>';
	
	if(toDataBaseInsert.indexOf(trId)==-1){
		toDataBaseInsert.push(trId);
	}
	$('.battlesList tbody').append(newRow);
	$('.newRow :first').dblclick();
});

//-------------COUNTRY
$(document).on('click', '.sub-tabs button:eq(2)', function() {
	tabContentContext = 'country_Id';
	checkForSubmit();
	
	$('.sub-tabs .btn').css({'background-color': 'inherit'});
	$(this).css({'background-color': '#ff8000'});
	$('.sub_content').css({'display' : 'none'});
	var involved ='.sub_content:eq(2)';
	$(involved).html('<div><h3>'+$(this).text()+'</h3>'+addCountryBtn+submitBtn+'</div>');
	$(involved).css({'display' : 'block'});
	
	$.post('ListCountriesServlet', function(json) {
		shipCountries=[];
		$.each(json, function(indx, elem) {
			shipCountries[indx]= {id: elem.id, name: elem.name, agressor:elem.agressor };
		});
		loadTableCountries(involved);
	});
});

function loadTableCountries(where){
	cantBeEmptyCountry.length=0;
	var tableCountries = '<table class="countriesList"><thead><tr>'+
				'<th  style="width:3%">'				+	'id'		+'</th>'+
				'<th  style="width:25%">'				+	'Name'		+'</th>'+
				'<th  style="width:25%">'				+	'WarSide'	+'</th>'+
				'<th style="width:2%" class="noExp">'					+'</th>'+
				'</tr></thead><tbody>';
	var rowId=0;
	$.each(shipCountries, function(){
		tableCountries+='<tr id="'+(rowId++)+'">'+
//		'<td country_Id="'+this.id+'" class="editable country-name">'		+	this.name								+'</td>'+
//		'<td class="selectable agressor">'									+	(this.agressor?'Agressor':'Defender')	+'</td>'+
//		'<td class="trash noExp"><span class="tooltiptext">delete</span>'	+	'&#9746;'								+'</td></tr>';
		'<td>'	+	this.id	+	'</td>'+
		'<td country_Id="'+this.id+'" class="country-name">'+ this.name								+'</td>'+
		'<td class="agressor">'								+ (this.agressor?'Agressor':'Defender')	+'</td>'+
		'<td class="trash noExp"><span class="tooltiptext">delete</span>'	+	'&#9746;'								+'</td></tr>';
	});
	tableCountries += '</tbody></table>';

	cantBeEmptyCountry.push('country-name','agressor');
	$(where).append(tableCountries);
	
	$('.countriesList').Tabledit({
		hideIdentifier: true,
		columns: {
		  identifier: [0, 'id'],                    
		  editable: [[1, 'Name'], [2, 'WarSide']]
		}
	});

}

$(document).on('click', '#addCountry', function() {
	console.log('cantBeEmptyCountry '+cantBeEmptyCountry.length);
	var emptyCell = findEmptyCell(cantBeEmptyCountry); 
	if(emptyCell != null) { 
		emptyCell.dblclick();
		return;
	}
	
	var trId = (parseInt($('tr:last').attr('id'))+1);
	var newRow='<tr id="'+ trId +'row" class="newRow">'		+
		'<td country_Id="" class="editable country-name">'	+'--Country--'		+	'</td>'+
		'<td class="selectable agressor">'					+'--SIDE--'			+	'</td></tr>';
	
	if(toDataBaseInsert.indexOf(trId)==-1){
		toDataBaseInsert.push(trId);
	}
	$('.countriesList tbody').append(newRow);
	$('.newRow :first').dblclick();
});


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!--OUTCOMES--!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
$(document).on('click', '.tabs button:eq(2)', function() {
	tabContentContext = 'outcomes_Id';
	checkForSubmit();
	
	var involved ='.tabcontent:eq(2)';
	setDefaultView(2, involved);
	
	$(involved).html('<div id="divName"><h3>'+$(this).text()+'</h3> '+addOutcomesBtn + submitBtn+' </div>');
	
	$.post('ShowOutcomesServlet', function(json) {
		shipOutcomes=[];
		$.each(json, function(indx, elem) {
			shipOutcomes[indx]={
				id:			elem.id,
				battleId:	elem.battle.id, 
				battleName:	elem.battle.name, 
				shipId:		elem.ship.id, 
				shipName:	elem.ship.name, 
				type:		elem.ship.category.type, 
				country:	elem.ship.country.name, 
				agressor:	elem.ship.country.agressor,
				result:		elem.result
			};
		});
		loadTableOutcomes(involved);
	});
});

function loadTableOutcomes(where){
	cantBeEmptyOutcomes.length=0;
	var tableOutcomes = '<table class="outcomesList"><thead><tr>'+
				'<th  style="width:25%">'+	'Battle'	+'</th>'+
				'<th  style="width:20%">'+	'Ship'		+'</th>'+
				'<th  style="width:20%">'+	'Type'		+'</th>'+
				'<th  style="width:10%">'+	'Country'	+'</th>'+
				'<th  style="width:10%">'+	'Status'	+'</th>'+
				'<th  style="width:10%">'+	'Result'	+'</th>'+
				'<th style="width:5%" class="noExp">'	+'</th>'+//noExp - for not printing in XLSand PDF
				'</tr></thead><tbody>';
	var rowId=0;
	$.each(shipOutcomes, function(){
		tableOutcomes+='<tr id="'+(rowId++)+'">'+
		'<td outcomes_Id="'	+this.id	+'" battle_Id="'+this.battleId+'" class="selectable battleName">'	+	this.battleName	+'</td>'+
		'<td ship_Id="'		+this.shipId+'" class="selectable shipName">'		+	this.shipName							+'</td>'+
		'<td class="shipType">'													+	this.type								+'</td>'+
		'<td class="country">'													+	this.country							+'</td>'+
		'<td class="agressor">'													+	(this.agressor?'Agressor':'Defender')	+'</td>'+
		'<td class="selectable result">'										+	this.result								+'</td>'+
		'<td class="trash noExp"><span class="tooltiptext">delete</span>'		+	'&#9746;'								+'</td></tr>';
	});
	tableOutcomes += '</tbody></table>';

	cantBeEmptyOutcomes.push('battleName','shipName','result');
	$(where).append(tableOutcomes);
}

$(document).on('click', '#addOutcome', function() {
	var emptyCell = findEmptyCell(cantBeEmptyOutcomes); 
	if(emptyCell != null) { 
		emptyCell.dblclick();
		return;
	}
	
	var trId = (parseInt($('tr:last').attr('id'))+1);
	var newRow='<tr id="'+ trId +'row"		class="newRow">'+
		'<td outcomes_Id="" battle_Id=""'	+' class="selectable battleName">'	+'--Battle--'	+	'</td>'+
		'<td ship_Id=""'					+' class="selectable shipName">'	+'--Ship--'		+	'</td>'+
		'<td'								+' class="shipType">'				+''				+	'</td>'+
		'<td' 								+' class="country">'				+''				+	'</td>'+
		'<td' 								+' class="agressor">'				+''				+	'</td>'+
		'<td' 								+' class="selectable result">'		+'--Result--'	+	'</td></tr>';
	
	if(toDataBaseInsert.indexOf(trId)==-1){
		toDataBaseInsert.push(trId);
	}
	$('.outcomesList tbody').append(newRow);
	$('.newRow :first').dblclick();
});



//-------SUBMIT!
$(document).on('click', '#submit', function() {
	var searchEmptyHere; 
	switch(tabContentContext){
		case 'ship_Id'		:	searchEmptyHere = cantBeEmptyShip; break;
		case 'category_Id'	:	searchEmptyHere = cantBeEmptyCategory; break;
		case 'battle_Id'	:	searchEmptyHere = cantBeEmptyBattle; break;
		case 'outcomes_Id'	:	searchEmptyHere = cantBeEmptyOutcomes; break;
	}
	var emptyCell = findEmptyCell(searchEmptyHere); 
	if(emptyCell != null) { 
		emptyCell.dblclick();
		return;
	}
	$('.approvable').focusout();
	if(tabContentContext=='ship_Id'){
		$.post('UpdateShipsServlet', getShipsDataToUpdate(), function(resp){
			resp=='' ? apprise('There is nothing to submit'):apprise(resp);
			eraseArraysToSubmit();
			$('.tabs button:eq(0)').click();
		});
	}else if(tabContentContext=='category_Id'){
		$.post('UpdateCategoriesServlet', getCategoriesDataToUpdate(), function(resp){
			resp=='' ? apprise('There is nothing to submit'):apprise(resp);
			eraseArraysToSubmit();
			$('.sub-tabs button:eq(0)').click();
		});
	}else if(tabContentContext=='battle_Id'){
		$.post('UpdateBattlesServlet', getBattlesDataToUpdate(), function(resp){
			resp=='' ? apprise('There is nothing to submit'):apprise(resp);
			eraseArraysToSubmit();
			$('.sub-tabs button:eq(1)').click();
		});
	}else if(tabContentContext=='country_Id'){
		$.post('UpdateCountriesServlet', getCountriesDataToUpdate(), function(resp){
			resp=='' ? apprise('There is nothing to submit'):apprise(resp);
			eraseArraysToSubmit();
			$('.sub-tabs button:eq(2)').click();
		});
	}else if(tabContentContext=='outcomes_Id'){
		$.post('UpdateOutcomesServlet', getOutcomesDataToUpdate(), function(resp){
			resp=='' ? apprise('There is nothing to submit'):apprise(resp);
			eraseArraysToSubmit();
			$('.tabs button:eq(2)').click();
		});
	}
});

function getShipsDataToUpdate(){
	var shipsDataUpdate = [];
	$.each(toDataBaseUpdate, function() {
		var currRow=$('[ship_Id='+this+']').parent();
		shipsDataUpdate.push({
			id			: this, 
			name		: currRow.children('.ship-name').text(), 
			launched	: currRow.children('.ship-launched').text(), 
			categoryId	: currRow.children('.category').attr('category_id'),
			countryId	: currRow.children('.country').attr('country_id')});
	});
	
	var shipsDataInsert = [];
	$.each(toDataBaseInsert, function(){
		var currInsRow=$('#'+this+'row');
		if(currInsRow.children('.ship-name').attr('ship_Id')==''){
			shipsDataInsert.push({
				name		: currInsRow.children('.ship-name').text(), 
				launched	: currInsRow.children('.ship-launched').text(), 
				categoryId	: currInsRow.children('.category').attr('category_id'),
				countryId	: currInsRow.children('.country').attr('country_id')});
		}
	});
	
	var shipsDataRemove = [];
	$.each(toDataBaseRemove, function(){
		var checkIntegrity = this;
//		$.each(shipOutcomes, function(){		//TODO ADD integrity validation
//			if(this.shipId==checkIntegrity){
//				console.log('checkedIntegrity has broken');
//				return;
//			}else{
				shipsDataRemove.push({id: checkIntegrity});
//			}
//		});
	});
	
	return {listUpdate : JSON.stringify(shipsDataUpdate),
			listInsert : JSON.stringify(shipsDataInsert),
			listRemove : JSON.stringify(shipsDataRemove)};
}

function getCategoriesDataToUpdate(){
	var categoriesDataUpdate = [];
	$.each(toDataBaseUpdate, function() {
		var currRow=$('[category_Id='+this+']').parent();
		categoriesDataUpdate.push({
			id			: this, 
			type		: currRow.children('.category-type').text(), 
			numGuns		: currRow.children('.category-guns').text(), 
			caliber		: currRow.children('.category-caliber').text(),
			tonnage		: currRow.children('.category-tonnage').text()});
	});
	
	var categoriesDataInsert = [];
	$.each(toDataBaseInsert, function(){
		var currInsRow=$('#'+this+'row');
		if(currInsRow.children('.category-type').attr('category_Id')==''){//TODO Check for necessary it ask
			categoriesDataInsert.push({
				type		: currInsRow.children('.category-type').text(), 
				numGuns		: currInsRow.children('.category-guns').text(), 
				caliber		: currInsRow.children('.category-caliber').text(),
				tonnage		: currInsRow.children('.category-tonnage').text()});
		}
	});
	
	var categoriesDataRemove = [];
	$.each(toDataBaseRemove, function(){
		categoriesDataRemove.push({id: this});
	});
	
	return {listUpdate : JSON.stringify(categoriesDataUpdate),
			listInsert : JSON.stringify(categoriesDataInsert),
			listRemove : JSON.stringify(categoriesDataRemove)};
}

function getBattlesDataToUpdate(){
	var battlesDataUpdate = [];
	$.each(toDataBaseUpdate, function() {
		var currRow=$('[battle_Id='+this+']').parent();
		battlesDataUpdate.push({
			id			: this, 
			name		: currRow.children('.battle-name').text(), 
			date		: currRow.children('.battle-date').text()});
	});
	
	var battlesDataInsert = [];
	$.each(toDataBaseInsert, function(){
		var currInsRow=$('#'+this+'row');
		if(currInsRow.children('.battle-name').attr('battle_Id')==''){
			battlesDataInsert.push({
				name		: currInsRow.children('.battle-name').text(), 
				date		: currInsRow.children('.battle-date').text()});
		}
	});
	
	var battlesDataRemove = [];
	$.each(toDataBaseRemove, function(){
		battlesDataRemove.push({id: this});
	});
	
	return {listUpdate : JSON.stringify(battlesDataUpdate),
			listInsert : JSON.stringify(battlesDataInsert),
			listRemove : JSON.stringify(battlesDataRemove)};
}

function getCountriesDataToUpdate(){
	var countriesDataUpdate = [];
	$.each(toDataBaseUpdate, function() {
		var currRow=$('[country_Id='+this+']').parent();
		countriesDataUpdate.push({
			id			: this, 
			name		: currRow.children('.country-name').text(), 
			agressor	: (currRow.children('.agressor').text()=='Agressor')});
	});
	
	var countriesDataInsert = [];
	$.each(toDataBaseInsert, function(){
		var currInsRow=$('#'+this+'row');
		if(currInsRow.children('.country-name').attr('country_Id')==''){
			countriesDataInsert.push({
				name		: currInsRow.children('.country-name').text(), 
				agressor	: (currInsRow.children('.agressor').text()=='Agressor')});
		}
	});
	
	var countriesDataRemove = [];
	$.each(toDataBaseRemove, function(){
		countriesDataRemove.push({id: this});
	});
	
	return {listUpdate : JSON.stringify(countriesDataUpdate),
			listInsert : JSON.stringify(countriesDataInsert),
			listRemove : JSON.stringify(countriesDataRemove)};
}

function getOutcomesDataToUpdate(){
	var outcomesDataUpdate = [];
	$.each(toDataBaseUpdate, function() {
		var currRow=$('[outcomes_Id='+this+']').parent();
		outcomesDataUpdate.push({
			id			: this, 
			shipId		: currRow.children('.shipName').attr('ship_Id'),
			battleId	: currRow.children('.battleName').attr('battle_Id'),
			result		: currRow.children('.result').text()});
		console.log('outcomesDataUpdate shipId : '+currRow.children('.shipName').attr('ship_Id'));
	});
	
	var outcomesDataInsert = [];
	$.each(toDataBaseInsert, function(){
		var currInsRow=$('#'+this+'row');
		if(currInsRow.children('.battleName').attr('outcomes_Id')==''){
			outcomesDataInsert.push({
				shipId		: currInsRow.children('.shipName').attr('ship_Id'),
				battleId	: currInsRow.children('.battleName').attr('battle_Id'),
				result		: currInsRow.children('.result').text()});
		}
	});
	
	var outcomesDataRemove = [];
	$.each(toDataBaseRemove, function(){
		outcomesDataRemove.push({id: this});
	});
	
	return {listUpdate : JSON.stringify(outcomesDataUpdate),
			listInsert : JSON.stringify(outcomesDataInsert),
			listRemove : JSON.stringify(outcomesDataRemove)};
}


//-----------------------------ERASE CONTENT VIEW-----------------------------//
function setDefaultView(currentBtnNumb, currentContent){
	$('.tabcontent').css({'display' : 'none'});
	$('.btn').css({'background-color': 'inherit'});
	$('.btn:eq('+currentBtnNumb+')').css({'background-color': '#ff8000'});
	$(currentContent).html('');
	$(currentContent).css({'display' : 'block'});
}

function eraseArraysToSubmit(){
	toDataBaseUpdate.length = 0;
	toDataBaseInsert.length = 0;
	toDataBaseRemove.length = 0;
}

//-----------------------------EXP EXCEL-----------------------------//
function exportExcel(src, fileName) {  
    $(src).table2excel({  
    	exclude: ".noExp",
        name: "Table2Excel",  
        filename: fileName,  
        fileext: ".xls",
        exclude_img: true,
		exclude_links: true,
		exclude_inputs: true
    });  
}  

//-----------------------------EXP PDF-----------------------------//
function exportPDF(src, fileName){
	var colls=[], data=[]; 
	
	var headElem = $(src + ' th'); 
	$.each(headElem, function(){
		if(!$(this).hasClass('noExp')){
			colls.push($(this).text());
		}
//		console.log('headElem  ='+$(this).text())
	});

	var rowElem =$(src+' tbody  tr td');
	var collNums = colls.length;
	var rowNums = $("tbody  tr").length;
	for (var int = 0; int < rowNums; int++) {
		data.push(new Array(collNums));
	}
	
	var coll=0, row=0
	$.each(rowElem, function(){
		if (coll < collNums){
			if(!$(this).hasClass('noExp')){
				data[row][coll++]=$(this).text();
//				console.log('row: '+row+' collumn: '+coll+' DATA='+$(this).text())
			}	
		}else{
			coll = 0;
			row++;
		}
	});
	
	var doc = new jsPDF('p', 'pt')
	doc.autoTable(colls, data)
	doc.save(fileName+'.pdf')
}

jQuery.fn.ForceNumericOnly =
	function(){
	    return this.each(function(){
	        $(this).keydown(function(e){
	            var key = e.charCode || e.keyCode || 0;
	            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
	            // home, end, period, and numpad decimal
	            var keyPressed = (
		                key == 8 || 
		                key == 9 ||
		                key == 13 ||
		                key == 46 ||
		                key == 110 ||
		                key == 190 ||
		                (key >= 35 && key <= 40) ||
		                (key >= 48 && key <= 57) ||
		                (key >= 96 && key <= 105));
//	            keyPressed ? incorrectInput=false : incorrectInput=true;
	            return keyPressed;
	        });
	    });
	};

function checkValidNumber(value, min, max){
	if(value >= min && value <= max){
		return true;
	} else {
		return false;
	}
}
	
//$(document).on('keydown', '.approvable', function(e) {
//  if(incorrectInput) {
//	 $(this).css({'background-color': 'red'});
//  }else{
//	  $(this).css({'background-color': '#377ca2'});
//  }
//});	

//function validateName(lastedited, inputed, placeholder){
//	var child = lastedited.children();
//	if(inputed.length <= child.attr('maxlength') && inputed.length>1){
//		return inputed.substr(0,1).toUpperCase() + inputed.substr(1);
//	}else{
//		if(inputed.length<2) {
//			apprise('Too short Name. Please input Name NOT SHORTER than 2',{'input':true}, function(resp){
//				if(resp && resp.length > 1){
//					lastedited.html(resp.substr(0,1).toUpperCase() + resp.substr(1));
//				}
//			});
//		}
//		return placeholder;
//	}
//}

//function validateUniqueName(lastedited, inputed, placeholder){
//	var child = lastedited.children();
//	if(inputed.length <= child.attr('maxlength') && inputed.length>1){
//		
//		console.log('tabContentContext :'+ tabContentContext);
//		
//		var fieldName = 'Name', result;
//		switch(tabContentContext){
//			case 'category_Id':
//				result=inputed.substr(0,1).toUpperCase() + inputed.substr(1);
//				if($.inArray(result,shipCategoriesTypes)==-1){
//					return result;
//				}
//				fieldName = 'Type';
//			break;
//			case 'country_Id':
//				result=inputed.toUpperCase();
//				if($.inArray(result,shipCountriesNames)==-1){
//					return result;
//				}
//			break;
//			case 'battle_Id':
//				result=inputed.substr(0,1).toUpperCase() + inputed.substr(1);
//				if($.inArray(result,shipBattlesNames)==-1){
//					return result;
//				}
//			break;
//		}
//		apprise('NOT unique '+fieldName, {}, function(){
//			lastedited.html(placeholder);
//		});
//	}else if(inputed.length<2) {
//		apprise('Too short Name. Please input Name NOT SHORTER than 2', {}, function(){
//			lastedited.html(placeholder);
//		});
//	}
//}

// ------SEARCH
//function myFunction() {
//	var input, filter, table, tr, td, i;
//	input = document.getElementById("myInput");
//	filter = input.value.toUpperCase();
//	table = document.getElementById("myTable");
//	tr = table.getElementsByTagName("tr");
//	for (i = 0; i < tr.length; i++) {
//		td = tr[i].getElementsByTagName("td")[0];
//		if (td) {
//			if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
//				tr[i].style.display = "";
//			} else {
//				tr[i].style.display = "none";
//			}
//		}
//	}
//}

//new Date().getDate()          // Get the day as a number (1-31)
//new Date().getDay()           // Get the weekday as a number (0-6)
//new Date().getFullYear()      // Get the four digit year (yyyy)
//new Date().getHours()         // Get the hour (0-23)
//new Date().getMilliseconds()  // Get the milliseconds (0-999)
//new Date().getMinutes()       // Get the minutes (0-59)
//new Date().getMonth()         // Get the month (0-11)
//new Date().getSeconds()       // Get the seconds (0-59)
//new Date().getTime()          // Get the time (milliseconds since January 1, 1970)
