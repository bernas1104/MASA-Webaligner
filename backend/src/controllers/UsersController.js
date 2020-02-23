const User = require('../models/User');

module.exports = {
    async create(req, res) {
        const { email } = req.body;

        let user = await User.findOne({ email });       // Searches the DB for an user with some email

        if(!user) user = await User.create({ email });  // If user doesn't exist, creates it

        return res.json(user);                          // Returns the user data
    }
}