# C-Ville Restaurant Guide


## Install:
Make sure you have Node.JS @5.9.1 or greater installed globally.
Must have Allow-Control-Allow-Origin chrome extension enabled.

Then do: `npm install`

## To Run
Do `npm run start` in the root of this repo, Open a browser at `http://localhost:3000` to see the live app.

--------

## Features
This app displays restaurants in Charlottesville that are currently open. It renders a map with markers on nearby restaurants, assuming the user's location is on The Corner. To view information about a restuarant, click on its marker. To see where a specific restaurant is located, select it from the drop down menu and the map will zoom to center it. 

## The Parts Where I Failed
1. I did not manage to enable the app to take user input and display data for any location. The framework is there. If I were to enable this feature I would set Charlottesville as the default location and take location input in the same sidebar that displays the header and the restaurants. I think I could then pass the location back into the map component and re-render the map with a new api request and a new center. 
2. When I made api requests, I kept getting the "No Access-Control-Allow-Origin" error. I tried using CORS to work around it, but I couldn't really figure it out. I experimented with using a 3rd-party CORS proxy ('cors.io'), but their servers would sporadically reach their quota from other requests and then my request would fail. The only thing I used with consistent results was the Allow-Control-Allow-Origin chrome extension. I know this is patchwork and couln't be used in a real-life application, but I decided I would work for the puropses of this project. 
3. I chose not to use the react-leaflet wrapper, and used vanilla javascript with leaflet in my React component. I installed the react-leaflet wrapper and used it in some early versions of my project. But when I started interacting with the map and adding things to it, the vanilla javascript usage made more sense to me, so I just stuck with that. 




