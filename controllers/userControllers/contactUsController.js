const { sendMail } = require('../../middleWares/sendEmail');
const ContactUs = require('../../models/adminModels/contactUs'); 


// Create Contact Us Handler
exports. createContactUs = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate request body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const contactEntry = new ContactUs({
      name,
      email,
      subject,
      message
    });

    // Save the entry in the database
    await contactEntry.save();

    // Send the email to the admin
    const emailSubject = `Contact Us Message: ${subject}`;
    const emailText = `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `;

    await sendMail('chswarna94@gmail.com', emailSubject, emailText); 

    // Send response back to the user
    res.status(200).json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing your request', error });
  }
};


