const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// Email endpoint
app.post('/send', upload.array('documents'), async (req, res) => {
  try {
    console.log('Received form submission');
    console.log('Files received:', req.files?.length || 0);
    console.log('Form data received:', req.body);

    const formData = req.body;
    const files = req.files || [];

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Create email content
    const emailContent = `
New University Application Form Submission:

Personal Information:
Full Name: ${formData.firstName} ${formData.lastName}
Birth Date: ${formData.month}/${formData.day}/${formData.year}
Email: ${formData.email}
Phone: ${formData.phone}

Address:
Street: ${formData.address}
City: ${formData.city}
State: ${formData.state}
Postal Code: ${formData.postalCode}
Country: ${formData.country}

Emergency Contact:
Name: ${formData.emergencyName}
Relationship: ${formData.emergencyRelation}
Phone: ${formData.emergencyPhone}
Email: ${formData.emergencyEmail}
Address: ${formData.emergencyAddress}

Education Details:
${JSON.parse(formData.educationDetails || '[]').map((edu, index) => `
School ${index + 1}:
Name: ${edu.name || 'N/A'}
Qualification: ${edu.qualification || 'N/A'}
Board: ${edu.board || 'N/A'}
Year: ${edu.year || 'N/A'}
Grade: ${edu.grade || 'N/A'}
Backlogs: ${edu.backlogs || 'N/A'}
`).join('\n')}
    `.trim();

    // Prepare attachments
    const attachments = files.map(file => ({
      filename: file.originalname,
      content: file.buffer
    }));

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'uso.uninxtstudyoverseas@gmail.com',
      subject: 'New University Application Form Submission',
      text: emailContent,
      attachments
    };

    console.log('Sending email...');
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set'
  });
}); 