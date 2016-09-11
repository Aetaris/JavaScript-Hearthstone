var fs = require("fs"); //fs is the Node.js File System Module -- https://nodejs.org/api/fs.html
var place = "results.txt";

var file = module.exports.file = function (where) {
  place = where;
};

var print = module.exports.print = function (what, where, nl) { //printer.print(msg, where (optional, defaults to results.txt), newline (optional defaults to true)); -- appends as it prints, with a new line
  if(where === undefined) {
    where = place; //Change to desired default output
  }
  if(nl === undefined) {
    nl = true;
  }
  if(nl) {
    fs.appendFileSync(where, what + "\n");
  } else {
    fs.appendFileSync(where, what)
  }
  
};

var overprint = module.exports.overprint = function (what, where, nl) { //printer.overprint(msg, where (optional, defaults to here.txt); -- overwrites as it prints, no new line
  if(where === undefined) {
    where = place; //Change to desired default output
  }
  
  fs.writeFileSync(where, what);
};

var make = module.exports.make = function (name, where, mkdir) {
  if(where === undefined) {
    overprint("", name);
  } else {
    overprint("", where + name);
  }
};

var shred = module.exports.shred = function (name) {
  fs.unlinkSync(name);
};