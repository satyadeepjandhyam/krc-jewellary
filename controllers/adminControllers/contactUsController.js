const ContactUs = require('../../models/adminModels/contactUs'); // Adjust the path as needed

module.exports = {
    getMessages: async (req, res) => {
        try {
            const messages = await ContactUs.find().sort({ createdAt: -1 });
            res.render("allContactUs", {
                messages: messages,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.error("Error fetching messages:", error);
            req.flash("error", "Internal server error");
            res.redirect("/auth/admin/dashboard");
        }
    },

    getMessageById: async (req, res) => {
        try {
            const { id } = req.params;
            const message = await ContactUs.findById(id);

            if (!message) {
                req.flash("error", "Message not found");
                return res.redirect("/getAllContactUs");
            }

            res.render("singleContactUs", {
                message: message,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.error("Error fetching message by ID:", error);
            req.flash("error", "Internal server error");
            res.redirect("/auth/admin/dashboard");
        }
    },
};

