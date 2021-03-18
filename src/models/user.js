const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    
    username:String,
    email:String,
    password:String

}) ;
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);




/*
//Hash password before saving
UserSchema.pre('save', function(next) {
    var user = this
  //  if ( !user.isModified('password') ) return next()
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
  // Password verification
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



==================================================================
/*
UserSchema.pre('save',async function(next) {
try{
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(this.password, salt);
  console.log(hashPassword)
  this.password = hashPassword
  next()
}catch(err){
  next(err)
}
})
=================================================================
  bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        throw err
      } else if (!isMatch) {
        console.log("Password doesn't match!")
        return done();
      } else {
        console.log("Password matches!")
      }
    }) 
=================================================================
     if (user.password !== password){
        alert("password is incorrect......");
        console.log("password is incorrect");
        return done();
      }
*/



