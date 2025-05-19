const fs = require('fs');
require('dotenv').config();

const { google } = require('googleapis');

// const apikeys = require('./apikey.json');

const apiKey = {
  type: "service_account",
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL
};

console.log(apiKey.client_email);

const SCOPE = [
    'https://www.googleapis.com/auth/drive'];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apiKey.client_email,
        null,
        apiKey.private_key,
        SCOPE
    );
    await jwtClient.authorize();
    
    return jwtClient;
}


// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient){
    console.log('Uploading file to Google Drive...');
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 
        var fileMetaData = {
            name:'test.txt', // file name 
            parents:['149JwIKVXdm_zD_1WFS2S_c19VN9-X-Q7'] // A folder ID to which file will get uploaded
        }
        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream('test.txt'), // files that will get uploaded
                mimeType:'text/plain'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            console.log('Uploaded...')
            resolve(file);
        })
    });
}
authorize()
.then(uploadFile)
.catch("error",console.error()); // function call
