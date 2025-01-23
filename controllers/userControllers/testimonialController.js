const Testimonial = require('../../models/adminModels/testimonial');

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, rating, description } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating should be between 1 and 5' });
    }

    const newTestimonial = new Testimonial({ name, rating, description });
    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message,
    });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    if (testimonials.length === 0) {
      return res.status(404).json({ success: false, message: 'No testimonials found' });
    }
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching testimonials', error: error.message });
  }
};

// Delete a testimonial by ID
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting testimonial', error: error.message });
  }
};
