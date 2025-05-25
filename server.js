const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Generate code endpoint
app.post('/api/generate-code', async (req, res) => {
  try {
    // Add your code generation logic here
    const response = {
      success: true,
      code: 'Generated code will go here',
      message: 'Code generated successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating code',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 