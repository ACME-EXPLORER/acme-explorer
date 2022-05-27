FROM nginx:1.21.5

WORKDIR /frontend
COPY package*.json ./
RUN apt update
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
RUN npm install
COPY . .
RUN rm /etc/nginx/conf.d/default.conf
COPY config/nginx-frontend.conf /etc/nginx/conf.d/
RUN npm run build