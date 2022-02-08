const id = 4;
const token = "81|vqoTkB73rGb1pMxX5z1HZz3o4qw1HXzqI3MXfJ6r";
const socket = new WebSocket("wss://dabill.io/app/Dabill?protocol=7&client=js&version=7.0.3&flash=false");

// Connection opened
socket.addEventListener('open', function (event) {
  console.log(event);
});

// Listen for messages
socket.addEventListener('message', function (event) {
  const response = JSON.parse(event.data)
  switch (response.event) {
    case 'pusher:connection_established':
      connection_established(response);
      break;
    case 'pusher_internal:subscription_succeeded':
      console.log(event);
      break;
    case 'pusher:pong':
      console.log(event);
    break;
    case '.order.created':
      response.channel === `private-Client.${id}` && console.log(response);
      // Ejemplo de un evento, llamar a esta funcion
      // orderCreated();
    break;
    default:
      console.log(response.event, " not implemented");
      break;
  }
});

function connection_established(response) {
  const data = JSON.parse(response.data);
  console.log('Connection Established: ', data.socket_id);
  fetch("https://dabill.io/broadcasting/auth", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Dabill-Authentication": "$2y$10$RkN.GzXUGmn7axD8dR2MTOiFjcIPDPj1I5dbZ31hTwTYcypxy8B8K",
      "Accept": "application/json",
      "Content-Type": "application/json",
    }, body: JSON.stringify({
      "socket_id": data.socket_id,
      "channel_name": `private-Client.${id}`,
    })
  }).then(response => response.json()).then(data => {
    console.log(data.auth);
    suscribe(data)
  });
}

function suscribe(data) {
  socket.send(JSON.stringify({
    "data": {
      "auth": data.auth,
      "channel": `private-Client.${id}`,
    },
    "event": "pusher:subscribe",
  }));
}
