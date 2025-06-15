const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());


app.post('/api/generate-code', async (req, res) => {
  try {
    
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


// the student page should be a page where i can upload my certificates with certificate id and issuer, and see the certificates i have already uploaded with certification codes that changes after it has been used for verfication, and any other nessacary details. the main page is the page where the certificates are checked with code if verifed
// all uploaded certificates are automatically verfied when the user puts in the certificate id and issuer 