# README

Yelp Camp project is part of the Udemy Course: The Web Developer Bootcamp
and was created following the instructions provided in the course.

Yelp Camp project was created using:

* HTML5
* CSS3
* Javascript
* Node.js
* MongoDB

Additional packages:

* "express": "^4.16.3"
* "express-session": "^1.15.6"
* "body-parser": "^1.18.3"
* "mongoose": "^5.2.7"
* "passport": "^0.4.0"
* "passport-local": "^1.0.0"
* "passport-local-mongoose": "^5.0.1"
* "method-override": "^3.0.0"
* "connect-flash": "^0.1.1"
* "ejs": "^2.6.1"
* "dotenv": "^6.0.0"
* "node-geocoder": "^3.22.0"
* "moment": "^2.22.2"
* "nodemailer": "^4.6.8"
* "async": "^2.6.1"

Git repository:

* GitHub ( https://github.com/chripas88/YelpCamp )

Production environment:

* Heroku ( https://chripas88-yelpcamp.herokuapp.com )

Creation log:

#YelpCamp

* Add Landing Page
* Add Campgrounds Page that lists all campgrounds

#Layout and Basic Styling

* Create our header and footer partials
* Add in Bootstrap

#Creating New Campgrounds

* Setup new campground post route
* Add in body-parser
* Setup route to show form
* Add basic unstyled form

#Style the campgrounds page

* Add a better header/title
* Make campgrounds display in a grid

#Style the Navbar and form

* Add a navbar to all templates
* Style the new campground form

#Add Mongoose

* Install and configure mongoose
* Setup campground model
* Use campground model inside of our routes!

#Show Page

* Review the RESTful routes we' ve seen so far
* Add description to our campground model
* Show db.collection.drop()
* Add a show route/template

#Refactor Mongoose Code
* Create models directory
* Use module.exports
* Require everything correctly!

#Add Seed File
* Add a seeds.js file
* Run the seeds file every time the server starts

#Add the Comment model
* Make our errors go away!
* Display comments on campground show page

#Comment New/Create
* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

#Style show page
* add sidebar to show page
* Display comments nicely

#Finish styling show page
* Add public directory
* Add custom stylesheet

#Authentication Pt. 1 - Add User Model
* Install all packages needed for authentication
* Define User Model

#Authentication Pt. 2 - Register
* Configure Passport
* Add register routes
* Add register template

#Authentication Pt. 3 - Login
* Add Login Routes
* Add Login Template

#Authentication Pt. 4 - Logout
* Add logout route
* Prevent a user from adding a new comment if not signed in
* Add links to navbar

#Authentication Pt. 5 - Show/Hide links
* Show/hide auth links correctly

#Refactoring Routes
* Use express router to reorganize all routes

#Users + Comments
* Associate users and comments
* Save author's name to a comment automatically

#Users + Campgrounds
* Prevent an unauthenticated user from creating a new campground
* Save username + id to new campground

#Editing Campgrounds
* Add Method-Override
* Add Edit Route for Campgrounds
* Add link to Edit Page
* Add Update Route
* Fix $set problem

#Deleting Campgrounds
* Add Destroy Route
* Add Delete Button

#Authorization Part 1: Campgrounds
* User can only edit his/her campgrounds
* User can only delete his/her campgrounds
* Hide/Show edit and delete buttons

#Editing Comments
* Add Edit route for comments
* Add Edit button
* Add Update Route

#Deleting Comments
* Add Destroy route
* Add Delete Button

#Authorization Part 2: Comments
* User can only edit his/her comments
* User can only delete his/her comments
* Hide/Show edit and delete buttons
* Refactor Middleware

#Adding in Flash
* Demo working version
* Install and configure connect-flash
* Add bootstrap alerts to header

#Landing Page
* Create landing page
* Apply css to create the animation

#UI improvements
* Log in page
* Sign Up page

#New attribute - pricing
* Add pricing to campground

#New attributes - Created and last updated dates
* Add creation and last updated dates in campgrounds
* Add creation and last updated dates in campgrounds in comments

#Admin role
* Give the new user the option to be admin by giving the correct adminCode
* Apply admin permissions to edit and delete campground and comment

#User profile
* create user profile page
* add new attributes to user
* add a list of owned campgrounds to profile page

#Fuzzy search
* create fuzzy search form on campgrounds index page
* apply fuzzy search using regex

#Pagination on campgrounds index page
* apply pagination on campgrounds index page

#Refactor callbacks in seeds.js to use Async/Await
* Update nvm to version 8
* apply async/await logic
* update db seed using user association with comments and campgrounds
* apply randomization (random author, random number of comments etc)

#Collapsible comment section
* collapse new
* collapse edit
