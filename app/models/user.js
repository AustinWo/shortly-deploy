var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, index: { unique: true } },
  password:  {type: String, select: false}
});

userSchema.on('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password, hash;
    next();
  });
});

var User = mongoose.model('User', userSchema);

User.prototype.comparePassword= function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if(err){
      callback(err);
    } else {
      callback(isMatch);
    }
  });
};


module.exports = User;
