// Path Tracing
// You associate a color with a group of creature, monster, or NPC entities.
// You then draw a polygon path using that color on the GM layer.
// When you type `!step`, a token from that group will be randomly created and will begin tracing that path.
//
// You can use status markers to add additional behavior
// purple: walk the path backward
// green: walk the path in a loop
// dead: entity is dead (don't move, don't create a new entity)
// red: entity is hostile to characters (yield control to gm, don't create a new entity)
// yellow: entity is scared of characters

// 1. Create a new or use an existing entityGroup
// If multiple entities are added to an entity group, they will be randomly selected at creation time.
// Unless the entity is set to loop, it will disappear when reaching the end of the path and respawnThe w on next step.
// To associate a single creature, monster, or NPC with a color, simply create a list of length one.
var commoners = [];
var dinosaurs = [];
var guards = [];
var skeletonKeys = [];
var tombDwarfs = [];
var tombGuardians = [];
var zombies = [];

// 2. Associate the entityGroup with a color. The path to be traced should be drawn using this color on the GM Layer.
var pathIdEntities = {
  "#ff0000" : commoners,
  "#00ffff" : dinosaurs,
  "#ff9900" : guards,
  "#660000" : skeletonKeys,
  "#000033" : tombDwarfs,
  "#000066" : tombGuardians,
  "#00ff00" : zombies,
}

// 3. Upload the TOKEN IMAGE desired. Add the TOKEN IMAGE to the map, select it.
//    Type `!user-image` in the chat window.
//    This will tell you the imageUrl of the image in roll 20.
// 4. Add the Creature, Monster, or NPC with which you would like to associate to the game and select it.
//    Type`@{selected|character_id}` in the chat window.
//    This will tell you the characterId
// 5. Create a list of atttributes with the following format and add it to the desired entityGroup
//    [sizeRatio,  characterId, AnyName, getCleanImgsrc(imageUrl)]

// Utility Functions for handling image inclusion
var getCleanImgsrc = function (imgsrc) {
   var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/);
   if(parts) {
      return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
   }
   return;
};

// Random List of Chultan Names for Tomb of Annihilation
// This can be used to create a random name for a Chultan Commoner
var chultanNames = ["Karafa Senghore", "Abu Kinte", "Musa Sarr", "Suma Mbye", "Suntukung Jaiteh", "Baboucar Mansaray", "Juma Ceesay", "Jibril Gaye", "Longcan Soley", "Duwa Sanneh", "Kabir Singateh", "Sidibeh Mboob", "Alieu Kargbo", "Hatabu Diene", "Paboy Dibba", "Jamang Jawara", "Alanso Ba", "Boro Kouyaté", "Yankubah Condeh", "Ebrima Sidibeh", "Fafa Sidibeh", "Burama Janneh", "Jonkong Hairte", "Yankubah Sowe", "Kekoto Kayode", "Adama Sohna", "Boro Gassama", "Bassirou Coote", "Assan Diouf", "Kutubo Ceesay", "Isa Sarr", "Kunta Janneh", "Birom Kabbah", "Jamang Jobateh", "Baturou Mbye", "Ousman Ceesay", "Antouman Ndaw", "Banja Jawara", "Sherif Marong", "Abdou Condé", "Alanso Kah", "Sainey Sidibeh", "Musakuta Jarju", "Mampol Biri", "Awa Niang", "Musu Darboe", "Bintu Kinte", "Sajo Kaba", "Mboose Keita", "Haddy Jobateh", "Kunda Niang", "Kaddy Dieye", "Maimuna Touray", "Kenenjaye Ngum", "Fatoumatta Jawo", "Sohna Kinteh", "Sajo Secka", "Musukuta Conateh", "Satang Sarr", "Joñi Diouf", "Filijee Diouf", "Fanta Faye", "Hadang Guiss", "Kadijatou Kaba", "Daba Kabbah", "Mama Singateh", "Kinti Touré", "Birta Corr", "Sanji Dione", "Pahali Sohna", "Nyonkoling Jagne", "Ramatoulie Coote", "Isatou Kinteh", "Filije Gaye", "Fanta Jawara", "Sarjo Badjie", "Khadijatu Jammeh", "Suntukung Mansaré", "Sona Sesay", "Sukai Dabo"];

commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834338/mS6j3ngoHcyP6-T59QabcQ/med.png?1578175309")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834219/dpxpwvi1lZ2ZdqpGqCL_EA/med.png?1578175248")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834195/ocz0DVClAQrRO5iHre_EqQ/med.png?1578175235")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834313/HKSFYXjBIqadLP7rccIjzQ/med.png?1578175293")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834326/CNxuHRl8C52DSUq166dA8w/med.png?1578175300")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834165/SgHF8ENCnR03E_SvUnLZcQ/med.png?1578175214")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834229/S8Ze-wGxon6jWbmg4MftpQ/med.png?1578175257")])
commoners.push([1, "-KnAx6guDuqplCfFzKX6", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100834188/6_PbYC1v5Kya7s-p0lyv0w/med.png?1578175229")])
dinosaurs.push([3, "-KnBVxK4FbdqbFPWLajV", "triceratops", getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100846984/9yP-7xa-s18dWxlebO-I_A/original.png?15781832585")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835295/j2yxCXai3IMWgwLPcOsPUQ/original.png?157817588055")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835195/b50tBheCy18rqiTNgG7WMw/original.png?157817580955")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835224/-rwn3n0JJInknnr1-bXeuQ/original.png?15781758285")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835187/suOJDh9OvZI59jHFnYOdgQ/original.png?157817581055")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835214/41FQN5hbWoaT1GKmNjrIng/original.png?15781758225")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835213/rBVpVl04GcnTXmomMyP0nQ/original.png?15781758205")])
guards.push([1, "-KnB-Q4G4cDIe4AXsR3S", _.sample(chultanNames), getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100835208/5Cl50wmIE2DsxwGsRllMTQ/original.png?15781758175")])
skeletonKeys.push([1, "-KqPfCW_-cC0BbU5liga", "skeletonkey", getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/189496733/340BtzFMoQ9-uj2U6OrKAA/thumb.png?1609605443")])
tombDwarfs.push([1, "-KoApqw6m_csRZ3S4mBz", "tomb dwarf", getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/189554256/zyU3W7DL0IUQ437aNikRvg/thumb.png?1609617032")])
tombGuardians.push([1, "-KoAthdLw3bgjyXyarRW", "tomb guardians", getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/189561596/B7M5CU8NtlxIKhMByOoNNw/thumb.png?1609617923")])
zombies.push([1, "-KnSxZXQtEsfkzQHSOVL", "zombie", getCleanImgsrc("https://s3.amazonaws.com/files.d20.io/images/100858324/df2WWHjhcG2Acqzems4Pzg/original.png?15781901025")])

// This is the base size used in calculating size with the sizeRatio.
var unitSizeByPage = { "-KnWUb6k-Neq__LyEscP" : 75 }

// Path Tracing Logic

function createNPC(x, y, name, pathId, img, size, represents, pageId) {
    var character = getObj("character", represents);
    var hp = getAttrByName(character.id, "npcd_hp");
    var ac = getAttrByName(character.id, "npcd_ac");
    var attrs = {"name": name, "_pageid": pageId,
                 "bar1_value": hp, "bar2_value": ac, "bar3_value": 0,
                 "left":x, "top":y, "width":size, "height":size, "imgsrc": img,
                 "layer":"objects", "represents": represents, "_subtype":"token",
                 "adv_fow_view_distance": pathId
    }
    var createdNPC = createObj("graphic", attrs);
    character.get("bio", function(bio) {
        createdNPC.set("gmnotes", bio); //do something with the character bio here.
    });
    return createdNPC
}

function getNPC(name) {
  return findObjs({"_type" : "graphic", "adv_fow_view_distance" : name})[0];
}

function getOrCreateNPC(adjustedPath, pathId, pageId) {
    var color = colorForPathId(pathId, pageId);

    var npc = getNPC(pathId);

    if (npc == null) {
        var sampleList = pathIdEntities[color];
        var x = adjustedPath[0][0];
        var y = adjustedPath[0][1];
        var npc_attrs =  _.sample(sampleList);
        var unitSize = unitSizeByPage[pageId] || 75;
        var size = npc_attrs[0] * unitSize;
        var represents = npc_attrs[1];
        var name = npc_attrs[2];
        var img = npc_attrs[3];
        npc = createNPC(x, y, name, pathId, img, size, represents, pageId);
        if (color == "#0000ff") {
          npc.set("statusmarkers", "green");
        }
    }
    return npc;
}

function getPathIds(pageId) {
    var searchAttrs = {"_pageid": pageId, "_type": "path", "layer" : "gmlayer"};
    var paths = findObjs(searchAttrs);
    var pathIds = [];
    _.each(paths, function(path){
        var pathId = path.get("_id");
        pathIds.push(pathId);
    })
    return pathIds;
}

function colorForPathId(pathId, pageId) {
    var searchAttrs = {"_pageid": pageId, "_type": "path", "_id" : pathId};
    var thisRun = findObjs(searchAttrs)[0];
    var color = thisRun.get("stroke");
    return color;
}

function createAdjustedPath(pathId, pageId) {
    var searchAttrs = {"_pageid": pageId, "_type": "path", "_id" : pathId};
    var thisRun = findObjs(searchAttrs)[0];
    var globX = thisRun.get("left") - thisRun.get("width")/2;
    var globY = thisRun.get("top") - thisRun.get("height")/2;
    var path = JSON.parse(thisRun.get("_path"));
    var adjustedPath = [];
    var x, y;
    _.each(path, function(loc){
        x = loc[1] + globX;
        y = loc[2] + globY;
        adjustedPath.push([x, y]);
    });

    return adjustedPath;
}

function activeNPCIsHostile(npc) {
    return (npc.get("aura2_color") == "#ff0000");
}

function getActiveNPCValues(npc, adjustedPath) {
    var name = npc.get("name");
    var step = parseInt(npc.get("bar3_value"));
    var statusmarkers = npc.get("statusmarkers");
    var backward = statusmarkers.includes("purple");
    var looping = statusmarkers.includes("green");
    var hostile = statusmarkers.includes("red");
    var dead = statusmarkers.includes("dead");
    var scared = statusmarkers.includes("yellow");
    var remove = false;

    if (!hostile && !dead && !scared) {

      if (step == (adjustedPath.length - 1) ) {
          if (looping) {
              backward = true;
              if (!statusmarkers.includes("purple")) statusmarkers += ",purple";
              npc.set("statusmarkers", statusmarkers);
          } else {
              remove = true;
          }
      }
      if (step == 0) {
          backward = false;
          statusmarkers = statusmarkers.split(",");
          var filtered = statusmarkers.filter(function(value, index, arr){
            return value != "purple";
          });
          statusmarkers = filtered.join();
          npc.set("statusmarkers", statusmarkers);
      }

      if (!remove) {
          if (backward) {
            step = step - 1;
          } else {
            step = step + 1;
          }
      }
    }

    return {
      "step" : step,
      "backward" : backward,
      "looping" : looping,
      "remove" : remove,
      "hostile" : hostile
    };
}

function walkPath (pathId, pageId) {
    var adjustedPath = createAdjustedPath(pathId, pageId);
    var npc = getOrCreateNPC(adjustedPath, pathId, pageId);
    var moveValues = getActiveNPCValues(npc, adjustedPath);
    var step = moveValues["step"];
    var backward = moveValues["backward"];
    var looping = moveValues["looping"];
    var remove = moveValues["remove"];
    var hostile = moveValues["hostile"];

    loc = adjustedPath[step];
    npc.set({"left":loc[0], "top": loc[1]});

    npc.set({"bar3_value" : step});
    if (remove) {
        npc.remove();
        npc = getOrCreateNPC(adjustedPath, pathId, pageId);
    }
    return npc;
}

// User Interface

on("chat:message", function(msg) {
    var pageId = Campaign().get("playerpageid");
    if (msg.content.includes("!step")) {
        var pathIds = getPathIds(pageId);
        // log("step received")
        _.each(pathIds, function(pathId) {
            walkPath(pathId, pageId);
        })
    } else if ('api' === msg.type && msg.content.match(/^!user-image/) && playerIsGM(msg.playerid) ){
        let who=getObj('player',msg.playerid).get('_displayname'),
            output = _.chain(msg.selected)
                .map( s => getObj('graphic',s._id))
                .reject(_.isUndefined)
                .map( o => o.get('imgsrc') )
                .map( getCleanImgsrc )
                .reject(_.isUndefined)
                .map(u => `<div><img src="${u}" style="max-width: 3em;max-height: 3em;border:1px solid #333; background-color: #999; border-radius: .2em;"><code>${u}</code></div>`)
                .value()
                .join('') || `<span style="color: #aa3333; font-weight:bold;">No selected tokens have images in a user library.</span>`
                ;

        sendChat('UserImage',`/w "${who}" <div>${output}</div>`);
    }
});
