var fs = require("fs"); //fs is the Node.js File System Module -- https://nodejs.org/api/fs.html
var place = "drafts.txt";

var file = module.exports.file = function (where) {
  place = where;
};

var print = module.exports.print = function (what, where) { //printer.print(msg, where (optional, defaults to results.txt); -- appends as it prints, with a new line
  if(where === undefined) {
    where = place; //Change to desired default output
  }
  fs.appendFileSync(where, "\n" + what);
};

var overprint = module.exports.overprint = function (what, where) { //printer.overprint(msg, where (optional, defaults to here.txt); -- overwrites as it prints, no new line
  if(where === undefined) {
    where = place; //Change to desired default output
  }
  
  fs.writeFileSync(where, what);
};

var kill = module.exports.kill = function (where) { //printer.overprint(filelocation as string) -- deletes file
  fs.unlinkSync(where);
};