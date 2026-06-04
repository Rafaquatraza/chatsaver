const mongoose = require("mongoose");


// Password contains an '@' character; encode it as '%40' in the URI
mongoose.connect("")
  .then(() => console.log("Connected"))
  .catch(err => console.error(err));