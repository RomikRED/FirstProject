// Apprise 1.5 by Daniel Raftery
// http://thrivingkings.com/apprise
//
// Button text added by Adam Bezulski
//

function apprise(string, args, callback) {
	var default_args = {
		'confirm'		:	false, 		// Ok and Cancel buttons
		'verify'		:	false,		// Yes and No buttons
		'input'			:	false, 		// Text input (can be true or string for default text)
		'inputVal'		:	false,		// Input value
		'inpuOnlyDouble':	false,		// Enable only number and point in input
		'animate'		:	false,		// Groovy animation (can true or number, default is 400)
		'selectText'	:	true,
		'textOk'		:	'Ok',		// Ok button default text
		'textCancel'	:	'Відмінити',	// Cancel button default text
		'textYes'		:	'Так',		// Yes button default text
		'textNo'		:	'Ні',		// No button default text
		'select'		:	false,       //add String of select to generate //example - 'select':"<select class ='aSelect'><option value = 0>Всі</option><option value = 2>Барком</option><option value = 1>Пекарня</option></select>"
									    // where class ='aSelect' need to style
										//if used select and input simultaneously calback return the next object: var {aText:'val', aVal:'text', selectVal:'val'};
		'table'			:	false       //dont return data,  example similar as select
	};
	if(args)  {
		for(var index in default_args) { 
			if(typeof args[index] == "undefined") args[index] = default_args[index]; 
		} 
	}
	var aHeight = $(document).height();
	var aWidth = $(document).width();
	$('body').append('<div class="appriseOverlay" id="aOverlay"></div>');
	$('.appriseOverlay').css('height', aHeight).css('width', aWidth).fadeIn(100);
	$('body').append('<div class="appriseOuter"></div>');
	$('.appriseOuter').append('<div class="appriseInner"></div>');
	$('.appriseInner').append(string);
    $('.appriseOuter').css("left", ( $(window).width() - $('.appriseOuter').width() ) / 2+$(window).scrollLeft() + "px");
    if(args) {
		if(args['animate']) {
			var aniSpeed = args['animate'];
			if(isNaN(aniSpeed)) { aniSpeed = 400; }
			$('.appriseOuter').css('top', '-200px').show().animate({top:"100px"}, aniSpeed);
		} else { $('.appriseOuter').css('top', '100px').fadeIn(200); }
	} else { $('.appriseOuter').css('top', '100px').fadeIn(200); }
    if(args) {
    	if(args['input']) {
    		if(typeof(args['input'])=='string') {
    			if(args['inputVal']){
    				$('.appriseInner').append('<div class="aInput"><input value = "'+args['inputVal']+'" type="text" class="aTextbox" t="aTextbox" id="weight" value="'+args['input']+'" /></div>');
    			}else{
    				$('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" id="weight" value="'+args['input']+'" /></div>');
    			}
    		} else {
    			if(args['inputVal']){
    				$('.appriseInner').append('<div class="aInput"><input value = "'+args['inputVal']+'" type="text" class="aTextbox" t="aTextbox" id="weight" /></div>');
    			}else{
    				$('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" id="weight" /></div>');
    			}
			}
			$('.aTextbox').focus();
			if(args['selectText']) {
	    		$('.aTextbox')[0].select();
	    	}
			if(args['inpuOnlyDouble']){
				$(".appriseInner input").keypress( function(e) {
					var temp = $(this).val().indexOf(".");
					var koma = false;
					if(e.which == 44){
						e.which=46
						koma = true;
					}
				    var chr = String.fromCharCode(e.which);
				    if ("1234567890.".indexOf(chr) < 0)
				        return false;
				    if(temp!=-1 && ".".indexOf(chr)!=-1){
				    	return false;
				    }
				    if($(this).val().length == 0 && ".".indexOf(chr)!=-1){
				    	return false
				    }
					if(koma){
						$(this).val($(this).val()+".")
						return false
					}
				});
			}
    	}
    	if(args['select']) {
    		$('.appriseInner').append('<div class="aSelectDiv">'+args['select']+'</div>');
    	}
    	if(args['table']) {
    		var appriseHeight = screen.height/1.8
    		$('.appriseInner').append('<div style = "max-height:'+appriseHeight+'px" class="aTableDiv">'+args['table']+'</div>');
    	}
    	
    }
    $('.appriseInner').append('<div class="aButtons"></div>');
    if(args) {
		if(args['confirm'] || args['input']) { 
			$('.aButtons').append('<button value="ok">'+args['textOk']+'</button>');
			$('.aButtons').append('<button value="cancel">'+args['textCancel']+'</button>'); 
		} else if(args['verify']) {
			$('.aButtons').append('<button value="ok">'+args['textYes']+'</button>');
			$('.aButtons').append('<button value="cancel">'+args['textNo']+'</button>');
		} else { $('.aButtons').append('<button value="ok">'+args['textOk']+'</button>'); }
	} else { $('.aButtons').append('<button value="ok">Ok</button>'); }
	$(document).keydown(function(e) {
		if($('.appriseOverlay').is(':visible')) {
			if(e.keyCode == 13) { $('.aButtons > button[value="ok"]').click(); }
			if(e.keyCode == 27) { $('.aButtons > button[value="cancel"]').click(); }
		}
	});
	var aText = $('.aTextbox').val();
	var aVal = $('.aTextbox').val();
	var selectVal =$('.aSelect').val();
	var obj={aText:aText, aVal:aVal, selectVal:selectVal};
	if(!aText) { aText = false; }
	$('.aTextbox').keyup(function() { aText = $(this).val(); });
    $('.aButtons > button').click(function() {
    	$('.appriseOverlay').remove();
		$('.appriseOuter').remove();
    	if(callback) {
			var wButton = $(this).attr("value");
			if(wButton=='ok') { 
				if(args) {
					var aTextboxVal=$(this).parent().parent().find('.aTextbox').val();
					var aTextboxtext=$(this).parent().parent().find('.aTextbox').text();
					var aSelectVal = $(this).parent().parent().find('.aSelect').val();
					var objAll ={aText:aTextboxVal, aVal:aTextboxtext, selectVal:aSelectVal};
					if(args['input'] && args['select']) {
							callback(objAll);					
					}else
					if(args['input']) {
						if(aText) {
							callback(aText, aText);
						} else {
							callback(aText, aVal);
						}
					} else 
						if(args['select']){
							callback(aSelectVal);
						}
					else { callback(true); }
				} else { callback(true); }
			} else if(wButton=='cancel')
				{ callback(false); }
			}
		});
	}
