import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Set up Twilio client with your credentials
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send invoice via WhatsApp
export const sendInvoiceWhatsApp = async ({ phoneNumber, message, pdfBase64, fileName }) => {
  const mediaUrl = await uploadPDFToServer(pdfBase64, fileName);  // Assume we store PDF in a publicly accessible URL

  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your Twilio WhatsApp number
    to: `whatsapp:${phoneNumber}`,  // Customer's phone number with WhatsApp prefix
    body: message,
    mediaUrl: mediaUrl,  // The URL for the PDF
  });
};

// Helper function to upload PDF to server or cloud storage (like S3)
const uploadPDFToServer = async (pdfBase64, fileName) => {
  // This is just a placeholder; implement actual logic to upload PDF and return its public URL
  // You can use S3, Firebase Storage, or your own server to store the file
  const uploadedFileUrl = "https://example.com/path/to/uploaded-file.pdf"; 
  return uploadedFileUrl;
};
