require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const SteamApi = require("web-api-steam");
const rp = require('request-promise');
const SteamID = require('steamid');
const passport = require('passport')
const session = require('express-session')
const SteamStrategy = require('passport-steam').Strategy;



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
var jsonParser = bodyParser.json()
app.use(express.static(__dirname + "/public"));

// Passport setup
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: 'https://mighty-citadel-31453.herokuapp.com/auth/steam/return',
  realm: 'https://mighty-citadel-31453.herokuapp.com/',
  apiKey: 'D295314B96B79961B1AB2A2457BA5B10'
},
function(identifier, profile, done) {
  process.nextTick(function () {
    profile.identifier = identifier;
    console.log(profile);
    return done(null, profile);
  });
}
));
app.use(session({
  secret: 'csgo best game',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth route
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect("/");
  });
  app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect(req.session.redirectUrl);
  });


app.get("/", (req, res) => {
  let user={};
  req.session.redirectUrl = req.originalUrl;
  if(req.user != undefined){
    user.loggedUserId = req.user.id,
    user.avatar = req.user.photos[2].value,
    user.profileurl = req.user._json.profileurl,
    user.myProfileQueryString = encodeURIComponent(req.user.id);
  }
  res.render("landing",{user});
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get("/user", (req, res) => {
  let isInputValid = false;
  req.session.redirectUrl = req.originalUrl;
  let user={};
  const requrl = req.query.url;
 //check input contains "/id/alphanumber" and "/profiles/digits only which are of max 17" and "only alphanumeric"
 const checkValidInput = requrl.match(/(^(\w+){4}$)|(id\/(\w+){4})|(profiles\/[0-9]{17})/gi);
if(checkValidInput != null){
  isInputValid = true;
}else{
  try{
    const sid = new SteamID(requrl);
    isInputValid = sid.isValid();
  }
  catch(err){
    res.redirect("/");
  }
}
if(isInputValid === true){
    extractprofile(requrl).then(steam64 =>{
      main(steam64).then(dataObj =>{
        if(dataObj.persondata.profileurl.includes("/id")){
          const url = dataObj.persondata.profileurl;
          const found=url.match(/.*(?:id)\/([a-z0-9_]+)[\/?]?/i);
          const vanity = found[1];
          dataObj.objSteamIds.customURL = vanity;
        }
        console.log(dataObj);
        if(req.user != undefined){
          user.loggedUserId = req.user.id,
          user.avatar = req.user.photos[2].value,
          user.profileurl = req.user._json.profileurl,
          user.myProfileQueryString = encodeURIComponent(req.user.id);
        }
        res.render("user",{dataObj,user});
      })
      .catch(err =>{
        res.redirect("/");
      })
    });
}else{
  res.redirect("/");
}
})

async function main(steam64){
  const persondata = await playerInfo(steam64);
  if(persondata === undefined){
    throw new Error ("steam id not found");
  }else{
  const objSteamIds  = playerSteamIds(steam64);
  const banObj = await playerBans(steam64);
  const backgroundFull = await playerBackground(steam64);
  const steamLvl = await playerLevel(steam64);
  const dataObj = {persondata,objSteamIds,banObj,backgroundFull,steamLvl};
  return dataObj;
  }
}

async function extractprofile(url) {
    if(url.includes("/id") || url.includes("/profiles")){
      // Regex for extracting the words or numbers occuring after `/profiles` or `/id` in a steam64ID
      const found=url.match(/.*(?:profiles|id)\/([a-z0-9]+)[\/?]?/i);
      const vanityOrSteamid = found[1];
      const vanity = await getVanity(vanityOrSteamid);
       if(vanity.response.success===1){
          const steam64 = vanity.response.steamid;
          return steam64;
        }else{
          const steam64 = vanityOrSteamid;
          return steam64;
        }
    }else if(url.includes("STEAM_") || url.includes("[U:")){
        var sid = new SteamID(url);
        const steam64 = sid.getSteamID64();
        return steam64;
    }else {
    const check = url.match(/^[0-9]*$/);
    if(check != null){
      const steam64 = url;
      return steam64;
    }else{
        const vanity = await getVanity(url);
        const ResolvedSteam64 = vanity.response.steamid;
        return ResolvedSteam64;
    }
    }
}


async function getVanity(extractedUrl) {
  const options = {
    uri:`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/`,
    qs:{
      key : "D295314B96B79961B1AB2A2457BA5B10",
      vanityurl : extractedUrl,
      url_type : 1
    },
    json:true
  };
 try {
    const vanity = await rp(options);
      return vanity;
  }
  catch (err) {
    console.log(err);
  }
}

function playerInfo(steam64) {
  return new Promise((resolve, reject) => {
    SteamApi.getPlayerInfo(steam64, "D295314B96B79961B1AB2A2457BA5B10", function (err, data) {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

function playerSteamIds(steam64){
  if(typeof steam64 !=undefined || typeof steam64 != null && typeof steam64 === "string"){
    const sid = new SteamID(steam64);
    const objSteamIds = {
      steam2id:sid.getSteam2RenderedID(true),
      steam3id:sid.getSteam3RenderedID(),
      steam64:steam64
    }
    return objSteamIds;
  }else{
    console.log("Pass a steamid as string");
  }
}
function playerBans(steam64){
  let banObj={}
  return new Promise((resolve,reject)=>{
    SteamApi.getPlayerBans(steam64,"D295314B96B79961B1AB2A2457BA5B10", function (err, data) {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
      if(data.VACBanned === true || data.CommunityBanned === true){
        banObj.DaysSinceLastBan = data.DaysSinceLastBan;
      }
        banObj.tradeBan = data.EconomyBan;
        banObj.vacBan = data.VACBanned;
        banObj.communityBan = data.CommunityBanned; 
        resolve(banObj);
      }
    })
  })
}

async function playerLevel(steam64){
  const options={
    uri:`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/`,
    qs:{
      key:"D295314B96B79961B1AB2A2457BA5B10",
      steamid:steam64
    },
    json:true
  };
  try {
    const steamLevel = await rp(options);
    const steamLevelNumber = steamLevel.response.player_level;
    return steamLevelNumber;
  }
  catch (err) {
    console.log(err);
  }
}

async function playerBackground(steam64){
  const options =  {
    uri:`https://api.steampowered.com/IPlayerService/GetProfileBackground/v1/`,
    qs:{
      key:"D295314B96B79961B1AB2A2457BA5B10",
      steamid:steam64
    },
    json:true
  }
  try{
    let backgroundImgUrl;
    const background = await rp(options);
     backgroundImgUrl = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/${background.response.profile_background.image_large}`;
    return backgroundImgUrl;
  }
  catch (err){
    console.log(err);
  }
}

function playerGames(steam64){
  return new Promise((resolve,reject)=>{
    SteamApi.getFriendList(steam64, "D295314B96B79961B1AB2A2457BA5B10", function (err, data) {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}
app.listen(process.env.PORT || 3001, process.env.IP, function () {
  console.log("Steam Checker Started");
})