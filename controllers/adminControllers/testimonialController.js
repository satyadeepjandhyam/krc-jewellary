const Testimonial = require('../../models/adminModels/testimonial'); // Import Testimonial model

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 }); // Sort testimonials by createdAt (newest first)
        return res.render('allTestimonials', {
            testimonials: testimonials,
            success: req.flash('success'), // Show success message if available
            error: req.flash('error'), // Show error message if available
        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/admin/dashboard');
    }
};

// Get a single testimonial by its ID
exports.getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id); // Find testimonial by ID
        if (!testimonial) {
            req.flash('error', 'Testimonial not found');
            return res.redirect('/auth/allTestimonial');
        }
        return res.render('singleTestimonial', {
            testimonial: testimonial,
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/allTestimonial');
    }
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const { name, rating, description } = req.body; // Get form data
        const newTestimonial = new Testimonial({
            name,
            rating,
            description,
        });
        await newTestimonial.save(); // Save the new testimonial to the database
        req.flash('success', 'Testimonial created successfully');
        return res.redirect('/auth/allTestimonial');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Failed to create testimonial');
        return res.redirect('/auth/allTestimonial');
    }
};

// Update an existing testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const { name, rating, description } = req.body; // Get updated data
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, {
            name,
            rating,
            description,
        }, { new: true }); // Update the testimonial and return the updated version
        if (!updatedTestimonial) {
            req.flash('error', 'Testimonial not found');
            return res.redirect('/auth/allTestimonial');
        }
        req.flash('success', 'Testimonial updated successfully');
        return res.redirect(`/auth/getTestimonial/${updatedTestimonial._id}`);
    } catch (error) {
        console.log(error);
        req.flash('error', 'Failed to update testimonial');
        return res.redirect('/auth/allTestimonial');
    }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id); // Delete the testimonial by ID
        if (!testimonial) {
            req.flash('error', 'Testimonial not found');
            return res.redirect('/auth/allTestimonial');
        }
        req.flash('success', 'Testimonial deleted successfully');
        return res.redirect('/auth/allTestimonial');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Failed to delete testimonial');
        return res.redirect('/auth/allTestimonial');
    }
};
