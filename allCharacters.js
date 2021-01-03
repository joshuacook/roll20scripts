on("ready", function() {
    var list_of_all_objs = filterObjs(function(obj) {
      if(obj.get("_type") == "character") return true;
      else return false;
    });
    var charName = "Guardian Portrait";
    var character = filterObjs(function(obj) {
      if(obj.get("_type") == "character" && obj.get("name") == charName) return true;
      else return false;
    })[0];
    // log(list_of_all_objs);
    log("curl -o '/Users/joshua.cook/Downloads/beyond/" + charName + ".png' '" + character["attributes"]["avatar"] + "'")
});
