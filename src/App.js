import "./App.css";
import Echo from "laravel-echo";
import { useEffect } from "react";
const axios = require("axios");

function App() {
  useEffect(() => {
    const id = 1;
    const token = "2|AO5zvvnp2WKVn8Zt6I8JlOIrpuVHC3NHDMmpZrN8";

    window.Pusher = require("pusher-js");

    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "Dabill",
      cluster: "mt1",
      forceTLS: false,
      wsHost: window.location.hostname,
      wsPort: 6001,
      // authEndpoint: 'http://localhost:8000/broadcasting/auth',
      authorizer: (channel, options) => ({
        authorize: (socketId, callback) => {
          axios
            .post(
              "http://localhost:8000/broadcasting/auth",
              {
                socket_id: socketId,
                channel_name: channel.name,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
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

    window.Echo.private(`clients.${id}`).listen(
      '.client.join',
      (event) => {
        console.log(event);
      }
    );
  }, []);

  return <div className="App" />;
}

export default App;
