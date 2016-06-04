var GlobalWishlist = GlobalWishlist || {};

GlobalWishlist.IO = (function(){
	var php_folder_location = "http://localhost:8888/php/";

	var importListFromFile = function (jsonfile) {
		// load json
		$.getJSON("db/"+jsonfile, function(data) {
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
	};

	var exportListToFile = function (jsonfile, lists) {
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
			url: php_folder_location + 'savejsonlist.php',
			data: { "data": listText, "filename": "db/"+jsonfile },
			success: function () {alert("Thanks!"); },
			failure: function() {alert("Error!");}
		});
	};
	
	var importItemFromISBNAmazon = function (isbn, list, country_code, async) {
		console.log("Fetching ISBN: " + isbn);
		if(async === undefined) { async = true; }
		
		$.ajax({
		  type: "POST",
		  url: php_folder_location + "amazonisbn.php",
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
				listitem.price = "-";
				listitem.note = "";
				listitem.fetchID = country_code;
					
				console.log( $result.find("span.offer-price").first().text() );
				
				if( $result.find("span.offer-price").length > 0 ) {
					listitem.price = $result.find("span.offer-price").first().text();
				}
				
				var image_url = $result.find("#booksImageBlock_feature_div #imgBlkFront").attr("src");
				if(image_url === undefined) {
					image_url = $result.find("#imageBlock_feature_div #landingImage").attr("src");
				}
				//console.log("Image:" + image_url);
				$.post(php_folder_location+"imagegraber.php",
					{ "url" : image_url, "filename" : "../"+listitem.image},
					function(data){ 
						console.log("image loaded: " + image_url + " to File " + listitem.image);
						GlobalWishlist.Main.addListItem(list, new GlobalWishlist.Main.listitem(listitem));
					});
			}
		});
	};
	
	var importItemsFromISBNList = function(filename, list) {
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
	};
	
	var updateItemFromISBNAmazon = function (list, item, async) {
		console.log("Fetching ISBN: " + item.isbn);
		if(async === undefined) { async = true; }
		
		$.ajax({
		  type: "POST",
		  url: php_folder_location + "amazonisbn.php",
		  //data: { "url" : "http://www.amazon.co.jp/dp/"+isbn+"/" },
		  data: { "url" : "http://www.amazon"+item.fetchID+"/gp/product/black-curtain-redirect.html?ie=UTF8&redirect=true&redirectUrl=%2Fgp%2Fproduct%2F"+item.isbn+"/" },
		  async: async,
		  success: function(data){              
				// put the result into a div
				var $result = $("<div>").addClass("temp-result").hide();
				$result.append(data);
			
				var listitem = {};
				listitem.image = "db/images/" + item.isbn + ".jpg"
				listitem.name = $result.find("#productTitle").text();
				listitem.isbn = item.isbn;
				listitem.price = "-";
				listitem.note = "";
				listitem.fetchID = item.fetchID;
					
				console.log( $result.find("span.offer-price").first().text() );
				
				if( $result.find("span.offer-price").length > 0 ) {
					listitem.price = $result.find("span.offer-price").first().text();
				}
				
				console.log(listitem);
				/*
				var image_url = $result.find("#booksImageBlock_feature_div #imgBlkFront").attr("src");
				if(image_url === undefined) {
					image_url = $result.find("#imageBlock_feature_div #landingImage").attr("src");
				}
				//console.log("Image:" + image_url);
				
				
				$.post(php_folder_location+"imagegraber.php",
					{ "url" : image_url, "filename" : "../"+listitem.image},
					function(data){ 
						console.log("image loaded: " + image_url + " to File " + listitem.image);
						GlobalWishlist.Main.addListItem(list, new GlobalWishlist.Main.listitem(listitem));
					}
				);
				*/
				
				GlobalWishlist.Main.updateListItem(list, item.id, listitem);
			}
		});
	};
	
	return {
		importListFromFile: importListFromFile,
		exportListToFile: exportListToFile,
		importItemFromISBNAmazon: importItemFromISBNAmazon,
		importItemsFromISBNList: importItemsFromISBNList,
		updateItemFromISBNAmazon: updateItemFromISBNAmazon
	};
})();