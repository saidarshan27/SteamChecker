require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const SteamApi = require("web-api-steam");
const rp = require('request-promise');
const  xml2js = require('xml2js');
const SteamID = require('steamid');
const passport = require('passport')
const session = require('express-session');
const fiveMConverter = require("fivemid-converter");
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
    res.redirect(req.session.redirectUrl);
  });


app.get("/", (req, res) => {
  let user={};
  req.session.redirectUrl = req.originalUrl;
  if(req.user != undefined){
    user.loggedUserId = req.user.id,
    user.avatar = req.user.photos[2].value,
    user.profileurl = req.user._json.profileurl,
    user.myProfileQueryString = `/user?url=${encodeURIComponent(req.user.id)}`;
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
  console.log(typeof requrl);
 //check input contains "/id/alphanumber" and "/profiles/digits only which are of max 17" and "only alphanumeric"
 const regex = /(^(\w+){4}$)|(id\/(\w+){4})|(profiles\/[0-9]{17})/gi;
 const checkValidInput = regex.test(requrl);
if(!checkValidInput){
  try{
    const sid = new SteamID(requrl);
    isInputValid = sid.isValid();
  }
  catch(err){
    console.log(err);
    res.redirect("/");
  }
}else{
   isInputValid = true;
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
          user.myProfileQueryString = `/user?url=${encodeURIComponent(req.user.id)}`;
        }
        res.render("user",{dataObj,user});
      })
      .catch(err =>{
        console.log(err);
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
  const steamLvl = await playerLevel(steam64);
  const steamrepReputation = await getSteamRep(steam64);
  const faceitInfo = await getPlayerFaceitInfo(steam64);
  const dataObj = {persondata,objSteamIds,banObj,steamLvl,faceitInfo,steamrepReputation};
  return dataObj;
  }
}

async function extractprofile(url) {
    if(/\/id/gi.test(url) || /\/profiles/gi.test(url)){
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
    }else if(/^(?![0-9]*$)(^(\w+){4}$)/gi.test(url)){
      console.log("getting vanity");
       const vanity = await getVanity(url);
       const steam64 = vanity.response.steamid;
       return steam64;
    }else{
      const sid = new SteamID(url);
      const steam64 = sid.getSteamID64();
      return steam64;
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
    console.log("vanity",vanity);
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
        console.log("playerinfo",data);
        resolve(data);
      }
    })
  })
}

function playerSteamIds(steam64){
  if(typeof steam64 !=undefined || typeof steam64 != null && typeof steam64 === "string"){
    const sid = new SteamID(steam64);
    const fiveMID = fiveMConverter.fiveMIDbyID64(steam64);
    const objSteamIds = {
      steam2id:sid.getSteam2RenderedID(true),
      steam3id:sid.getSteam3RenderedID(),
      steam64:steam64,
      fiveMID
    }
    console.log("objSteamIds",objSteamIds);
    return objSteamIds;
  }else{
    console.log("Pass a steamid as string");
  }
}

function playerBans(steam64){
  let banObj={
    communityBan:"None",
    vacBan:"None",
    tradeBan:"None",
    gameBan:"None"
  }
  return new Promise((resolve,reject)=>{
    SteamApi.getPlayerBans(steam64,"D295314B96B79961B1AB2A2457BA5B10", function (err, data) {
      console.log(data);
      if (err) {
        console.log("error", err);
        reject(err);
      } else {
       for(const prop in data){
         switch(prop){
           case "CommunityBanned":
            if(data[prop] != false){
              banObj.communityBan = "BANNED";
              banObj.DaysSinceLastBan = data.DaysSinceLastBan;
            }
            break;
           case "VACBanned":
             if(data[prop] != false){
               banObj.vacBan = "BANNED";
               banObj.DaysSinceLastBan = data.DaysSinceLastBan;
             }
            break;
           case "EconomyBan":
             if(data[prop] != "none"){
               banObj.tradeBan = "BANNED";
             }
            break;
           case "NumberOfGameBans":
            if(data[prop] != 0){
              banObj.gameBan = "BANNED";
              banObj.DaysSinceLastBan = data.DaysSinceLastBan;
            }
         }
       }
       console.log("banObj",banObj);
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
    console.log("steamLevel",steamLevelNumber);
    return steamLevelNumber;
  }
  catch (err) {
    console.log(err);
  }
}

async function getPlayerFaceitInfo(steam64){
  try{
    const options ={
      uri:`https://open.faceit.com/data/v4/players`,
      qs:{
        game:'csgo',
        game_player_id:steam64
      },
      headers:{
        'Authorization':`Bearer 6e687cc3-223a-4f96-8d11-8ab39a1ed1e4`
      },
      json:true
    }
    const response = await rp(options);
    const faceitInfo={
      nickname:response.nickname,
      faceitURL:response.faceit_url,
      games:{}
    }
    if(response.games.csgo){
      faceitInfo.games.csgo = {
        skillLevel:response.games.csgo.skill_level,
      }
    }
    if(response.games.pubg){
        faceitInfo.games.pubg = {
          skillLevel:response.games.pubg.skill_level
        }
    }
    if(response.games.dota2){
      faceitInfo.games.dota2={
        skillLevel:response.games.dota2.skill_level
      }
    }
      // regex for extracting the '{lang}' in faceit profile url 
      const regex = /{lang}/gi;
      faceitInfo.faceitURL = faceitInfo.faceitURL.replace(regex,'en');
      console.log("faceitInfo",faceitInfo)
      return faceitInfo
  }
  catch(err){
    return false
  }
}

async function getSteamRep(steam64){
  const options={
    uri:`https://steamrep.com/api/beta4/reputation/${steam64}`,
    qs:{
      extended:1
    }
  }
  try{
   const xml = await rp(options);
   const json = await xml2js.parseStringPromise(xml);
   const steamrepurl=json.steamrep.steamrepurl[0];
   const jsonFullrep = json.steamrep.reputation[0].full[0];
   let  fullReputation;
   if(jsonFullrep === ""){
      fullReputation = "no special reputation";
   }else if(jsonFullrep != "" && /SR ADMIN/gi.test(jsonFullrep)){
     fullReputation = "SteamRep Admin";
   }else if(jsonFullrep != "" && /VALVE ADMIN/gi.test(jsonFullrep)){
     fullReputation = "VALVE EMPLOYEE"
   }else if(jsonFullrep != "" && /SCAMMER/gi.test(jsonFullrep)){
    fullReputation = "SCAMMER"
   }
   const steamRepReputationObj = {
    steamrepurl,
    fullReputation,
    NumberOfBannedFriends : json.steamrep.stats[0].bannedfriends[0]
  }
  return steamRepReputationObj;
  }
  catch(err){
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