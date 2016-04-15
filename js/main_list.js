var GlobalWishlist = GlobalWishlist || {};

GlobalWishlist.Main = (function(){

	var _lists = [];
	var _listcount = 0;
	var _id_count = 0;
	
	/* Linked List Prototype*/
	function linkedlist (name){
		this.name = name;
		this.itemcount = 0;
		this.first = null;
		
		this.addItem = function (data) {
			if(data == null){ console.log("Add item data null"); return; }
			if(data === undefined){ console.log("Add item data undefined"); return; }
			
			var node = new linkedlistNode(data);
			
			if(this.first == null) {
				this.first = node;
			} else {
				var insert = this.first;
				while(insert.getNext() != null) {
					insert = insert.getNext();
				}
				
				insert.setNext(node);
				node.setPrevious(insert);
			}
			
			this.itemcount++;
		};
		
		this.addItemOnPosition = function (data, index) {
			if(data == null){ console.log("Add item data null"); return; }
			if(data === undefined){ console.log("Add item data undefined"); return; }
			
			var node = new linkedlistNode(data);
			
			if(this.first == null) {
				this.first = node;
			} else {
				var insert = this.first;
				for(var i=0; i<index; i++) {
					insert = insert.getNext();
				}
				
				// last item
				if(insert == null) {
					this.addItem(data);
					return;
				}
				
				node.setPrevious(insert.getPrevious());
				if(insert.getPrevious()!=null) {
					insert.getPrevious().setNext(node);
				} else {
					// first item
					this.first = node;
				}
				
				insert.setPrevious(node);
				node.setNext(insert);
			}
			
			this.itemcount++;
		};
		
		this.getItem = function (id) {
			var node = this.first;
			while(node.data.id != id) {
				node = node.getNext();
			}
			return node;
		};
		
		this.getItemIndex = function(id) {
			var index = 0;
			var node = this.first;
			while(node.data.id != id) {
				node = node.getNext();
				index++;
			}
			return index;
		};
		
		this.getFirst = function() {
			return this.first;
		};
		
		this.removeItem = function (id) {
			var delnode = this.getItem(id);
			
			if(delnode == null) { return; }
			
			if(delnode.getPrevious()!=null) { 
				delnode.getPrevious().setNext( delnode.getNext() ) 
			} else {
				this.first = delnode.getNext(); 
			};
			
			if(delnode.getNext()!=null) { 
				delnode.getNext().setPrevious( delnode.getPrevious() )
			};
			
			this.itemcount--;
		};
		
		this.updatePosition = function(id, index) {
			var curr_index = this.getItemIndex(id);
			var item = this.getItem(id);
			
			if(curr_index == index) {
				return;
			}
			
			if(curr_index < index) {
				this.removeItem(id);
				this.addItemOnPosition(item.data, index);
			} else {
				this.removeItem(id);
				this.addItemOnPosition(item.data, index);
			}
		};
		
		this.updateItemData = function(id, data) {
			this.getItem(id).updateData(data);
		};
		
		this.getLength = function () {
			return this.itemcount;
		};
		
		this.print = function() {
			var i = this.getFirst();
			if(i == null) { return; }
			console.log(i.data);
			
			while(i.getNext()!=null) {
				i = i.getNext();
				console.log(i.data);
			}			
		}
	};
	
	/* Linked List Node Prototype*/
	function linkedlistNode (data){
		this.data = data;
		this.previous = null;
		this.next = null;
		
		this.getData = function() { return this.data; };
		this.updateData = function(data) { this.data = data; };
		this.getPrevious = function() { return this.previous; };
		this.getNext = function() { return this.next; };
		this.setPrevious = function(prev) { this.previous=prev; };
		this.setNext = function(next) { this.next=next; };
	};
	
	/* List Item Prototype*/
	function listitem (item) {
		if(item === undefined) { 
			this.image = "";
			this.name = "";
			this.isbn = "0";
			this.price = "0";
			this.note = "";
			this.fetchID = "";
		} else {
			if(item.image === undefined) { this.image = ""; } else { this.image = item.image; }
			if(item.name === undefined) { this.name = ""; } else { this.name = item.name; }
			if(item.isbn === undefined) { this.isbn = "0"; } else { this.isbn = item.isbn; }
			if(item.price === undefined) { this.price = "0"; } else { this.price = item.price; }
			if(item.note === undefined) { this.note = ""; } else { this.note = item.note; }
			if(item.fetchID === undefined) { this.fetchID = ""; } else { this.fetchID = item.fetchID; }
			/*
			this.name = item.name;
			this.isbn = item.isbn;
			this.price = item.price;
			this.note = item.note;
			this.fetchID = item.fetchID;
			*/
		}
	};
	listitem.prototype.initByValues = function(image, name, isbn, price, note) { };
	//listitem.prototype.initByItemObject = function (item) { };
	
	var createList = function (name) {
		if( getList(name)!=0 ) { console.log("List exists already"); return "List could not be created. List with this name exists already."; }
		var newlist = new linkedlist(name);
		
		_lists[_lists.length] = newlist;		
		_listcount++;
		
		createListView(name);
		
		return 0;
	};
	
	var deleteList = function(name) {
		var rvalue = 0;
		var newlist = [];
		var newlength = 0;
		
		for(var i=0; i<_lists.length;i++) {
			if(_lists[i].name===name) {
				rvalue = 1;
			} else {
				newlist[newlength] = _lists[i];
				newlength++;
			}
		}
		_lists = newlist;
		
		deleteListView(name);
		
		return rvalue;
	};
	
	var getList = function(listname) {
		for(var i=0; i<_lists.length;i++) {
			if(_lists[i]!=null && _lists[i].name===listname) {
				return _lists[i];
			}
		}
		
		return 0;
	};
	
	var addListItem = function (listname, listitem) {
		listitem.id = _id_count;
		_id_count++;
		
		getList(listname).addItem(listitem);
		
		console.log("AddListItem " + listitem.id + ": " + JSON.stringify(listitem));
		
		addListViewItem(listname,listitem);
	};
		
	var deleteListItem = function (listname, item) {
		getList(listname).removeItem(item.id);		
		deleteListViewItem(listname, item);
	};
	
	var updateListItem = function (listname, itemID, updatedItem) {
		getList(listname).updateItemData(itemID, updateditem);
		updateListItemView(listname, getList(listname).getItem(itemID));
	};
	
	var saveList = function (listfile) {
		GlobalWishlist.IO.exportListToFile(listfile, _lists);
	};
	
	var loadList = function (listfile) {
		GlobalWishlist.IO.importListFromFile(listfile);
	};
		
	var createListView = function (listname) {
		initList(listname);

		/*var listitems = getList(listname).getFirst();
		while(listitems != null ) {
			addListViewItem(listname, listitems.getData());
			listitems = listitems.getNext();
		}
		*/
		
		//jquery ui routine for list sorting
		$( ".wishlist[listname='"+listname+"']" ).sortable({
			placeholder: "ui-state-highlight",
			stop: function( event, ui ) {
				var $itemid = ui.item.attr("itemid");
				var $listitems = $( ".wishlist[listname='"+listname+"'] li");
				var index = 0;
				for(var i=0; i<$listitems.length; i++) {
					if($listitems.eq(i).attr("itemid") == $itemid) {
						index = i;
						break;
					}
				}
				
				console.log("Move "+ getList(listname).getItemIndex($itemid) + " to " + index)
				getList(listname).updatePosition($itemid, index);
				getList(listname).print();
			}
		});	
		
		//$( "#wishlist-tab ").tabs("refresh");
		addListSelectButton(listname);
		setActiveList(listname);
	};	
	
	var addListSelectButton = function (listname) {
		var $selectbutton = $("<span>").addClass("wishlist-select-button").attr("id","select"+listname).attr("listname", listname).text(listname)
		.button()
		.click(
			function() {
				var listname = $(this).attr("listname");
				setActiveList(listname);
			}
		);
		$("#wishlist-select-buttons").append($selectbutton);
	};
	
	var deleteListSelectButton = function (listname) {
		$(".wishlist-select-button[listname='"+listname+"']").remove();
	};
	
	var deleteListView = function(name) {
		$(".wishlist-container[listname='"+name+"']").remove();
		deleteListSelectButton(name);
	};
	
	var initList = function (listname) {
		var $container = $("<div>").addClass("wishlist-container").attr("id",listname.replace(/\s+/g, '')+"Wishlist").attr("listname", listname);
		
		var $header = $("<div>").addClass("list-header ui-widget-header");
		$header.append($("<div>").addClass("listitem-header listitem-header-image").text(""));
		$header.append($("<div>").addClass("listitem-header listitem-header-name").text("Name"));
		$header.append($("<div>").addClass("listitem-header listitem-header-isbn").text("ISBN"));
		$header.append($("<div>").addClass("listitem-header listitem-header-price").text("Price"));
		$header.append($("<div>").addClass("listitem-header listitem-header-link").text("Link"));
		$header.append($("<div>").addClass("listitem-header listitem-header-delete").text("Liste Löschen").click(function(){ deleteList(listname); }));
		
		$container.append($header);
		
		var $list = $("<ul>").addClass("wishlist").attr("id",listname.replace(/\s+/g, '')).attr("listname", listname);
		$container.append($list);
		
		$("body").append($container);
	};
	
	var addListViewItem = function (listname, item) {
		var $listitem = $("<li>").addClass("wishlist-item ui-state-default").attr("itemid",item.id);
		
		var $itemimage = $("<div>").addClass("listitem listitem-image-div").append($("<img src='"+item.image+"'>").addClass("listitem-image"));
		$listitem.append($itemimage);
		
		var $itemandnote = $("<div>").addClass("listitem listitem-nameandnote");
		var $itemname = $("<div>").addClass("listitem listitem-name").text(item.name);
		$itemandnote.append($itemname);
		
		var $itemnote = $("<div>").addClass("listitem listitem-note").text(item.note);
		$itemandnote.append($itemnote);
		$listitem.append($itemandnote);
		
		var $itemisbn = $("<div>").addClass("listitem listitem-isbn").text(item.isbn);
		$listitem.append($itemisbn);
		
		var $itemprice = $("<div>").addClass("listitem listitem-price").text(item.price).button().click(
			function(){
				$(this).text("1");
			}
		);
		$listitem.append($itemprice);
		
		var $itemlink = $("<div>").addClass("listitem listitem-link-div").append($("<a href='http://www.amazon.co.jp/dp/"+item.isbn+"' target='_blank' >Amazon.co.jp</a>").addClass("listitem-link"));
		$listitem.append($itemlink);
		
		$listitem.append(addListViewItemEdit(listname, item));

		$(".wishlist[listname='"+listname+"']").append($listitem);
	};
	
	var addListViewItemEdit = function(listname, item) {
		var $editbar = $("<div>").addClass("listitem listitem-edit");
		$editbar.append($("<div>").text("Delete").addClass("listitem listitem-edit-del").button().click( 
			function() { 
				deleteListItem(listname,item); 
			}
		));
		/*
		$editbar.append($("<div>").text("Update Price").addClass("listitem listitem-edit-update-price").button().click( 
			function() { 
				
			}
		));
		*/
		return $editbar;
	};
	
	var deleteListViewItem = function (listname, item) {
		$(".wishlist[listname='"+listname+"'] .wishlist-item[itemid='"+item.id+"']").remove();
		getList(listname).print();
	};
	
	var updateListViewItem = function (listname, item) {
		var $listitem = $(".wishlist[listname='"+listname+"'] .wishlist-item[itemid='"+item.id+"']");
		$listitem.find("listitem-name").text(item.name);
		/* todo : values that are changed during an update */
		
		getList(listname).print();
	};
	
	var setActiveList = function(listname) {
		$(".wishlist-select-button").removeClass("wishlist-buttonstate-selected ui-state-focus");
		$(".wishlist-select-button[listname='"+listname+"']").addClass("wishlist-buttonstate-selected ui-state-focus");
				
		$(".wishlist.wishlist-active").removeClass("wishlist-active");
		$(".wishlist[listname='"+listname+"']").addClass("wishlist-active");
		$(".wishlist-container").removeClass("wishlist-active");
		$(".wishlist-container[listname='"+listname+"']").addClass("wishlist-active");
		
		$(".wishlist-container").hide();
		$(".wishlist-container.wishlist-active").show();
	};
	
	var getActiveListName = function() {
		return $(".wishlist.wishlist-active").attr("listname");
	};
	
	return{	
		createList: createList,	
		deleteList: deleteList,
		getList: getList,	
		addListItem: addListItem,	
		updateListItem: updateListItem,	
		saveList: saveList,
		loadList: loadList,
		listitem: listitem,
		setActiveList: setActiveList,
		getActiveListName: getActiveListName
	};
})();