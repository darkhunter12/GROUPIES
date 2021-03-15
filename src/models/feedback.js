const mongoose = require("mongoose");
const feedSchema = new mongoose.Schema({ 
    name: String, 
    email: String, 
    feedback: String 
}); 
  


module.exports = mongoose.model("feed",feedSchema);