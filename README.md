# Summarize-to-Paragraph-API
An API using transformers.js/ONNX for lightweight CPU-powered AI summarizing.

# Setup
npm install

# Usage

*Starting the server*

node bartServer.js portNum
ex. node bartServer.js 8080

*Using the client*

node bartClient.js -t /path/to/textFile ip:portNum
ex. node bartClient.js -t ./podcastTranscript.txt 127.0.0.1:8080

# Compile client into portable binary
npx pkg bartClient.js -t node18-x64/arm64-macos/windows/linux
ex. npx pkg bartClient.js -t node18-x64-linux
