# custom_caroutsel_React
 this is a sharepoint frame work extention(SPFx) webpart it displays images in carousel.
 
 i used Microsoft Graph API to get image url and used PnPjs to load files from Picture library the images are loading in lazy mode, progressively.
 
# Web Part Properties

|Property	               | Type	                |Required	              |comments                                                       |
|------------------------|----------------------|-----------------------|---------------------------------------------------------------|
|Site Url of library	    | Text	                |yes	                   |                                                               |
|Picture Library	        | Choice/Dropdown	     |yes           	        |this is filled with all Picture Libraries (BaseTemplate : 109) |
|number images to load	  | number	              |yes	                   |number between 1 and 50                                        |

# react-slick Props
For all available props, [click here](https://react-slick.neostack.com/docs/api/).

# react-slick Methods
For all available methods, [click here](https://react-slick.neostack.com/docs/api/#methods).

# Clone this repository
in the command line run:
* npm install
* gulp build

# for tesing 

* gulp package-solution
* gulp serve --nobrowser
* Go to your site's app catalog
* Upload or drag and drop the custom_caroutsel_React.sppkg to the app catalog
* Select Deploy

# Install the client-side solution on your site
* Go to your developer site collection or site collection that you want to use for testing
* Select the gears icon on the top nav bar on the right, and then select Add an app to go to your Apps page
* In the Search box, enter custom_caroutsel_React, and select ENTER to filter your apps
* Select the custom_caroutsel_React app to install the app on the site.

# for production

* gulp bundle --ship
* gulp package-solution --ship
* Add to AppCatalog and deploy
* Make sure you have at least one Picture Library on one of your site collections
* Add the web part to a page
* In the web part's property pane, enter the Site Url (if library is on a different site collect) and select a Picture Library from the Library drop-down
