import "./App.css";
import Echo from "laravel-echo";
import { useEffect } from "react";
const axios = require("axios");

function App() {
  useEffect(() => {
    const id = 3;
    const token = "9|bfXLNVJIbefATHnMeLKydaqAkiKiNFlyzZEO9yWj";

    window.Pusher = require("pusher-js");

    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "Dabill",
      cluster: "mt1",
      forceTLS: true,
      wsHost: "dabill.io",
      wsPort: 6001,
      // authEndpoint: 'http://localhost:8000/broadcasting/auth',
      authorizer: (channel, options) => ({
        authorize: (socketId, callback) => {
          axios
            .post(
              "https://dabill.io/broadcasting/auth",
              {
                socket_id: socketId,
                channel_name: channel.name,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "dabill-authentication": "$2y$10$RkN.GzXUGmn7axD8dR2MTOiFjcIPDPj1I5dbZ31hTwTYcypxy8B8K",
                },
              }
            )
            .then((response) => {
              callback(false, response.data);
            })
            .catch((error) => {
              callback(true, error);
            });
        },
      }),
    });

    window.Echo.private(`Client.${id}`)
      .listen('.client.table.banned', (event) => {
        console.log(event);
      }).listen('.client.table.transferred', (event) => {
        console.log(event);
      }).listen('.client.table.accepted', (event) => {
        console.log(event);
      }).listen('.client.table.rejected', (event) => {
        console.log(event);
      }).listen('.client.table.join', (event) => {
        console.log(event);
      });
    
  }, []);

  return <div className="App" />;
}

export default App;
