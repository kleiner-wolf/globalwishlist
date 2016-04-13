# globalwishlist

##Still in development. 

A global Wishlist, that pulls Data from Amazon and
- is available offline
- can be sorted

You can add items by ISBN or ASIN from any Amazon Site (.com .co.jp ...) to create a global wishlist.

## Installation:
- Download all files
- Download php from [http://php.net/downloads.php](http://php.net/downloads.php)
- Extract php to the folder php-server contained in the globalwishlist root folder.
- start the build-in php server: php.exe -S localhost:8888 -t ../. 
You can create a shortcut in the globalwishlist root folder ( php\php.exe -S localhost:8888 -t ../ )

| Arguments | Description |
| --- | --- |
| -S localhost:8888 | defines how you access your list. localhost:8888 means that you need to open the URL http//localhost:8888/display.html |
| -t ../| defines the root directory of the build-in php server. This should point to the globalwishlist root folder. |

An easier installation may come in the future.

##Features included:

| Feature | Description |
| --- | --- |
| Create Lists | On Load, no list is created, therefore the first step is creating a list |
| Add Items by ISBN/ASIN | main image and name are currently fetched from amazon (may be extended) |
| Delete Items |  |
| Sort Items |  |
| Delete Lists |  |
| Save to file | currently to a fixed file |
| Load from file | currently from a fixed file |
| Add multiple Items at once | via a list document |


##Add multiple Items at once
To add multiple items at once, you need to create a file with the following content:
```
country_code
ISBN/ASIN1
ISBN/ASIN2
ISBN/ASIN3
...
```

the country_code needs to be in the first line and is the country code top-level domain i.e. .com or .co.jp

An Example would be
```
.com
1234567890
2345678901
3456789012
...
```
A list has to be created before adding items.

##Features currently not included, but planned:
| Feature | Description |
| --- | --- |
| Add multiple Items at once from different domains | will be included in the future |
| Move items from one list to another |  |
| Merge lists |  |

###Developed with
- Javascript - hold and display data
- PHP - fetch data, store list to hd (everything that javascript is not able to do)

Adding items to a list and saving a list needs a php server (the php build-in server is sufficient and super easy to use).
Displaying a list is done in javascript, no php required for this purpose.

Use at your own risk.
