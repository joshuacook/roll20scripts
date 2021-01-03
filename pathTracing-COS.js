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
// Each entit in the group is a list containing an aspect ratio and the name of a character.
// IMPORTANT: the image used must be user uploaded.
// The script should raise an error and provide you with a curl to do so from a marketplace image.

var amberGolem = [[2, "Amber Golem"]]
var guards = [[1, "Flameskull"]];

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

// Utility Functions for handling image inclusion
var getCleanImgsrc = function (imgsrc) {
   var parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/);
   if(parts) {
      return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
   }
   return;
};

// This is the base size used in calculating size with the sizeRatio.
var unitSizeByPage = { "-KnWUb6k-Neq__LyEscP" : 75 }

// Path Tracing Logic

function createNPC(x, y, name, pathId, size, represents, pageId) {
    var character = filterObjs(function(obj) {
      if(obj.get("_type") == "character" && obj.get("name") == represents) return true;
      else return false;
    })[0];
    var hp = getAttrByName(character.id, "npcd_hp");
    var ac = getAttrByName(character.id, "npcd_ac");
    var imgsrc = character["attributes"]["avatar"];

    if (imgsrc.includes("marketplace")) {
      throw "Download and replace marketplace image for " + represents + ": \n" + "curl -o '/Users/joshua.cook/Downloads/beyond/" + represents + ".png' '" + character["attributes"]["avatar"] + "'";
    } else {
      imgsrc = getCleanImgsrc(imgsrc);
    }
    var attrs = {"name": represents, "_pageid": pageId,
                 "bar1_value": hp, "bar2_value": ac, "bar3_value": 0,
                 "left": x, "top": y, "width": size, "height": size, "imgsrc": imgsrc,
                 "layer":"objects", "represents": character.id, "_subtype":"token",
                 "adv_fow_view_distance": pathId
    }
    log(attrs);
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
        npc = createNPC(x, y, name, pathId, size, represents, pageId);
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
