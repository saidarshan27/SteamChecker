const mongoose =require("mongoose");

const steamUserSchema = new mongoose.Schema({
  persondata:{},
  objSteamIds:{},
  banObj:{},
  steamLvl : Number,
  steamrepReputation:{},
  faceitInfo:{},
  friends:{
    type:Array,
    default:[]
  },
  updated:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model("SteamUser",steamUserSchema);