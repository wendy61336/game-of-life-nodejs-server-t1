## Heroku App

https://calm-depths-57678.herokuapp.com/
## Install
```
$ npm install

```
## Run

Run server
```
$ npm start
``` 
# Coding Concept
1. When this service start, init a checkerboard, a userid-> colorInfo map

2. When receive client's init request, randomly generate userId & color for this client, record the mapping relationship between userId & color 

3. When receive client's click request, base on click location & assigned pattern & userId, record a list of ClickSquare

4. EverySecond use the rule of game-of-life to generate the next checkerboard, after calculating the next checkerboard, The list of ClickSquare need to be covered directly to the result (Color will be based on the lastest clicker. Click event's priority is higher than calculating result)
Finally boardcast to every connected clients by websocket.

# Coding files

game-of-life-nodejs-server-t1/ws.js
--> contains must of logic
1. receive message from clients
2. calculate the game-of-life rules then update once per second
3. websocket issue

game-of-life-nodejs-server-t1/pattern.js  
--> define the patterns of game-of-life
The concept is, the client's click location is the must left-upper square of the patterns.
So every pattern can be represent by a list of PatternShift( xShift, yShift ) & clickLocation(currentX, currentY).








## Reference
 - [https://github.com/wahengchang/nodejs-websocket-example](https://github.com/wahengchang/nodejs-websocket-example)
 - [https://github.com/websockets/ws](https://github.com/websockets/ws)

