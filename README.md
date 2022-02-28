# ChatEase

### Link : https://ronaks-chat-app.herokuapp.com/

 A chat application that allows users to send text and audio messages with added privilage to "convert text message to speech" & "audio messages to text" with just a click.

### Motivation behind the project:
There are some situations where you can't listen a audio message, maybe you are in a meeting or you are attending a lecture. In this case ChatEase can be of great help. Just use its "Convert to Text" feature and convert your audio message to text in just one click.

### Tech Stack Used:
* Node.js <br />
* Express.js <br />
* Socket.io <br />
* AssemblyAI API <br />
* Speech Synthesis(Web Speech API) <br />
* AWS S3 Bucket <br />
* Heroku
* HTML <br />
* CSS <br />
* Font Awesome<br />

### Getting Started

#### Prerequisites

* Install npm<br />
npm install 

* Create a AssemblyAI account and use your API token in server.js<br />
![Screenshot (160)](https://user-images.githubusercontent.com/66868160/156003369-f0076041-255d-4e2a-b097-0b67f1cf5340.png)

* Create an AWS S3 account and create a new bucket to store audio files
* Fill your S3 Access Key and Secret Access Key in server.js and uncomment the following code<br />
![Screenshot (161)](https://user-images.githubusercontent.com/66868160/156003830-114ffb3a-b91b-4924-9312-588fef8b8281.png)

* To use App locally create a .env file and include the following<br />
S3_KEY=YOUR ACCESS KEY<br />
S3_SECRET= YOUR SECRET ACCESS KEY<br />
S3_BUCKET_NAME = YOUR BUCKET NAME<br />

* Now run your server locally using the following code in your terminal <br />
node server.js


