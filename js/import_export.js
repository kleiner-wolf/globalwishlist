var GlobalWishlist = GlobalWishlist || {};

GlobalWishlist.IO = (function(){
return {
	importListFromFile: function (jsonfile) {
		// load json
		$.getJSON(jsonfile, function(data) {
			for(var i=0; i<data.length; i++) {
				if(GlobalWishlist.Main.getList(data[i].name)!=0){
					GlobalWishlist.Main.deleteList(data[i].name);
				}
				
				if(GlobalWishlist.Main.getList(data[i].name)==0){
					GlobalWishlist.Main.createList(data[i].name);
					
					for(var j=0; j<data[i].items.length; j++){
						var item = data[i].items[j];
						GlobalWishlist.Main.addListItem(data[i].name, new GlobalWishlist.Main.listitem(item));
					}
				}
			}
			
			GlobalWishlist.Main.setActiveList(data[0].name);
		});
	},

	exportListToFile: function (jsonfile, lists) {
		// save GlobalWishlist.Main.lists
		
		/* create non cyclic object string*/
		var listText = "[";
		//var expList = [];
		for(i=0; i<lists.length; i++) {
			listText += "{";
			//var list = {};
			//list.name = lists[i].name;
			
			listText += '"name": "' + lists[i].name + '", "items":[';
			var item = lists[i].getFirst();
			while(item != null) {
				listText += JSON.stringify( item.getData() );
				if(item.getNext() != null) { listText += ","; }
				
				item = item.getNext();
			}
			
			listText += "]}";
			if(i!=lists.length-1) { listText += ","; };
			
		}
		listText += "]";
		
		//console.log(listText);
		
		$.ajax({
			type: "POST",
			dataType : 'json',
			async: false,
			url: 'http://localhost:8888/php/savejsonlist.php',
			data: { "data": listText, "filename": jsonfile },
			success: function () {alert("Thanks!"); },
			failure: function() {alert("Error!");}
		});
	},
	
	importItemFromISBNAmazon: function (isbn, list, country_code, async) {
		console.log("Fetching ISBN: " + isbn);
		if(async === undefined) { async = true; }
		
		$.ajax({
		  type: "POST",
		  url: "http://localhost:8888/php/amazonisbn.php",
		  //data: { "url" : "http://www.amazon.co.jp/dp/"+isbn+"/" },
		  data: { "url" : "http://www.amazon"+country_code+"/gp/product/black-curtain-redirect.html?ie=UTF8&redirect=true&redirectUrl=%2Fgp%2Fproduct%2F"+isbn+"/" },
		  async: async,
		  success: function(data){              
				// put the result into a div
				var $result = $("<div>").addClass("temp-result").hide();
				$result.append(data);
			
				var listitem = {};
				listitem.image = "db/images/" + isbn + ".jpg"
				listitem.name = $result.find("#productTitle").text();
				listitem.isbn = isbn;
				listitem.price = "0";
				listitem.note = "";
				listitem.fetchID = country_code;
					
				var image_url = $result.find("#booksImageBlock_feature_div #imgBlkFront").attr("src");
				if(image_url === undefined) {
					image_url = $result.find("#imageBlock_feature_div #landingImage").attr("src");
				}
				//console.log("Image:" + image_url);
				$.post("http://localhost:8888/php/imagegraber.php",
					{ "url" : image_url, "filename" : "../"+listitem.image},
					function(data){ 
						console.log("image loaded: " + image_url + " to File " + listitem.image);
						GlobalWishlist.Main.addListItem(list, new GlobalWishlist.Main.listitem(listitem));
					});
			}
		});
	},
	
	importItemsFromISBNList: function(filename, list) {
		$.get(filename,
			function (data) {
				//console.log(data);
				
				isbns = data.split("\n");
				//console.log(isbns);
			
				var country_code = isbns[0].replace("\r","");
				for(var i=1; i<isbns.length; i++){
					GlobalWishlist.IO.importItemFromISBNAmazon(isbns[i].replace("\r",""),list, country_code) ;

				}
			}
		);	
	}
};
})();