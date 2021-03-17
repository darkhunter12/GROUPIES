const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    
    username:String,
    email:String,
    password:String

}) ;


/*Hash password before saving
UserSchema.pre('save', function(next) {
    var user = this
  
    if ( !user.isModified('password') ) return next()
  
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })

  /* Password verification
UserSchema.methods.login = function(password) {
  var user = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if ( err ) { reject(err) }
      resolve()
    })
  })
}
*/

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);

