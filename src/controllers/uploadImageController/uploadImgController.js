const { google } = require('googleapis');
const stream = require('stream');
// const path = require('path');
const { ErrorHandler } = require('../../utils/errorHandler');
// eslint-disable-next-line no-unused-expressions
require('buffer').Blob;

// const dir = process.cwd();
// const KEYFILEPATH = path.join(dir, '/credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
});

const drive = google.drive({
  version: 'v3',
  auth,
});

// upload Image ======
const uploadImageToDrive = async (dynamicParameter) => {
  if (!dynamicParameter.buffer) {
    console.error('Error: Invalid file object');
    return null;
  }
  try {
    const bufferImage = new stream.PassThrough();
    bufferImage.end(dynamicParameter.buffer);
    const { data } = await drive.files.create({
      media: {
        mimeType: dynamicParameter.mimetype,
        body: bufferImage,
      },
      requestBody: {
        name: dynamicParameter.originalname,
        parents: ['1NjYxQczvwAhf4t40G0LNvK4mozeUPEQt'],
      },
      fields: 'id, name',
    });

    return data.id;
  } catch (error) {
    console.error('Error uploading image to Google Drive:', error);
    throw new ErrorHandler('Error uploading image to Google Drive', 500);
  }
};

const updateImageOnDrive = async (fileId, updatedImage) => {
  if (!updatedImage.buffer) {
    console.error('Error: Invalid file object');
    return null;
  }
  try {
    const bufferImage = new stream.PassThrough();
    bufferImage.end(updatedImage.buffer);
    const { data } = await drive.files.update({
      fileId,
      media: {
        mimeType: updatedImage.mimetype,
        body: bufferImage,
      },
      requestBody: {
        name: updatedImage.originalname,
      },
      fields: 'id, name',
    });

    return data.id;
  } catch (error) {
    console.error('Error updating image on Google Drive:', error);
    throw new ErrorHandler('Error updating image on Google Drive', 500);
  }
};

const deleteImage = async (imageRef) => {
  try {
    await drive.files.delete({
      fileId: imageRef,
    });
  } catch (err) {
    throw new ErrorHandler('Error Deleting image on Google Drive', 500);
  }
};

const isImage = (file) => file && file.mimetype.startsWith('image/');

module.exports = {
  uploadImageToDrive,
  updateImageOnDrive,
  deleteImage,
  isImage,
};
