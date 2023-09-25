FROM node:16.17.0-alpine

RUN apk update
RUN apk add --update --no-cache curl py-pip
RUN apk add --virtual build-dependencies build-base gcc make

ADD . /todo
WORKDIR /todo

RUN find . -maxdepth 4 -name package.json -exec sh -c 'for file do dir=${file%/*}; cd $dir; echo $(pwd); npm install; cd /todo; done' sh {} +

RUN cd /todo/Credibility-Development-Kit/metrics && find . -maxdepth 3 -name package.json -exec sh -c 'for file do dir=${file%/*}; cd $dir; echo $(pwd); npm install; cd /todo/Credibility-Development-Kit/metrics; done' sh {} +

# find . -maxdepth 3 -name package.json -exec dirname "$0" \;

# docker build -t upsim-ci -f ./ci/Dockerfile .
# docker run -it --rm upsim-ci sh

# find . -maxdepth 4 -name package.json -exec sh -c 'for file do dir=${file%/*}; cd $dir; echo $(pwd) >> /todo/test.report; npm run test >> /todo/test.report; cd /todo; done' sh {} +