/**
 * 
 * --- MANUAL: -----------------------------------------------------------------
 * 
 * --- [1] printer.print() ---
 * 
 *     arguments: what, style, where, newline
 * 
 *         what: what to print. e.g. "foo"
 * 
 *         style: markdown styling; 1-6 for headers, b for bold, i for italics. e.g. "b" or 2 or "5"
 * 
 *         where: where to print, defaults to the default setting of place, at the second line of this program (after the comments). e.g. "here.out"
 * 
 *         newline: whether or not to add a newline; true: add a newline, false: don't add a newline, "md": add two newlines (defaults too true). e.g "md" or false
 * 
 *     e.g. printer.print("output me!", "b", "here.txt", "md"); --> this would append **output me!** to here.txt
 * 
 */

var fs = require("fs"); //fs is the Node.js File System Module -- https://nodejs.org/api/fs.html
var place = "results.txt";

var file = module.exports.file = function (where) {
  place = where;
};

var print = module.exports.print = function (what, /**style,**/ where, newline) { //printer.print(msg, where (optional, defaults to results.txt), newline (optional defaults to true)); -- appends as it prints, with a new line
  
  // BEGIN CONFIGURATION -------------------------------------------------------
  if (where === undefined) {
    where = place; //Change to desired default output
  }
  
  if ( newline == "md" ) {
    newline = "\n\n";
  } else {
    newline = newline == undefined || newline ? "\n" : ""; // DANKE // You're welcome m8! o7
  }
  
  var style = "";
  var styleBeforeAndAfter = false;
  
  // if (style === undefined) {
  //   style = "";
  // } else if ( style < 7 && style > 0 ) { // if 0 < style < 7, then style equals # * style
  //   style = "#".repeat(style) + " ";
  // } else if (style == "i") {
  //   style = "*"
  //   styleBeforeAndAfter = true;
  // } else if (style == "b") {
  //   style = "**"
  //   styleBeforeAndAfter = true;
  // } else {
  //   style = "";
  // }
  
  // END CONFIGURATION ---------------------------------------------------------
  
  var output = styleBeforeAndAfter ? style + what + style + newline : style + what + newline;
  
  fs.appendFileSync(where, output); // THIS IS THE ACTUAL FILE WRITING
  
};

var overprint = module.exports.overprint = function (what, where, nl) { //printer.overprint(msg, where (optional, defaults to here.txt); -- overwrites as it prints, no new line
  if(where === undefined) {
    where = place; //Change to desired default output
  }
  
  fs.writeFileSync(where, what);
};

var shred = module.exports.shred = function (name) {
  fs.unlinkSync(name);
};