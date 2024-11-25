const User = require('../models/User');

const getUserFromFirebaseUid = async (firebaseUid) => {
    const user = await User.findOne({ firebaseUid: firebaseUid });
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  };

module.exports = getUserFromFirebaseUid;