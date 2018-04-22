import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema } = mongoose;

const userSchema = new Schema({
  method : {  
    type: String,
    enum : ['local', 'google', 'facebook'],
    required : true
  },
  local : {
    email : {
      type: String,
      lowercase:true
    },
    password : {
      type : String,
    }
  },
  google : {
    id : {
      type : String
    },
    email : {
      type : String,
      lowercase : true
    }
  },
  facebook : {
    id : {
      type : String
    },
    email : {
      type : String,
      lowercase : true
    }
  }
});

userSchema.pre('save', async function (next) {
  try {
    if (this.method !== 'local')
      {
        next();
      }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.local.password , salt);
    this.local.password = passwordHash;
    next();
  } catch(error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try{
    return await bcrypt.compare(newPassword, this.local.password); //return blloean
  }catch(error)
  {
    throw new Error(error);
  }
}

const User = mongoose.model('user', userSchema );
export default User;

