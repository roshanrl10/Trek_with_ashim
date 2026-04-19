// mongoose lets us define schemas and models
const mongoose = require('mongoose');

// bcryptjs is used to encrypt (hash) passwords
// A hash is a one-way transformation — you can't reverse it
// So even if someone steals the database, they can't read the passwords
const bcrypt = require('bcryptjs');

// Define the shape of a user document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // this field must exist — MongoDB will reject the document without it
    },
    email: {
      type: String,
      required: true,
      unique: true,    // no two users can have the same email
      lowercase: true, // automatically converts "ASHIM@gmail.com" to "ashim@gmail.com"
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'], // only these two values are allowed
      default: 'user',         // if no role is given, it defaults to 'user'
    },
  },
  {
    // timestamps automatically adds "createdAt" and "updatedAt" fields
    // mongoose manages these for you — you never set them manually
    timestamps: true,
  }
);

// MIDDLEWARE — this runs automatically BEFORE a user is saved to the database
// "pre('save')" means: before saving, run this function
userSchema.pre('save', async function (next) {
  // "this" refers to the user document being saved

  // If the password wasn't changed, skip hashing (important for updates)
  // Without this check, every time you update a user's name, the password gets hashed again
  if (!this.isModified('password')) return next();

  // Hash the password — "12" is the salt rounds (higher = more secure but slower)
  // 12 is the industry standard
  this.password = await bcrypt.hash(this.password, 12);

  // Call next() to continue saving
  next();
});

// A custom method on every user document
// This lets us do: user.matchPassword("enteredPassword")
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare hashes the entered password and compares it to the stored hash
  // Returns true or false
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from the schema and export it
// mongoose.model('User', userSchema) creates a 'users' collection in MongoDB
module.exports = mongoose.model('User', userSchema);