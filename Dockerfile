FROM node:20-alpine

# Install ffmpeg (required for JSMpeg/rtsp-relay mode)
RUN apk add --no-cache ffmpeg

# Create app directory
WORKDIR /usr/src/camviewerplus

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Create config directory
RUN mkdir -p conf

EXPOSE 6900
EXPOSE 6980
EXPOSE 3000

CMD [ "npm", "run", "start-prod" ]