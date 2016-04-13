# globalwishlist

##Still in development. First Version will be available in the near future.

A global Wishlist, that pulls Data from Amazon and
- is available offline
- can be sorted

You can add items by ISBN or ASIN from any Amazon Site (.com .co.jp ...) to create a global wishlist.

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

the country_code needs to be in the first line and has the syntax .country i.e. .com or .co.jp

An Example would be
```
.com
1234567890
2345678901
3456789012
...
```
A list has to been created before adding multiple items.

###Developed with
- Javascript - hold and display data
- PHP - fetch data, store list to hd (everything that javascript is not able to do)

Adding items to a list and saving a list needs a php server (the php build-in server is sufficient and super easy to use).
Displaying a list is done in javascript, no php required for this purpose.
