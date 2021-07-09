# 这是用来定制 一个 自己的 mirror 的文件
FROM node:14.15.4
# which mirror : which env

# Create app directory in mirror
WORKDIR /app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# RUN ["可执行文件", "参数1", "参数2"]
# 例如： RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline
# RUN <命令行命令> # <命令行命令> 等同于，在终端操作的 shell 命令

# Bundle app source
COPY . /app

# server 需要打开3000端口
EXPOSE 3000

# 运行这个cmd
# CMD [ "node", "app.js" ]
CMD npm run seeds && \ 
    npm start
