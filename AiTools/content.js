var url = window.location.href;
var domain = url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];

var Hide = 0;

if (domain == 'ai.marketing' && url.indexOf('https://ai.marketing/user/') == 0) 
{
	Hide_Card();
	$.get("https://ai.marketing/service/api/v1/user/auth/session/", function (data) {
    if (data.success)
	{
		chrome.storage.local.get(['UserID','sales'], function(info) {
		if (typeof info.UserID === 'undefined')
		{
				var resetsales=[];
				salesbuff= [];
				chrome.storage.local.set({'sales': salesbuff});
				chrome.storage.local.set({'data': resetsales});
				chrome.storage.local.set({'UserID': data.data.user.userId});
		}
		else
		{
				var ID = info.UserID;
			
				if (ID!=data.data.user.userId)
				{
					var resetsales=[];
					salesbuff= [];
					chrome.storage.local.set({'sales': salesbuff});
					chrome.storage.local.set({'data': resetsales});
					chrome.storage.local.set({'UserID': data.data.user.userId});
				}
		}
		});
		
		setTimeout(function () {
                      get_summary();
                    }, 5000);

	}
	else 
	{

    }
  });
}

  function get_summary() 
  {
		chrome.storage.local.get(['Dsummary','summary','Tsummary'],function (data){
		var DSummary = data.Dsummary;
		var summarybuff = data.summary;
		var TSummary = data.Tsummary;

		$.get("https://ai.marketing/service/api/v1/user/robot/stat/summary/", function (Summary) 
		{
		  if (Summary.success)
		  {
          var Views = Summary.data.stat.advShows
		  var Visitors = Summary.data.stat.visitors
		  var Sales = Summary.data.stat.sales
		  var Budget = Summary.data.stat.investedToAdv
		  var Spent = Summary.data.stat.investedToAdvNow
		  var Profit = Summary.data.stat.earnedPercent
		  var Cashback = Summary.data.stat.earnedSum
		  var Status = Summary.data.stat.adv_campaigns_status
		  var LastMonth = Summary.data.stat.lastMonthProfit
				  
		  var message = 
		  '#####STATISTICS#####' + '\n'
		  +'Views : ' + Views + '\n' 
		  + 'Visitors : ' + Visitors + '\n' 
		  + 'Sales : ' + Sales + '\n' 
		  + 'Budget : ' + Budget + ' $' + '\n' 
		  + 'Spent : ' + Spent + ' $' + '\n'
		  + 'Profit : ' + Profit + ' %' + '\n'
		  + 'Cashback : ' + Cashback + ' $' + '\n'
		  + 'Last Month Profit : ' + LastMonth + ' $'
		  
		  if (summarybuff!=message)
		  {
		  console.log(message);
		  
		  if (TSummary=='true')
			{
			sendMessage(message,DSummary);
			}
			chrome.storage.local.set({'summary': message});
		  }
		  
		  console.log('Summary done');
		  
		  setTimeout(function () {
                      get_balance();
                    }, 3000);
		  }
		  else
		  {
			 window.location.href = 'https://ai.marketing/service/auth/google'; 
		  }
		});
	 });
}
  
var salesdata =[];
  
  function get_balance()
  {
	  chrome.storage.local.get(['Tbalance','Dbalance','balance','data'],function (data){
	  var TBalance = data.Tbalance;
	  var DStatistics = data.Dbalance;
	  var balancebuff = data.balance;
	  salesdata = data.data;
	  
	  $.get("https://ai.marketing/service/api/v1/user/wallet/balance/", function (Balance) 
		{
          var dispo = Balance.data.wallets.RES
          var attente = Balance.data.wallets.COP

          var attencours = Balance.data.additional_balances.calc_cop
          var attcashb = Balance.data.additional_balances.calc_res
          var nondep = Balance.data.additional_balances.unspend_adv_sum

          var protecenc = Balance.data.additional_balances.fundprotect_pending_sum
          var protecdisp = Balance.data.additional_balances.fundprotect_available_sum

          var message =
		  '#####MYADVERTISING#####' + '\n'
		  +'Cashback : ' + dispo + ' $' + '\n' 
		  + 'Pending : ' + attente + ' $' + '\n' 
		  + '\n' + '#####PREVIOUS CAMPAIGNS#####' + '\n'
		  + 'Previous Pending : ' + attencours + ' $' + '\n' 
		  + 'Previous Cashback : ' + attcashb + ' $' + '\n' 
		  + 'Previous Unspent : ' + nondep + ' $' + '\n'
		  + '\n' + '#####PROTECT#####' + '\n'
		  + 'Protect Pending : ' + protecenc + ' $' + '\n'
		  + 'Protect Available : ' + protecdisp + ' $'
		  
		  if (balancebuff!=message)
		  {
			console.log(message);
			if (TBalance=='true')
			{
			sendMessage(message,DStatistics);
			}
			chrome.storage.local.set({'balance': message});
		  }
		  
		  console.log('Balance done');
		  
		  })
		  setTimeout(function () {
					  Steps = 1;
					  salesDone=0;
                      get_sales();
                    }, 3000);
	  });
  }
  
var Steps = 1;
var salesDone = 0;
var refresh = 1*60*1000;


  function get_sales() 
 {
		$.ajax({
                type: "POST",
                url: "https://ai.marketing/service/api/v1/user/robot/stat/sales/",
                data: 
				{
                  page: Steps,
				  limit: 20,
                  userLang: "en"
                },
                datatype: 'json',
                success: function (response) 
				{
                  if (response.success === true)
				  {
                    var total = response.data.count;
					
					salesDone = salesDone+20;
					
					if ((salesDone<total)&(response.data.list.length!=0))
					{
						if ((salesdata==null)||(salesdata.length==0))
						{
							salesdata=[];
							
							for (let i = 0; i<response.data.list.length;i++)
							{
								salesdata.push(response.data.list[i]);
							}
							
							console.log(salesDone + '/' + total)
							Steps = Steps + 1
					
							setTimeout(function () 
							{
								get_sales();
							}, 1000);
						}
						else if (salesdata[0].id!=response.data.list[0].id)
						{
							for (let i = 0; i<response.data.list.length;i++)
							{
								if (!salesdata.includes(response.data.list[i]))
								{
									salesdata.push(response.data.list[i]);
								}
							}
						
							console.log(salesDone + '/' + total)
							Steps = Steps + 1
					
							setTimeout(function () 
							{
								get_sales();
							}, 1000);
						}
						else
						{
							salesDone=total;
							
							if (salesdata.length>40)
							{
								salesdata = salesdata.slice(0,40);
							}
							chrome.storage.local.set({'data': salesdata});
						
							console.log('Sales done');
							check_sales(salesdata);
							console.log('Next Refresh :'+(refresh/1000)/60+' min');
							chrome.storage.local.set({'steps': total});
						
							setTimeout(function () 
							{
								Steps = 1;
								get_summary();
							}, refresh);
						}
					}
					else
					{
						salesDone=total;
						if (salesdata.length>40)
						{
							salesdata = salesdata.slice(0,40);
						}
						chrome.storage.local.set({'data': salesdata});
						
						console.log('Sales done');
						check_sales(salesdata);
						console.log('Next Refresh :'+(refresh/1000)/60+' min');
						chrome.storage.local.set({'steps': total});
						
						setTimeout(function () 
						{
						Steps = 1;
						get_summary();
						}, refresh);
					}
				  }
				  else 
				  {
                    console.log('Refreshing...')
                    Steps = Steps - 1;
                    setTimeout(function () 
					{
                      get_sales();
                    }, 3000);
                  }
				}
              });
}
	
	function sendMessage(Msg, webhook) {

      const request = new XMLHttpRequest();
      request.open("POST", webhook);

      request.setRequestHeader('Content-type', 'application/json');

      const params = {
        username: "",
        avatar_url: "",
        content: Msg
	  }
      request.send(JSON.stringify(params));
    }
	
	function export2txt(originalData) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(originalData, null, 2)], {
    type: "text/plain"
  }));
  a.setAttribute("download", "data.txt");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


var salesbuff= [];

function check_sales(sales)
{
	
	chrome.storage.local.get(['Tsales','Dsales','sales'],function (data){
	var TSales = data.Tsales;
	var DSales = data.Dsales;
	
	if (data.sales!=null)
	{
		salesbuff = data.sales;
	}
	
	var tosend = new Array();
	
	if (salesbuff.length==0)
	{
		for (let i=0;i<sales.length;i++)
		{
			tosend.push('+'+sales[i].sum +' $ ≈'+'('+sales[i].cashback_percent+'% from '+sales[i].full_buy_sum+' $)');
		}
		
		salesbuff=sales;
	
		if ((tosend.length!=0)&(TSales=='true'))
		{
			var message = tosend.join('\n');
			sendMessage(message,DSales);
			console.log('Discord Sent');
		}
		chrome.storage.local.set({'sales': salesbuff});
	}
	else
	{
		if (salesbuff[0].id!=sales[0].id)
		{
			for (let i=0;i<sales.length;i++)
			{
			tosend.push('+'+sales[i].sum +' $ ≈'+'('+sales[i].cashback_percent+'% from '+sales[i].full_buy_sum+' $)');
			}
		
			salesbuff=sales;
	
			if ((tosend.length!=0)&(TSales=='true'))
			{
			var message = tosend.join('\n');
			sendMessage(message,DSales);
			console.log('Discord Sent');
			}
			chrome.storage.local.set({'sales': salesbuff});
		}
	}
});
}

function Hide_Card()
{
	chrome.storage.local.get('Thide', function(info) {
		if (info.Thide=='true')
		{
			$('.balance').hide();
		}
		else
		{
			$('.balance').show();
		}
	});
	setTimeout(function () 
					{
                      Hide_Card();
                    }, 1000);
}