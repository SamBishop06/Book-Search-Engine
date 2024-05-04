// Import the User model and the signToken function from the auth.js file in the utils folder
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Resolvers variable that holds the query and mutation logic
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // Check if the user is authenticated
            if (context.user) {
                // If authenticated, fetch user data
                const user = await User.findById(context.user._id);
                return user;
            }
            // If not authenticated, throw an error
            throw new Error('You need to be logged in!');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            // Find user by email
            const user = await User.findOne({ email });
            // If user not found, throw an error
            if (!user) {
                throw new Error('No user with this email found!');
            }
            // Check if password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If password is incorrect, throw an error
            if (!correctPw) {
                throw new Error('Incorrect password!');
            }
            // Sign JWT token for the user
            const token = signToken(user);
            // Return token and user data
            return { token, user };
        },
        addUser: async (parent, args) => {
            // Create a new user
            const user = await User.create(args);
            // Sign JWT token for the new user
            const token = signToken(user);
            // Return token and user data
            return { token, user };
        },
        saveBook: async (parent, { input }, context) => {
            // Check if user is authenticated
            if (!context.user) {
                throw new Error('You need to be logged in to save a book!');
            }
            // Update user's savedBooks array with the new book
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },
        removeBook: async (parent, { bookId }, context) => {
            // Check if user is authenticated
            if (!context.user) {
                throw new Error('You need to be logged in to remove a book!');
            }
            // Remove book from user's savedBooks array
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        },
    },
};

// Export the resolvers
module.exports = resolvers;
