var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
var User = require("./models/user");

var descText = "Meatloaf kielbasa kevin short loin pig. Spare ribs bresaola short loin corned beef. Brisket strip steak sirloin, kielbasa ground round biltong alcatra landjaeger hamburger pastrami capicola chuck corned beef. Fatback boudin flank, bacon picanha ham hock ribeye pork belly kielbasa landjaeger. Short ribs prosciutto andouille kevin bacon. Venison biltong corned beef prosciutto.";
var commentText = "Bacon ipsum dolor amet landjaeger drumstick sirloin, picanha frankfurter pork chop kevin leberkas short loin burgdoggen ribeye flank rump corned beef. Ribeye pork filet mignon, chicken rump fatback ball tip leberkas kielbasa ground round burgdoggen doner. Capicola pig bacon cow, turducken flank frankfurter buffalo ham cupim short ribs turkey pork chop tail ribeye. Tri-tip kielbasa pancetta, pig sirloin short loin drumstick shank fatback pork chop venison alcatra.";
var minTextLength = 10;
var maxComments = 6;

var campgroundNames = [
    "Beaver creek", 
    "Bear River", 
    "Lake Takanaka", 
    "Sandy Hill Camp", 
    "Hilltop Plateau", 
    "Cloud's nest", 
    "Camp Star", 
    "Beach canyon", 
    "Nature's View", 
    "Honey Plains",
    "Muddy feet Camp",
    "Misty Mountain top",
    "Sunny valley",
    "Path of Water",
    "Billy's grass fields",
    "Crow's nest",
    "Riverside delight",
    "Pine Cone Camp",
    "Adventure Camp",
    "Bat Canyon"];
    
var campgroundImages = [
    "https://res.cloudinary.com/simpleview/image/upload/c_limit,f_auto,h_1200,q_75,w_1200/v1/clients/poconos/Campgrounds_Tent_Sites_Woman_Hemlock_Campground_4_PoconoMtns_06f196d5-8814-4803-a132-8a4daae1755e.jpg",
    "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
    "http://haulihuvila.com/wp-content/uploads/2012/09/hauli-huvila-campgrounds-lg.jpg",
    "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg",
    "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-campground-background.jpg",
    "https://www.planetware.com/photos-large/USUT/utah-zion-national-park-camping-south-campground.jpg",
    "http://farm9.staticflickr.com/8605/16573646931_22fc928bf9_o.jpg",
    "https://www.quebecoriginal.com/en/listing/images/800x600/5952f0c7-acac-40d5-a0a9-bf5355a57992/petit-gaspe-campground-forillon-national-park-photo.jpg",
    "https://cdn.travelpulse.com/images/99999999-9999-9999-9999-999999999999/777BB633-D2CE-56A8-E06C-7C2F8E6CD135/630x355.jpeg",
    "https://www.olympicnationalparks.com/media/610231/sol-duc-hot-springs-resort-camping_112_1000x667.jpg",
    "http://www.gobroomecounty.com/files/hd/Campground1.jpg",
    "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5176555.jpg",
    "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7656",
    "https://cdn.vox-cdn.com/thumbor/-JoPdcgAuLTUsWiDZ62CX4wb33k=/0x0:5225x3479/1200x800/filters:focal(2195x1322:3031x2158)/cdn.vox-cdn.com/uploads/chorus_image/image/54137643/camping_tents.0.jpg",
    "http://www.travelstyle.gr/wp-content/uploads/2018/07/31-05101657f53d1a399b7051016886742565-31.jpg",
    "http://www.discoveringfinland.com/wp-content/uploads/2016/09/camping-finland.jpg",
    "https://isorepublic.com/wp-content/uploads/2017/06/camping-mountains.jpg",
    "http://chile.travel/wp-content/uploads/2016/04/Camping-INACH-ACT253.jpg",
    "https://i0.wp.com/scoutingmagazine.org/wp-content/uploads/2008/05/Summer-Camp.jpg?fit=906%2C530&ssl=1",
    "http://www.camp-liza.com/wp-content/uploads/2017/10/20170708_093155_HDR-2.jpg"];

var userAvatars = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Ua1kNXKh-SwzIt9jQtkDR9dbRK3jS-zkDLN2pPPBvDBgFuJDjA",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL3K9FQFY7LH74hlrAadVM5fGQPZD_JwNQiQBWrGuL3I6w4hMx",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScA3CeUqpv8EXQ_n31tYqJ-VR0aw1Dj0n6ljCM9iL0XZk-qq9A"];

var usernames = [
    "admin",
    "user1",
    "user2",
    "user3",
    "user4",
    "user5"];
    
var firstName = "John";
var lastName = "Doe";
var email = "@email.gr";
var password = "password";

var users;

async function seedDB(){
    try{
        await User.remove({});
        console.log("Users removed.");
        await Campground.remove({});
        console.log("Campgrounds removed.");
        await Comment.remove({});
        console.log("Comments removed.");
        
        for(const username of usernames){
            let newUser = await createNewUser(username);
            await User.register(newUser, password);
        }
        
        await User.find({}, function(err, allUsers){
            if(err){
                console.log("Could not find Users.");
            } else {
                allUsers.forEach(function(user){
                    console.log("User: " + user.username + " id: " + user._id);
                });
                
                users = allUsers;
            }
        });
        
        var index = 0;
        for(const campgroundName of campgroundNames){
            var campgroundImage = campgroundImages[index];
            let campgroundAuthor = await randomAuthor(users);
            
            let newCampground = await createNewCampground(campgroundName, campgroundImage, campgroundAuthor);
            let createdCampground = await Campground.create(newCampground);
            
            var commentCount = Math.floor(Math.random() * maxComments);
            
            for(var i=0; i<commentCount; i++){
                let commentAuthor = await randomAuthor(users);
                
                let newComment = await createNewComment(commentAuthor);
                let createdComment = await Comment.create(newComment);
                
                createdCampground.comments.push(createdComment);
            }
            createdCampground.save();
            index++;
        }
        console.log("DB ready.")
    } catch(err) {
        console.log(err);
    }
}

var createNewUser = function(username){
    var randomAvatarChoice = (Math.floor(Math.random() * userAvatars.length + 1));
    var fullEmail = username + email;
        
    var newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: fullEmail
    });
    
    if(!(randomAvatarChoice === userAvatars.length)){
        newUser.avatar = userAvatars[randomAvatarChoice];
    }
    
    if(username === "admin"){
        newUser.isAdmin = true;
    }
    
    return newUser;
};

var createNewCampground = function(campgroundName, campgroundImage, author){
    var randomDescTextLength = Math.floor(Math.random() * descText.length - (minTextLength -1)) + minTextLength;
    var randomDescText = descText.substring(1, randomDescTextLength);
    var randomPrice = Math.floor(Math.random() * 20).toFixed(2);
    
    var newCampground = new Campground({
        name: campgroundName,
        price: randomPrice,
        image: campgroundImage,
        desc: randomDescText,
        author: {
            id: author._id,
            username: author.username
        }
    });
    
    return newCampground;
};

var randomAuthor = function(allUsers){
    var randomUser = Math.floor(Math.random() * allUsers.length);
    
    return allUsers[randomUser];
};

var createNewComment = function(author){
    var randomCommentTextLength = Math.floor(Math.random() * commentText.length - (minTextLength -1)) + minTextLength;
    var randomCommentText = commentText.substr(1, randomCommentTextLength);
    
    var newComment = new Comment({
        text: randomCommentText,
        author: {
            id: author._id,
            username: author.username
        }
    });
    
    return newComment;
};

module.exports = seedDB;