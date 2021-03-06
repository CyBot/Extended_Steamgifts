// ==UserScript==
// @name        Extended Steamgifts
// @description	New features for Steamgifts.com
// @author		Nandee
// @namespace	esg
// @include		*steamgifts.com*
// @version		1.5.5
// @downloadURL	https://github.com/nandee95/Extended_Steamgifts/raw/master/Extended_Steamgifts.user.js
// @updateURL	https://github.com/nandee95/Extended_Steamgifts/raw/master/Extended_Steamgifts.user.js
// @supportURL  http://steamcommunity.com/groups/extendedsg/discussions/0/
// @icon        http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/a2/a24b43bb37dd0e732f97ba94708f0f006409ddb1_full.jpg
// @homepage    http://steamcommunity.com/groups/extendedsg
// @run-at		document-end
// @grant		none
// ==/UserScript==
/*
Changelog:
1.5.2[BETA] (03-24-2015)
- First release
1.5.3[BETA] (03-25-2015)
- Changed 'Miss' to 'Remove'
- Fixed enter button on profile page
- Blue line fixed behind the header
- Giveaway filter fix
- Dropdown menu fix
- Fixed Options (Scroll to top)
- Added description button
- Fixed problems with home page
- Changed some icons
1.5.4[BETA] (03-28-2015)
- Fixed problems with description button
- Fixed wishlist hightlight
- Added support for SGv2 Dark Theme
- Added hide entered giveaway feaure (default disabled)
- Redesigned Recommended sales (sidebar)
- Redesigned Active discussions (sidebar)
- Small bugfixes
- Redesigned wishlist highlight
1.5.5 (07-16-2015)
- Fixed font problem
- Fixed sidebar
- Fixed endless scrolling
- Fixed Wishlist - Featured giveaway problem
- Fixed chance problem with more than 1k copies giveaways
- Removed point refresh feature
- Removed recommended sales feature
- Changed icon
*/

this.GM_getValue=function (key,def) {
	return localStorage[key] || def;
};
this.GM_setValue=function (key,value) {
	return localStorage[key]=value;
};


//Styles
$("body").prepend("										\
<style>													\
.giveaway__chance										\
{														\
    display: block;										\
    padding-left: 5px;									\
    font-weight: bold;									\
    white-space: pre;									\
}														\
.sidebar__entry-custom									\
{														\
	display: inline-block;  							\
	margin: 0 -10px 0 -10px !important; 				\
	padding: 0 8px 0 8px !important;   					\
	min-width: 50px;									\
	font-family: 'Arial',sans-serif;  					\
	font-size: 11px;									\
	line-height: 26px;									\
}														\
.sale__img												\
{														\
	width:184px;										\
	height:69px;										\
}														\
.sales__line											\
{														\
	margin:5px;											\
	padding:0;											\
	border-bottom: 1px solid lightgray;					\
	width:300px;										\
}														\
.refresh__page											\
{														\
	cursor:pointer;										\
}														\
.wishlist-giveaway .giveaway__heading__name {   \
    color: #719A47 !important;   \
}   \
.wishlist-light .giveaway__row-inner-wrap {   \
	background: rgba(230,245,230,1.0) !important;   \
	-moz-box-shadow: 0 0 10px 10px rgba(240,255,240,1.0) !important;	\
	-webkit-box-shadow: 0 0 10px 10px rgba(240,255,240,1.0) !important;	\
    box-shadow: 0 0 10px 10px rgba(230,245,230,1.0) !important;	\
}   \
.wishlist-dark .giveaway__row-inner-wrap {   \
	background:rgba(45,50,45,1.0)!important;   \
	-moz-box-shadow: 0 0 10px 10px rgba(45,50,45,1.0) !important;	\
	-webkit-box-shadow: 0 0 10px 10px rgba(45,50,45,1.0) !important;	\
    box-shadow: 0 0 10px 10px rgba(45,50,45,1.0) !important;	\
}   \
.sidebar__navigation__item__discount 	\
{	\
	font-size:40px;	\
	font-weight:bold;	\
	width:100%;	\
	text-align:center;	\
}	\
.sidebar__navigation__item__image 	\
{	\
	width:184px;	\
	height:69px	\
}	\
.sidebar__navigation__item__oldprice	\
{	\
	text-decoration: line-through;	\
}	\
.sidebar__navigation__item__info	\
{	\
	width:116px;	\
	text-align:center;	\
	font-size: 15px;	\
	height:69px;	\
	margin-right:-2px;	\
}	\
.sidebar__navigation__itemz:hover .sidebar__navigation__item__underline{	\
	border-bottom:2px solid transparent !important;	\
}			\
.sidebar__navigation__item__title	\
{	\
	font-weight:bold;	\
	font-size: 15px;	\
}	\
.sidebar__navigation__itemz	\
{	\
	font-size: 13px;	\
}	\
</style>												\
");

//Read some values
var path = window.location.pathname;
var xsrf = $('input[type=hidden][name=xsrf_token]').val();
var loggedin = ($('.nav__sits').length > 0) ? false : true;
var totalpage = '?';
var currentpage = Number($('.pagination__navigation').find('.is-selected').attr('data-page-number'));
var hash = $(location).attr('hash');
var ver=GM_info.script.version;
var username=$(".nav__avatar-outer-wrap").attr("href").replace("/user/","");
var theme=$(".SGv2-Dark-button").find("span").text()=="Dark"?1:0

//Funcs
function getPos(str, m, i) {
	return str.split(m, i).join(m).length;
}

//Options
if (path.match('^/account/'))
{
	var options_selected=false,about_selected=false;
    $(".sidebar__navigation:last").after("  \
        <h3 class=\"sidebar__heading\">Extended Steamgifts</h3>   \
        <ul class=\"sidebar__navigation\">   \
        <li class=\"sidebar__navigation__item esg__options\">   \
        <a class=\"sidebar__navigation__item__link\" href=\"/account/profile/sync#esg_options\">   \
        <div class=\"sidebar__navigation__item__name\">Options</div>   \
        <div class=\"sidebar__navigation__item__underline\"></div>   \
        </a>   \
        </li>   \
        <li class=\"sidebar__navigation__item esg__about\">   \
        <a class=\"sidebar__navigation__item__link\" href=\"/account/profile/sync#esg_about\">   \
        <div class=\"sidebar__navigation__item__name\">About</div>   \
        <div class=\"sidebar__navigation__item__underline\"></div>   \
        </a>   \
        </li>   \
        </ul>");
    $(".esg__options").click(display_options);
    $(".esg__about").click(display_about);
    if(hash=="#esg_options")
        display_options();
    if(hash=="#esg_about")
        display_about();
}

window.onhashchange = function () {
	hash = $(location).attr('hash');
	if(hash=="#esg_options")
        display_options();
    if(hash=="#esg_about")
        display_about();
};

function display_options()
{
	document.title= "Account - Extended Steamgifts - Options";
	var page=$(".widget-container").children("div:last");
    page.empty();
	$(".sidebar__navigation__item").removeClass("is-selected");
    $(".fa-caret-right:first").remove();
    $(".esg__options").find(".sidebar__navigation__item__link").prepend("<i class=\"fa fa-caret-right\"></i>");
    $(".esg__options").addClass("is-selected");
	var content="";
	var count=0;
	function addToOptions(name,save,def)
	{
		count++;
		var val=Number(GM_getValue(save,def));
		content+="		\
			<div class=\"form__row\" value=\""+val+"\" key="+save+">   \
			<div class=\"form__heading\"><div class=\"form__heading__number\">"+count+".</div><div class=\"form__heading__text\">"+name+"</div></div><div class=\"form__row__indent\">   \
			<div class=\"form__checkbox cb__yes"+(val?" is-selected":"")+"\">   \
			<i class=\"form__checkbox__default fa fa-circle-o\"></i><i class=\"form__checkbox__hover fa fa-circle\"></i><i class=\"form__checkbox__selected fa fa-check-circle\"></i> Enabled   \
			</div>   \
			<div class=\"form__checkbox cb__no"+(val?"":" is-selected")+"\">   \
			<i class=\"form__checkbox__default fa fa-circle-o\"></i><i class=\"form__checkbox__hover fa fa-circle\"></i><i class=\"form__checkbox__selected fa fa-check-circle\"></i> Disabled   \
			</div>   \
			</div>   \
			</div>   \
			";
	}
	addToOptions("Enter/Remove button","esg_enterremove",1);
	addToOptions("Endless scrolling","esg_autoscroll",1);
	addToOptions("Display chances","esg_chances",1);
	addToOptions("Fixed header","esg_fixedheader",1);
	addToOptions("Hightlight wishlist","esg_wishlist",1);
	addToOptions("Scroll to top button","esg_scrolltop",1);
	addToOptions("Hide entered giveaways","esg_hideentered",0);
	page.html("				\
		<div class=\"page__heading\"> \
        <div class=\"page__heading__breadcrumbs\">   \
        <a>Extended Steamgifts</a>   \
        <i class=\"fa fa-angle-right\">   \
        </i><a href=\"/account/profile/sync#esg_options\">Options</a>   \
        </div></div>    \
		<form>						\																	\
		<div class=\"form__rows\">"+content+"																\
		<div value=\"\" class=\"form__submit-button\"><i class=\"fa fa-arrow-circle-right\"></i> Save Changes</div>	\
		</div>																								\
		</div>");
	$(".cb__yes").click(function () {
		$(this).addClass("is-selected").removeClass("is-disabled");
		$(this).parent().find(".cb__no").removeClass("is-selected").addClass("is-disabled");
		$(this).closest(".form__row").attr("value","1");
	});
	$(".cb__no").click(function () {
		$(this).addClass("is-selected").removeClass("is-disabled");
		$(this).parent().find(".cb__yes").removeClass("is-selected").addClass("is-disabled");
		$(this).closest(".form__row").attr("value","0");
	});
	$(".form__submit-button").click(function () {
		$(".form__row").each(function() {
			var val=$(this).attr("value");
			var key=$(this).attr("key");
			GM_setValue($(this).attr("key"),$(this).attr("value"));
		});
		alert("Settings are saved successfully!");
	});
}

function display_about()
{
	document.title= "Account - Extended Steamgifts - About";
	var page=$(".widget-container").children("div:last");
    page.empty();
	$(".sidebar__navigation__item").removeClass("is-selected");
    $(".fa-caret-right:first").remove();
    $(".esg__about").find(".sidebar__navigation__item__link").prepend("<i class=\"fa fa-caret-right\"></i>");
    $(".esg__about").addClass("is-selected");
	
	page.html("  \
            <div class=\"page__heading\"> \
            <div class=\"page__heading__breadcrumbs\">   \
            <a>Extended Steamgifts</a>   \
            <i class=\"fa fa-angle-right\">   \
            </i><a href=\"/account/profile/sync#esg_about\">About</a>   \
            </div></div>    \
            <div style=\"float:right;width:200px;text-align:center;margin-bottom:5px\">			\
			<span style=\"font-size:25px\">If you want to <br>support me:</span>\
			<form style=\"width: 150px;padding-left:25px;padding-top:10px;margin-bottom:-15px\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" target=\"_top\">   \
            <input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">   \
            <input type=\"hidden\" name=\"hosted_button_id\" value=\"M62RESN46NKWS\">   \
            <input style=\"border:none;padding:0;\" type=\"image\" src=\"https://raw.githubusercontent.com/nandee95/Extended_Steamgifts/master/img/buy_me_a_beer.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">   \
            <img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">   \
            </form> \<br><center style=\"font-size: 50px;font-weight:bold\">OR</center><br>	\
			<a target=\"_blank\" href=\"https://steamcommunity.com/tradeoffer/new/?partner=95793561&token=HxnczDWg\"><img src=\"https://raw.githubusercontent.com/nandee95/Extended_Steamgifts/master/img/steam_donate.png\"></a>			\
            </div>\
			<a style=\"margin: 10px auto 10px 250px; display:block;width:184px\" alt=\"Steam Profile\" href=\"http://steamcommunity.com/id/nandee95\">    \
            <img style=\"border-radius:15px;border:5px solid rgb(150,160,190)\" src=\"http://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/a6/a6ecd53808894e65e86192c6177ba167ad90fab3_full.jpg\">   \
            </a>    \
            <span style=\"margin:10px auto 10px 100px;display:block;font-weight:bold;font-size:30px\">Extended Steamgifts "+ver+" By: Nandee<br>    \
            </span>   \
            ");
}

//Recommended Sales & Active Discussions

if ((path == '/' || path=="/giveaways/")&& Number(GM_getValue("esg_autoscroll",1)))
{
	var c="";
	$(".table__rows:last").find(".table__row-outer-wrap").each(function () {

		var img = $(this).find(".global__image-inner-wrap").css('background-image');
		if(img)	img = img.replace('url(','').replace(')','').replace('"','').replace('"','');
		var site=$(this).find(".table__column__secondary-link:last").text();
		var siteimg="";
		var percent=$(this).find(".table__column--width-small:first").find("span").text();
		var wishlist=$(this).find(".fa-heart").length>0?true:false;

		var del=$(this).find("del");
		var before=$(del).text();
		var p=del.parent();
		$(del).remove();
		var after=$(p).text();
		var url=$(this).find("a:first").attr("href");
		var title=$(this).find(".table__column__heading").text();
		if(site=="Steam")
		{
			siteimg="http://steamcommunity.com//favicon.ico";
		}
		else if(site=="GamersGate")
		{
			siteimg="http://www.gamersgate.com/favicon.ico";
		}
		else if(site=="GreenManGaming")
		{
			siteimg="http://www.greenmangaming.com/static/favicon.ico";
		}
		var currency="",x=after.slice(-3)
		after=after.replace(" "+x,"");
		if(x=="GBP")
			currency="£";
		else if(x=="USD")
			currency="$";
		else if(x=="EUR")
			currency="€";
		else
			currency=x;
		//if(Math.random()<0.5)img="";
		c+='<li class="sidebar__navigation__itemz" title="'+title+'">	\
		<a class="sidebar__navigation__item__link" href="'+url+'">	\
			<span class="global__image-outer-wrap global__image-outer-wrap--game-medium '+(!img?'global__image-outer-wrap--missing-image':'')+'">	\
				'+(img?'<div class="global__image-inner-wrap" style="background-image:url('+img+');"><img src="'+siteimg+'">':'')+'\
				'+(!img?'<i class="fa fa-picture-o"></i>':'</div>')+'	\
			</span>	\
		<div class="sidebar__navigation__item__info sidebar__navigation__item__underline">	\
			<div class="sidebar__navigation__item__discount">'+percent+'</div>	\
			<i class="sidebar__navigation__item__oldprice">'+before+currency+'</i> -<i class="fa fa-caret-right"></i><i class="sidebar__navigation__item__newprice">'+after+currency+'</i>\
		</div>	\
		</a>	\
		</li>';
		/*
		
						'+(wishlist?'<span class="fa fa-heart icon-red" style="margin-left:195px;"></span>':'<span style="margin-left:195px;"></span>')+'	\
				<img style="display:block;margin:40px 0 0 168px;" src="'+siteimg+'">	\
		*/
	});
	var c2="";
	$(".page__heading__breadcrumbs:contains('Active Discussions')").closest(".page__heading").next()
	.find(".table__rows").find(".table__row-outer-wrap").each(function () {
		var img = $(this).find(".global__image-inner-wrap").css('background-image');
		img = img.replace('url(','').replace(')','').replace('"','').replace('"','');
		var title=$(this).find(".table__column__heading").text();
		var url=$(this).find(".table__column__heading").attr("href");
		var comments=$(this).find(".text-center").text();
		var info="x";//$(this).find(".table__column--width-fill").find("p").html();
		var topic=$(this).find(".table__column__secondary-link").eq(0).text();
		var owner=$(this).find(".table__column__secondary-link").eq(1).text();
		var created=$(this).find(".table__column__secondary-link").eq(0).closest("p").find("span").text();
		if(title.length > 30) title = title.substring(0,30)+"...";
		
		c2+='<li class="sidebar__navigation__itemz">	\
				<a class="sidebar__navigation__item__link" href="'+url+'">	\
					<i class="global__image-outer-wrap global__image-outer-wrap--avatar-small">	\
					<div class="global__image-inner-wrap" style="background-image:url('+img+');"></div></i>	\
					</div>	\
					<div class="sidebar__navigation__item__underline">	\
					<div class="sidebar__navigation__item__title">'+title+'</div>	\
					<i class="fa fa-comment" style="color:white;text-shadow:0px 1px #AAB5C6, 0px -1px #AAB5C6, 1px 0px #AAB5C6, -1px 0px #AAB5C6"></i> '+comments+' Comments<br>	\
					<span class="sidebar__navigation__item__name">'+topic+'</span> - '+created+' by <span class="sidebar__navigation__item__name">'+owner+'</span>	\
					</div>	\
				</a>	\
			</li>';
	});

	/*
	$(".sidebar__navigation:last").after('					\
	<h3 class="sidebar__heading">Recommended sales</h3>	\
	<ul class="sidebar__navigation">	\
	'+c+'\
	<li class="sidebar__navigation__item">		\
		<a class="sidebar__navigation__item__link" href="/sales">		\
		<div class="sidebar__navigation__item__name">More discounts</div>		\
		<div class="sidebar__navigation__item__underline"></div>		\
		</a>	\
	</li>		\
	</ul>	');
	*/
	if($(".page__heading__breadcrumbs:contains('Active Discussions')").length)
	{
		$(".sidebar__navigation:last").after('					\
		<h3 class="sidebar__heading">Active Discussions</h3>	\
		<ul class="sidebar__navigation">	\
		'+c2+'\
		<li class="sidebar__navigation__item">		\
			<a class="sidebar__navigation__item__link" href="/discussions">		\
			<div class="sidebar__navigation__item__name">More discussions</div>		\
			<div class="sidebar__navigation__item__underline"></div>		\
			</a>	\
		</li>		\
		</ul>	\
		')
	}
}

//Auto scroll
if ((path == '/' || path=="/giveaways/") && Number(GM_getValue("esg_autoscroll",1))) {
	var loading = false;
	var ms = 0;
	$('.page__heading:contains(Giveaways)').find('a').eq(0).append(' page ' + currentpage + '/' + totalpage);
	$('.pagination').remove();
	$('.widget-container--margin-top').remove();
	var page = currentpage;
	$(window).scroll(function () {
		if (!loading && $(window).scrollTop() + $(window).height() > $(document).height() - 1000) {
			$('.giveaway__row-outer-wrap:last').after('<div class="page__heading"><div class="page__heading__breadcrumbs"><a href="/">Giveaways page ' + (page + 1) + '/' + totalpage + '</a></div><div class="refresh__page" page="' + (page + 1) + '"><i class="fa fa-refresh fa-spin"></i></div></div>');
			loading = true;
			lastpage = false;
			ms = Date.now();
			$.ajax({
				url : 'http://www.steamgifts.com/giveaways/search?page=' + (page + 1),
				success : function (source) {
					$('.refresh__page:last').click(refresh_page);
					var htm = $(source).find('.widget-container').children('div:nth-child(2)');
					$($(htm).find('.giveaway__row-outer-wrap').get().reverse()).each(function (index) {
						if ($(this).closest(".pinned-giveaways").length==0&&$(this).closest(".pinned-giveaways__outer-wrap").length==0) {
							$(this).wrap('<div class="giveaway__row-outer-wrap"></div>');
							$('.page__heading:last').after($(this).parent().format_ga().html());
						}
					});
					var lt = (Date.now() - ms) / 1000;
					$('.page__heading__breadcrumbs:last').find('a').append('<span class=\'is-faded\' style=\'font-size:10px;margin-left:10px\'>' + lt + ' sec</span>');
					lastpage = (source.indexOf('<span>Next</span>') == -1)
					if (lastpage)
						totalpage = page;
					page++;
				},
				complete : function () {
					if (!lastpage) {
						loading = false;
					}
					$('.refresh__page:last').addClass('giveaway__column--group');
					$('.refresh__page:last').find('.fa-refresh').removeClass('fa-spin');
				}
			});
		}
	});
}

function refresh_page() {
	if (!$(this).hasClass('giveaway__column--group')) {
		return;
	}
	var refreshButton = $(this);
	refreshButton.removeClass('giveaway__column--group');
	refreshButton.find('.fa-refresh').addClass('fa-spin');
	var ms = Date.now();
	var page = $(this).attr('page');
	$.ajax({
		url : 'http://www.steamgifts.com/giveaways/search?page=' + page,
		success : function (source) {
			$(refreshButton).parent().nextUntil('.page__heading').remove();
			var htm = $(source).find('.widget-container').children('div:nth-child(2)');
			$($(htm).find('.giveaway__row-outer-wrap').get().reverse()).each(function (index) {
				if ($(this).closest(".pinned-giveaways").length==0&&$(this).closest(".pinned-giveaways__outer-wrap").length==0) {
					$(this).wrap('<div class="giveaway__row-outer-wrap"></div>');
					$(refreshButton).parent().after($(this).parent().format_ga().html());
				}
			});
			var lt = (Date.now() - ms) / 1000;
			$(refreshButton).parent().find('a').html('Giveaways page ' + page + '/' + totalpage + '<span class="is-faded" style="font-size:10px;margin-left:10px">' + lt + ' sec</span>');
		},
		complete : function () {
			$(refreshButton).addClass('giveaway__column--group');
			$(refreshButton).find('.fa-refresh').removeClass('fa-spin');
		}
	});
}

//Fixed header
if(Number(GM_getValue("esg_fixedheader",1)))
{
	$("header").css("position","fixed");
	$("header").css("width","100%");
	$("header").css("z-index","100");
	$("header").css("top","0");
	if($(".featured__container").length>0)
		$(".featured__container").css("margin-top","38px");
	else
		$(".page__outer-wrap").css("margin-top","38px").css("right","0");
}
//Giveaway function
var wishlist=new Array(),wlcount=0;
$.fn.format_ga = function () {
	return $(this).each(function() { 
	var ga = $(this).find('.giveaway__heading').parent().parent().parent();
	
	//Read some data
	var url = $(ga).find('.giveaway__heading__name').attr('href');
	var code = url.substring(getPos(url, '/', 2) + 1, getPos(url, '/', 3));
	
	var c = $(ga).find('.giveaway__heading__thin').text();
	var copies = 1,
	e = 0;
	if (c.indexOf('Copies') >  - 1) {
		copies = Number(c.substring(1, getPos(c, ' ', 1)).replace("(","").replace("(",""));
	}
	
	var entered = $(ga).find('.giveaway__row-inner-wrap').hasClass('is-faded');
	var e = $(ga).find('.giveaway__links').find('span:first').text().replace(/\,/g, '');
	e = e.substring(0, getPos(e, ' ', 1));
	var entries = Number(e);
	
	var chance = 0;
	if (entries <= 0)
		chance = 100;
	else
		chance = Math.round(copies / (entries+1) * 10000) / 100;
	if (chance > 100)
		chance = 100;
	
	var time=$(ga).find(".giveaway__columns").find("div:first");
	var active=1;
	if (time.text().indexOf('ago') >  - 1)
	{
		active=0;
	}
	
	var req=Number($(ga).find(".giveaway__heading__thin:last").text().replace("(","").replace(")","").replace("P",""));
	var has=Number($(".nav__points").text());
	var enough=req<=has?true:false;
	var user=$(ga).find(".giveaway__username").text();
	
	//Display chances
	if(Number(GM_getValue("esg_chances",1))||loggedin)
	{
		var color;
		if (chance == 100)
			color = "red";
		else
			color = 'rgb(' + Math.round(150 - chance) + ',' + Math.round(150 - chance) + ',' + Math.round(150 - chance) + ')';
		$(ga).find('.giveaway__heading').append('<span style="color:' + color + '" class="giveaway__chance">' + chance.toFixed(2) + '% chance</span>');
	}
	
	//Enter/Remove button
	if(Number(GM_getValue("esg_enterremove",1))&&loggedin&&active&&user!=username)
	{
		$(ga).find('.giveaway__row-inner-wrap').removeClass('is-faded');
		$(ga).find(".giveaway__columns").append("<form>   \
            <input type=\"hidden\" name=\"xsrf_token\" value=\""+xsrf+"\" />   \
            <input type=\"hidden\" name=\"do\" value=\"\" />   \
            <input type=\"hidden\" name=\"code\" value=\""+code+"\" />   \
            <div data-do=\"entry_insert\" class=\"sidebar__entry-custom sidebar__entry-insert"+(!entered&&enough?"":" is-hidden")+"\"><i class=\"fa fa-plus-circle\"></i> Enter</div>   \
            <div data-do=\"entry_delete\" class=\"sidebar__entry-custom sidebar__entry-delete"+(entered?"":" is-hidden")+"\"><i class=\"fa fa-minus-circle\"></i> Remove</div>   \
            <div class=\"sidebar__entry-custom sidebar__entry-loading is-hidden\"><i class=\"fa fa-refresh fa-spin\"></i> Wait</div>   \
			<div class=\"sidebar__entry-custom sidebar__error "+(!enough&&!entered?"":" is-hidden")+"\">"+(!enough&&!entered?"<i class=\"fa fa-exclamation-circle\"></i> Not enough points":"")+"</div>   \
            </form>");
	}
	//Highlight wishlisted
	if(Number(GM_getValue("esg_wishlist",1))&&loggedin&&$.inArray(url,wishlist)!=-1)
	{
        $(ga).addClass("wishlist-giveaway");
		if(theme)	$(ga).addClass("wishlist-dark");
		else		$(ga).addClass("wishlist-light");
		$(ga).find(".giveaway__heading__name").prepend("[WISHLIST] ");
	}
	
	//Description
	$(ga).find(".giveaway__hide").after("<i class=\"giveaway__icon fa fa-file-text-o open--desc\"></i>");
	
	//Hide entered
	if(Number(GM_getValue("esg_hideentered",0))&&entered)
	{
		$(ga).addClass("is-hidden");
	}
});
};

//Format giveaways (load)
$('.giveaway__row-outer-wrap').format_ga();

//Enter/Remove Button click
setTimeout(function () {
$(".sidebar__entry-insert, .sidebar__entry-delete").unbind("click");
$(document).on( 'click', '.sidebar__entry-insert, .sidebar__entry-delete', function () {
        var t = $(this);
        t.addClass("is-hidden"), t.closest("form").find(".sidebar__entry-loading").removeClass("is-hidden"), t.closest("form").find("input[name=do]").val(t.attr("data-do")), $.ajax({
            url: "/ajax.php",
            type: "POST",
            dataType: "json",
            data: t.closest("form").serialize(),
            success: function(e) {
                t.closest("form").find(".sidebar__entry-loading").addClass("is-hidden"), "success" === e.type ? t.hasClass("sidebar__entry-insert") ? t.closest("form").find(".sidebar__entry-delete").removeClass("is-hidden") : t.hasClass("sidebar__entry-delete") && t.closest("form").find(".sidebar__entry-insert").removeClass("is-hidden") : "error" === e.type && t.closest("form").find(".sidebar__error").removeClass("is-hidden").html("undefined" != typeof e.link && e.link !== !1 ? '<a href="' + e.link + '><i class="fa fa-exclamation-circle"></i> ' + e.msg + "</a>" : '<i class="fa fa-exclamation-circle"></i> ' + e.msg ), "undefined" != typeof e.entry_count && e.entry_count !== !1 && $(".live__entry-count").text(e.entry_count), $(".nav__points").text(e.points)
				if(Number(GM_getValue("esg_hideentered",0))&&"success" === e.type&&!t.closest(".sidebar__entry-delete").hasClass("is-hidden"))
				{
					$(t).closest(".giveaway__row-outer-wrap").hide("blind",{},500);
				}
				update_gas(e.points);
			}
        });
});
$(document).on( 'click', '.sidebar__error', function () {
	$(this).addClass("is-hidden").parent().find(".sidebar__entry-insert").removeClass("is-hidden");
});
},10);
function update_gas(p)
{
	if(p==-1)	p=Number($(".nav__points").text());
	$('.giveaway__row-outer-wrap').each(function () {
		var req=Number($(this).find(".giveaway__heading__thin:last").text().replace("(","").replace(")","").replace("P",""));
		var entered = !$(this).find(".sidebar__entry-delete").hasClass('is-hidden');
		if(req>p&&!entered)
		{
			$(this).find(".sidebar__entry-delete").addClass("is-hidden");
			$(this).find(".sidebar__entry-insert").addClass("is-hidden");
			$(this).find(".sidebar__entry-loading").addClass("is-hidden");
			$(this).find(".sidebar__error").removeClass("is-hidden").html('<i class="fa fa-exclamation-circle"></i> Not enough points');
		}
		else if(entered)
		{
			$(this).find(".sidebar__entry-delete").removeClass("is-hidden");
			$(this).find(".sidebar__entry-insert").addClass("is-hidden");
			$(this).find(".sidebar__entry-loading").addClass("is-hidden");
			$(this).find(".sidebar__error").addClass("is-hidden");
		}
		else
		{
			$(this).find(".sidebar__entry-delete").addClass("is-hidden");
			$(this).find(".sidebar__entry-insert").removeClass("is-hidden");
			$(this).find(".sidebar__entry-loading").addClass("is-hidden");
			$(this).find(".sidebar__error").addClass("is-hidden");
		}
	});
}

//Refresh points every sec
/*setInterval(function () {
	$.ajax({
		url: "/ajax.php",
		type: "POST",
		dataType: "json",
		data: "xsrf_token="+xsrf+"&do=entry_insert",
		success: function(e) {
			if($(".nav__points").text()!=e.points)
			{
				$(".nav__points").text(e.points);
				update_gas(e.points);
			}
		}
	});
},1000);
*/
//Hightlight wishlist
if(Number(GM_getValue("esg_wishlist",1))&&loggedin)
{
	$.ajax({
	url: "http://www.steamgifts.com/giveaways/search?type=wishlist",
	success: function(source) {    
		$(source).find(".giveaway__heading__name").each(function(index) {
			if($(this).closest(".pinned-giveaways").length==0&&$(this).closest(".pinned-giveaways__outer-wrap").length==0)
			{
				wishlist.push($(this).attr("href"));
				$("a[href='"+wishlist[wlcount]+"'][class=giveaway__heading__name]").prepend("[WISHLIST] ")
				var outer=$("a[href='"+wishlist[wlcount]+"'][class=giveaway__heading__name]").closest(".giveaway__row-outer-wrap");
				$(outer).addClass("wishlist-giveaway")
				if(theme)	$(outer).addClass("wishlist-dark");
				else		$(outer).addClass("wishlist-light");
				wlcount++;
		   }
		});
		var pnum=$(source).find("span:contains('Last')").closest('a').attr("data-page-number");
		for(var i=2;i<=Number(pnum);i++)
		{
			$.ajax({
				url: "http://www.steamgifts.com/giveaways/search?type=wishlist&page="+i,
				success: function(source) {    
					$(source).find(".giveaway__heading__name").each(function(index) {
						if($(this).closest(".pinned-giveaways").length==0&&$(this).closest(".pinned-giveaways__outer-wrap").length==0)
						{
							wishlist.push($(this).attr("href"));
							$("a[href='"+wishlist[wlcount]+"'][class=giveaway__heading__name]").prepend("[WISHLIST] ")
							var outer=$("a[href='"+wishlist[wlcount]+"'][class=giveaway__heading__name]").closest(".giveaway__row-outer-wrap");
							$(outer).addClass("wishlist-giveaway")
							if(theme)	$(outer).addClass("wishlist-dark");
							else		$(outer).addClass("wishlist-light");
							wlcount++;
						}
					});
				}});
		}
		}		
	});
}

//Scroll to top
if(Number(GM_getValue("esg_scrolltop",1)))
{	
	$("body").prepend("<div class=\"scroll-top form__submit-button\" style=\"cursor:pointer;position: fixed;bottom: 10px;right: 40px;padding:10px !important;size: 30px 30px;transform:rotate(-90deg);opacity:0.75;z-index:50\">></div>");
	$(".scroll-top").hide();
	$(".scroll-top").click(function () {
		$('html, body').animate({ scrollTop: 0 }, 'fast');	
	});
	var state=0;
	$(window).scroll(function () {
		var st=$(window).scrollTop();
		if(st>500&&!state)	
		{		
			$(".scroll-top").fadeIn("fast");
			state=1;
		}
		else if(st<=500&&state)
		{
			$(".scroll-top").fadeOut("fast");
			state=0;
		}
	});

}

//SGE menu
$(".nav__button[href|=\"/about/faq\"]").closest(".nav__button-container").before("	\
	<div class=\"nav__button-container\">		\
		<div class=\"nav__relative-dropdown is-hidden\">		\
			<div class=\"nav__absolute-dropdown\">		\
				<a class=\"nav__row\" target=\"_blank\" href=\"http://steamcommunity.com/groups/extendedsg\">		\
				<i class=\"icon-grey fa fa-fw fa-steam\"></i>		\
				<div class=\"nav__row__summary\">		\
					<p class=\"nav__row__summary__name\">Steam Group</p>		\
					<p class=\"nav__row__summary__description\">Open ESG steam group        \</p>		\
				</div>		\
				</a>		\
				<a class=\"nav__row\" href=\"/account/profile/sync#esg_options\">		\
				<i class=\"icon-grey fa fa-fw fa-cog\"></i>		\
				<div class=\"nav__row__summary\">		\
					<p class=\"nav__row__summary__name\">Options</p>		\
					<p class=\"nav__row__summary__description\">Open options        \</p>		\
				</div>		\
				</a>		\
				"+(ver.indexOf("BETA")>-1?"<a class=\"nav__row\" target=\"blank\" href=\"http://steamcommunity.com/groups/extendedsg/discussions/0/\">		\
				<i class=\"icon-red fa fa-fw fa-bug\"></i>		\
				<div class=\"nav__row__summary\">		\
					<p class=\"nav__row__summary__name\">Bug report</p>		\
					<p class=\"nav__row__summary__description\">Report bugs here!        \</p>		\
				</div>		\
				</a>":"")+"	\
				<a class=\"nav__row\" href=\"/account/profile/sync#esg_about\">		\
				<i class=\"fa fa-fw fa-info-circle\" style=\"color:lightblue\"></i>		\
				<div class=\"nav__row__summary\">		\
					<p class=\"nav__row__summary__name\">About</p>		\
					<p class=\"nav__row__summary__description\">Extended Steamgifts "+ver+"        \</p>		\
				</div>		\
				</a>		\
			</div>		\
		</div>		\
		<a class=\"nav__button nav__button--is-dropdown\" href=\"http://www.steamgifts.com/discussion/qbPEr/extended-steamgifts-browser-addon\">ESG</a>		\
		<div class=\"nav__button nav__button--is-dropdown-arrow\"><i class=\"fa fa-angle-down\"></i></div>		\
	</div>");

//Click event fix (part of original js)
$(document).on('click','.trigger-popup', function(){
        $("." + $(this).attr("data-popup")).bPopup({
            opacity: .85,
            fadeSpeed: 200,
            followSpeed: 500,
            modalColor: "#3c424d"
        })
});
$(document).on('click','.giveaway__hide', function(){
        $(".popup--hide-games input[name=game_id]").val($(this).attr("data-game-id")), $(".popup--hide-games .popup__heading__bold").text($(this).closest("h2").find(".giveaway__heading__name").text())
    });
$(document).on('click','nav .nav__button--is-dropdown-arrow', function(){
        var e = $(this).hasClass("is-selected");
        $("nav .nav__button").removeClass("is-selected"), $("nav .nav__relative-dropdown").addClass("is-hidden"), e || $(this).addClass("is-selected").siblings(".nav__relative-dropdown").removeClass("is-hidden"), t.stopPropagation()
    });
	
//View description button
var dsc_created=false;
$(".footer__outer-wrap").prepend('		\
	<div style="z-index: 9999" class="popup__desc-loading popup">		\
		<i class="popup__icon fa fa-spinner fa-spin"></i>		\
		<p class="popup__heading"><span class="popup__heading__bold">Loading ...</span></p>		\
		<p class="popup__actions">		\
			<span class="b-close">Close</span>		\
		</p>		\
	</div>		\
	<div style="z-index: 9999; max-width:1000px" class="popup__desc-display popup">		\
		<i class="popup__icon fa fa-file-text-o"></i>		\
		<p class="popup__heading"></p>		\
		<p class="popup__actions">		\
			<span class="b-close">Close</span>		\
		</p>		\
	</div>			\
	<div style="z-index: 9999; " class="popup__desc-error popup">		\
		<i class="popup__icon fa fa-exclamation-circle"></i>		\
		<p class="popup__heading"><span class="popup__heading__bold">No description found!</span></p>		\
		<p class="popup__actions">		\
			<span class="b-close">Close</span>		\
		</p>		\
	</div>');
$(document).on('click','.open--desc', function(){
		var t=$(this);
		var link=$(t).closest(".giveaway__row-outer-wrap").find(".giveaway__heading__name").attr("href");
		$(".popup__desc-loading").bPopup({
			opacity: .85,
			fadeSpeed: 200,
			followSpeed: 500,
			modalColor: "#3c424d",
			onClose: function() { 
				req.abort();
			}
		});
		var req=$.ajax({
				url : link,
				success : function (source) {
					var desc=$(source).find(".page__description").html();
					if(desc)
					{
						$(".popup__desc-display").find(".popup__heading").html('<span class="popup__heading__bold">Description:</span><br><div class=\"popup--content page__description\" style=\"word-break: break-all;text-align:left;\">'+desc+"</div>");
						$(".popup__desc-loading").find(".b-close").trigger("click");
						$(".popup__desc-display").bPopup({
							opacity: .85,
							fadeSpeed: 200,
							followSpeed: 500,
							modalColor: "#3c424d",
							onClose: function() { 
								req.abort();
							}
						});
					} else {
						$(".popup__desc-loading").find(".b-close").trigger("click");
						$(".popup__desc-error").find(".popup__heading__bold").text("No description found!");
						$(".popup__desc-error").bPopup({
							opacity: .85,
							fadeSpeed: 200,
							followSpeed: 500,
							modalColor: "#3c424d",
							onClose: function() { 
								req.abort();
							}
						});
					}
				},
				error : function () {
					$(".popup__desc-loading").find(".b-close").trigger("click");
					$(".popup__desc-error").find(".popup__heading__bold").text("Connection failed!");
					$(".popup__desc-error").bPopup({
							opacity: .85,
							fadeSpeed: 200,
							followSpeed: 500,
							modalColor: "#3c424d",
							onClose: function() { 
								req.abort();
							}
						});
				}
		});
});

//SGv2 Dark support
$(document).on("click",".themetoggle",function() {
	if($(this).find("span").text()=="Dark")
	{
		theme=1;
		$(".wishlist-light").addClass("wishlist-dark").removeClass("wishlist-light");
	}
	else
	{
		theme=0;
		$(".wishlist-dark").addClass("wishlist-light").removeClass("wishlist-dark");
	}
});
