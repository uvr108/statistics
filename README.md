# rethinkdb



sudo docker run --name myRethinkDB -v "$pwd:/data" -d -p 8080:8080 -p 28015:28015 -p 29015:29015 rethinkdb:2.4.2-bullseye-slim
sudo docker [stop/start/rm] myRethinkDB


# rest-server

sudo docker build . -t rest-server
sudo docker run --name rest-cont -d -p 3000:3000 -p 28015:28015 -p 29015:29015 rest-server
