/* BrowserDetect came from http://www.quirksmode.org/js/detect.html */
var CONFIG = { debug: false
             , nick: "#"   // set in onConnect
             , id: null    // set in onConnect
             , last_message_time: 1
             , focus: true //event listeners bound in onConnect
             , unread: 0 //updated in the message-processing loop
             };

var nicks = [];

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

document.getElementById("brow").textContent = " " + BrowserDetect.browser + " "
	+ BrowserDetect.version +" " + BrowserDetect.OS +" ";

	var pos = 0;
function get_appropriate_ws_url()
{
	var pcol;
	var u = document.URL;
	var n;

	/*
	 * We open the websocket encrypted if this page came on an
	 * https:// url itself, otherwise unencrypted
	 */

	if (u.substring(0, 5) == "https") {
		pcol = "wss://";
		u = u.substr(8);
	} else {
		pcol = "ws://";
		if (u.substring(0, 4) == "http")
			u = u.substr(7);
	}

	u = u.split('/');
	n = u[0].split(':');
	if (n[1]) {
		return pcol + u[0];
	} else {
		return pcol + u[0]+':7681';
	}
}


document.getElementById("number").removeChild(document.getElementById("number").firstChild);
var i = 0;

/* dumb increment protocol */
	
	var socket_di;

	if (BrowserDetect.browser == "Firefox") {
		socket_di = new MozWebSocket(get_appropriate_ws_url(),
				   "lws-mirror-protocol");
	} else {
		socket_di = new WebSocket(get_appropriate_ws_url(),
				   "lws-mirror-protocol");
	}


	try {
		socket_di.onopen = function(evt) {
			CONFIG.id   = evt.timeStamp;
			document.getElementById("wsdi_statustd").style.backgroundColor = "#40ff40";
			document.getElementById("wsdi_status").textContent = " websocket connection opened ";
		}

		socket_di.onmessage =function got_packet(msg) {
			var msgd=msg.data;
			msgd = msgd.split(',');
			i = i + 1;
			var newLI = document.createElement("li");
			newLI.id = 'li_'+i;
			document.getElementById("number").appendChild(newLI);
			var newtxt = document.createTextNode(msgd[1]+' : '+msgd[2]+"\n");
			document.getElementById('li_'+i).appendChild(newtxt);
			var nick_obj = document.getElementById(msgd[0]);
			if (nick_obj) {
				document.getElementById(msgd[0]).firstChild.data=msgd[1];
			} else {
				var newLI = document.createElement("li");
				newLI.id = msgd[0];
				document.getElementById("nick_list").appendChild(newLI);
				var newtxt = document.createTextNode(msgd[1]);
				document.getElementById(msgd[0]).appendChild(newtxt);
			}
		}

		socket_di.onclose = function(){
			document.getElementById("wsdi_statustd").style.backgroundColor = "#ff4040";
			document.getElementById("wsdi_status").textContent = " websocket connection CLOSED ";
		}
	} catch(exception) {
		alert('<p>Error' + exception);  
	}

function socket_send() {
	txtsend = document.getElementById("txtinput").value
	socket_di.send(CONFIG.id+','+CONFIG.nick+','+txtsend);
}
function set_nick() {
	var nick
	nick = document.getElementById("nick").value
	CONFIG.nick = nick;
	socket_di.send(CONFIG.id+','+CONFIG.nick+','+'New Nick Name');
}

