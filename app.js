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
  returnURL: 'http://localhost:3001/auth/steam/return',
  realm: 'http://localhost:3001/',
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
    res.redirect(req.session.fullUrl);
  });


app.get("/", (req, res) => {
  let user={};
  const fullUrl = req.originalUrl;
  req.session.fullUrl = fullUrl;
  if(req.user != undefined){
    user.loggedUserId = req.user.id,
    user.avatar = req.user.photos[2].value,
    user.profileurl = req.user._json.profileurl
  }
  res.render("landing",{user});
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get("/user", (req, res) => {
  const fullUrl = req.originalUrl;
  req.session.fullUrl = fullUrl;
  let objSteamIds={};
  let user={};
  const requrl = req.query.url;
  const extractedUrl = extractprofile(requrl);
    getVanity(extractedUrl).then(steam64=>{
      let url;
      const response = steam64;
      url = extractedUrl;
      if(response.response.success===1){
        url = response.response.steamid;
        objSteamIds.customURL = extractedUrl;
      }
      objSteamIds.steam64 = url;
      kyabre(url).then(dataObj =>{
        objSteamIds.steam2id = dataObj.objSteamIds.steam2id;
        objSteamIds.steam3id = dataObj.objSteamIds.steam3id;
        dataObj.objSteamIds = objSteamIds;
        console.log(dataObj);
        if(req.user != undefined){
          user.loggedUserId = req.user.id,
          user.avatar = req.user.photos[2].value,
          user.profileurl = req.user._json.profileurl
        }
        res.render("user",{dataObj,user});
      })
      .catch(err=>{
        console.log(err);
      })
    }).catch(err=>{
      console.log(err);
    })
})

async function kyabre(steam64){
  let dataObj={}
  const persondata = await playerInfo(steam64);
  const steamids  = playerSteamIds(steam64);
  const bans = await playerBans(steam64);
  const background = await playerBackground(steam64);
  const backgroundImgUrl = background.response.profile_background.image_large
  const level = await playerLevel(steam64);
  dataObj.steamLvl = level;
  const banObj = {
    tradeBan : bans.EconomyBan,
    vacBan : bans.VACBanned,
    communityBan : bans.CommunityBanned 
  }
  if(bans.VACBanned === true){
     banObj.NumberOfVACBans = bans.NumberOfVACBans;
     banObj.DaysSinceLastBan = bans.DaysSinceLastBan;
  }
  if(backgroundImgUrl != undefined){
    const backgroundFull = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/${backgroundImgUrl}`
    dataObj.backgroundFull = backgroundFull;
  }
  const objSteamIds = {
    steam2id:steamids[0],
    steam3id:steamids[1]
  }
  dataObj = {...dataObj,persondata,objSteamIds,banObj};
  return dataObj;
}

function extractprofile(url) {
  const regex = /.*(?:profiles|id)\/([a-z0-9]+)[\/?]?/i;
  const matches = regex.exec(url);
  const id = matches[1];
  const extractedUrl= id;
  return extractedUrl;
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
    let idsArr=[];
    const sid = new SteamID(steam64);
    const steam2id = sid.getSteam2RenderedID();
    const steam3id = sid.getSteam3RenderedID()
    idsArr.push(steam2id,steam3id);
    return idsArr;
  }else{
    console.log("Pass a steamid as string");
  }
}
function playerBans(steam64){
  return new Promise((resolve,reject)=>{
    SteamApi.getPlayerBans(steam64, "D295314B96B79961B1AB2A2457BA5B10", function (err, data) {
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
        resolve(data);
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
    console.log(steamLevel);
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
    const background = await rp(options);
    return background;
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