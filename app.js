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
const mongoose = require("mongoose");
const SteamUser = require("./models/steamUser");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
var jsonParser = bodyParser.json()
app.use(express.static(__dirname + "/public"));

// mongodb setup
mongoose
	.connect(process.env.MONGOURL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to DB');
	})
	.catch((err) => {
		console.log('ERROR', err.message);
	});

// Passport setup
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: 'http://steamchecker-env.eba-fpmum2ks.ap-southeast-1.elasticbeanstalk.com/auth/steam/return',
  realm: 'http://steamchecker-env.eba-fpmum2ks.ap-southeast-1.elasticbeanstalk.com/',
  apiKey: process.env.KEY
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

  app.use(function(req,res,next){
    // if there is a user then send the user object and the friends of the user
    if(req.user != undefined){
      async function user(){
        // creating user obj
        let user = {
          loggedUserId : req.user.id,
          avatar : req.user.photos[2].value,
          profileurl : req.user._json.profileurl,
          myProfileQueryString : `/user?url=${encodeURIComponent(req.user.id)}`
        }
        // requesting for users friend
        try{
          const friendsArr = [];
          const friends = await getFriends(req.user.id); 
          // extracting only steamid's of friends
          friends.friendslist.friends.forEach((friend,index)=>{
            friendsArr[index] = friend.steamid;
          })
          user.friendsArr = friendsArr;
        }
        catch(err){
          console.log(err);
        }
        res.locals.currentUser = user;
        next();
      }
      user();
    }else{
      res.locals.currentUser = " ";
      next();
    }
  })

  app.use(function(req,res,next){
    res.locals.error=req.flash("error");
    next();
  });



app.get("/", (req, res) => {
  req.session.redirectUrl = req.originalUrl;
  res.render("landing");
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get("/user",(req, res) => {
  let isInputValid = false;
  req.session.redirectUrl = req.originalUrl;
  const requrl = req.query.url;
  console.log(requrl);
 //check input contains "/id/alphanumber" and "/profiles/digits only which are of max 17" and "only alphanumeric"
 const regex = /(^(\w+){4}$)|(id\/(\w+){4})|(profiles\/[0-9]{17})/gi;
 const checkValidInput = regex.test(requrl);
 console.log(checkValidInput);
if(!checkValidInput){
  try{
    const sid = new SteamID(requrl);
    isInputValid = sid.isValid();
  }
  catch(err){
    console.log(err);
    req.flash("error","Please enter a valid input");
    return res.redirect("/");
  }
}else{
   isInputValid = true;
}
// if valid input go-ahead
if(isInputValid === true){
    extractprofile(requrl).then(steam64 =>{
      SteamUser.findOne({
        'persondata.steamid':steam64
      },async function(err,foundData){
        if(err){
          console.log(err);
        }else{
          if(foundData == null){
            main(steam64).then(dataObj =>{
              if(dataObj.persondata.profileurl.includes("/id")){
                const url = dataObj.persondata.profileurl;
                const found=url.match(/.*(?:id)\/([a-z0-9_]+)[\/?]?/i);
                const vanity = found[1];
                dataObj.objSteamIds.customURL = vanity;
              }
              res.render("user",{dataObj});
              SteamUser.create({
                persondata:dataObj.persondata,
                objSteamIds:dataObj.objSteamIds,
                banObj:dataObj.banObj,
                steamLvl:dataObj.steamLvl,
                steamrepReputation:dataObj.steamrepReputation,
                faceitInfo:dataObj.faceitInfo
              },function(err,data){
                if(err){
                  console.log(err);
                }else{
                  console.log("database data",data);
                }
              })
              // console.log(dataObj);
            })
            .catch(err =>{
              // steamid not found redirect
              console.log(err);
              req.flash("error","Steam profile not found");
              res.redirect("/");
            })
          }else{
            const updateOnlineStatus = await playerInfo(foundData.persondata.steamid);
            const {personastate:onlineStatus} = updateOnlineStatus;
            foundData.persondata.personastate = onlineStatus;
            res.render("user",{dataObj:foundData});
          }
        }
      })
    });
}else{
  // invalid input
  req.flash("error","Please enter a valid input");
  res.redirect("/");
}
})

app.get("/user/getFriends",(req,res)=>{
  // check if user present
  SteamUser.findOne({
    "persondata.steamid":req.query.steam64
  },function(err,data){
    if(err){
      console.log(err);
    }else{
      const numberofFriends = data.friends.length;
      // if present send the available data
      if(numberofFriends>0){
        res.json(data.friends);
      }else{
        // else request data from steam
        getFriends(req.query.steam64).then((data)=>{
          const fullFriendsSteamids = [];
          data.friendslist.friends.forEach((friend,index)=>{
            fullFriendsSteamids[index] = friend.steamid;
          })
          async function additionalInfotoFrineds(){
          let length = fullFriendsSteamids.length;
          let temp = 0;
            while(length){
                const limit = (length>=100) ? 100 : length;
                // if 100 available splice 100 or splice howmuch ever available
                const splicedFriends = fullFriendsSteamids.splice(0,limit);
                length = fullFriendsSteamids.length;
                const splicedFriendsString = splicedFriends.join();
                const playersData = await getPlayersInfo(splicedFriendsString);
                for(let i=0;i<=splicedFriends.length-1;i++){
                  const found = playersData.response.players.findIndex(x=> x.steamid == splicedFriends[i]);
                  data.friendslist.friends[i+temp].personaname = playersData.response.players[found].personaname;
                  data.friendslist.friends[i+temp].profileurl = playersData.response.players[found].profileurl;
                  data.friendslist.friends[i+temp].avatar = playersData.response.players[found].avatarfull;
                }
                temp = temp+100;
            }
            res.json(data.friendslist.friends);
            SteamUser.findOneAndUpdate({"persondata.steamid":req.query.steam64},{"friends":data.friendslist.friends},function(err,done){
              if(err){
                console.log(err);
              }else{
                console.log("done");
              }
            });
            }
            additionalInfotoFrineds();
        })
        .catch(err=>{
          res.status(500).json(err.message);
        })
      }
    }
  })
})

app.get("/user/refresh",(req,res)=>{
  const steamid = req.query.url;
  SteamUser.findOneAndDelete({'persondata.steamid':steamid},function(err,data){
    if(err){
      console.log(err);
    }else{
      res.redirect(`/user?url=${steamid}`);
    }
  })
})

app.get("/user/getGames",(req,res)=>{
  const steamid = req.query.steam64;
  getGames(steamid).then((data)=>{
    if(Array.isArray(data.response.games))res.json(data.response.games);
    else throw new Error("Games list private");
  })
  .catch(err=>{
    res.status(500).json(err.message);
  })
})

async function main(steam64){
  const persondata = await playerInfo(steam64);
  if(persondata === undefined){
    throw new Error ("steam id not found");
  }else{
  const objSteamIds  = playerSteamIds(steam64);
  const banObj = playerBans(steam64);
  const steamLvl = playerLevel(steam64);
  const steamrepReputation = getSteamRep(steam64);
  const faceitInfo =getPlayerFaceitInfo(steam64);
  const dataObj = await Promise.all([banObj,steamLvl,steamrepReputation,faceitInfo]).then((data)=>{
      return new Promise((resolve,reject)=>{
      const dataObj = {persondata,objSteamIds,banObj:data[0],steamLvl:data[1],steamrepReputation:data[2],faceitInfo:data[3]};
      resolve(dataObj);
    })
  })
  return dataObj;
  }
}

async function extractprofile(url) {
    if(/\/id/gi.test(url) || /\/profiles/gi.test(url)){
      // Regex for extracting the words or numbers occuring after `/profiles` or `/id` in a steam64ID
      const found=url.match(/.*(?:profiles|id)\/([A-Za-z0-9_]+)[\/?]?/i);
      const vanityOrSteamid = found[1];
      console.log("foundOne",found[1]);
      const isNum = /^\d+$/.test(found[1]);
      if(isNum){
        const steam64 = found[1];
        return steam64;
      }else{
        const vanity = await getVanity(vanityOrSteamid);
        const steam64 = vanity.response.steamid;
          return steam64;
      }
    }else if(/^(?![0-9]*$)(^(\w+){4}$)/gi.test(url)){
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
      key : process.env.KEY,
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
    SteamApi.getPlayerInfo(steam64, process.env.KEY, function (err, data) {
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
    SteamApi.getPlayerBans(steam64,process.env.KEY, function (err, data) {
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
       resolve(banObj);
      }
    })
  })
}

async function playerLevel(steam64){
  const options={
    uri:`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/`,
    qs:{
      key:process.env.KEY,
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

async function getPlayerFaceitInfo(steam64){
  try{
    const options ={
      uri:`https://open.faceit.com/data/v4/players`,
      qs:{
        game:'csgo',
        game_player_id:steam64
      },
      headers:{
        'Authorization':`Bearer ${process.env.FACEITKEY}`
      },
      json:true
    }
    const response = await rp(options);
    const faceitInfo={
      nickname:response.nickname,
      faceitURL:response.faceit_url,
      games:{}
    }
    for(const prop in response.games){
      if(prop === "csgo" || prop ==="dota2" || prop ==="pubg"){
        const skillLevelObj = {
          skillLevel: response.games[prop].skill_level
        }
        faceitInfo.games[prop] = skillLevelObj;
      }else{
        continue;
      }
    }
    // regex for extracting the '{lang}' in faceit profile url 
    const regex = /{lang}/gi;
    faceitInfo.faceitURL = faceitInfo.faceitURL.replace(regex,'en');
    return faceitInfo
  }
  catch(err){
    return false;
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
   console.log(jsonFullrep);
   let  fullReputation;
   if(jsonFullrep === "" || /SR DONATOR/gi.test(jsonFullrep)){
      fullReputation = "no special reputation";
   }else if(/SR ADMIN/gi.test(jsonFullrep)){
     fullReputation = "SteamRep Admin";
   }else if(/VALVE ADMIN/gi.test(jsonFullrep)){
     fullReputation = "VALVE EMPLOYEE"
   }else if(/SCAMMER/gi.test(jsonFullrep)){
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

async function getFriends(steam64){
  console.log(steam64);
  const options = {
    uri:`https://api.steampowered.com/ISteamUser/GetFriendList/v1/`,
    qs:{
      key : process.env.KEY,
      steamid:steam64,
      relationship:"friend"
    },
    json:true
  }
  try{
    const response= await rp(options);
    return response;
  }
  catch(err){
    throw new Error ("friends list private");
  }
}

async function getPlayersInfo(steamids){
  const options = {
    uri:`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`,
    qs:{
      key : "D295314B96B79961B1AB2A2457BA5B10",
      steamids:steamids
    },
    json:true
  }
  try{
    const response= await rp(options)
    return response
  }
  catch(err){
   console.log(err.message);
  } 
}

async function getGames(steam64){
  const options = {
  uri:`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`,
  qs:{
    key : "D295314B96B79961B1AB2A2457BA5B10",
    steamid:steam64,
    include_appinfo:1,
    include_played_free_games:1
  },
  json:true
  }
  try{
    const response = await rp(options);
    return response;
  }
  catch(err){
    throw new Error("Games list private");
   } 
}


app.listen(process.env.PORT || 3001, process.env.IP, function () {
  console.log("Steam Checker Started");
})