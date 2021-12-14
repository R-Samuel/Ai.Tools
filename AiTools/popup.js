$(function(){
	//window.localStorage.clear();
		
	chrome.storage.local.get(['Dsummary','Dbalance','Dsales','Tsummary','Tbalance','Tsales','Thide'],function (data){
		 var DSummary = data.Dsummary;
		 var DBalance = data.Dbalance;
		 var DSales = data.Dsales;
		 var TSummary = data.Tsummary;
		 var TBalance = data.Tbalance;
		 var TSales = data.Tsales;
		 var THide = data.Thide;
		
		if (TSummary=='true')
		{
			$("#tsummary").attr("checked", true);

		}
		else
		{
			$("#tsummary").attr("checked", false);
		}
		
		if (TBalance=='true')
		{
			$("#tbalance").attr("checked", true);

		}
		else
		{
			$("#tbalance").attr("checked", false);
		}
		
		if (TSales=='true')
		{
			$("#tsales").attr("checked", true);

		}
		else
		{
			$("#tsales").attr("checked", false);
		}
		
		if (THide=='true')
		{
			$("#thide").attr("checked", true);
		}
		else
		{
			$("#thide").attr("checked", false);
		}
		
		$('#summary').val(DSummary);
		$('#balance').val(DBalance);
		$('#sales').val(DSales);
		
	});
	$('#save').click(function(){
		
		chrome.storage.local.set({'Dsummary': $('#summary').val()});
		chrome.storage.local.set({'Dbalance': $('#balance').val()});
		chrome.storage.local.set({'Dsales': $('#sales').val()});
		
		if ($("#tsummary").prop("checked")== true)
		{
			chrome.storage.local.set({'Tsummary': 'true'});
		}
		else
		{
			chrome.storage.local.set({'Tsummary': 'false'});
		}
		
		if ($("#tbalance").prop("checked")== true)
		{
			chrome.storage.local.set({'Tbalance': 'true'});
		}
		else
		{
			chrome.storage.local.set({'Tbalance': 'false'});
		}
		
		if ($("#tsales").prop("checked")== true)
		{
			chrome.storage.local.set({'Tsales': 'true'});
		}
		else
		{
			chrome.storage.local.set({'Tsales': 'false'});
		}
		
		if ($("#thide").prop("checked")== true)
		{
			chrome.storage.local.set({'Thide': 'true'});
		}
		else
		{
			chrome.storage.local.set({'Thide': 'false'});
		}
		
		window.self.close();
	});
	$('#clear').click(function(){
		chrome.storage.local.clear();
	});
});