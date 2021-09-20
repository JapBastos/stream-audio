const socket = io('http://localhost:3333');

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get('username');
const audio = urlSearch.get('select_audio');

const usernameDiv = document.getElementById('username');
usernameDiv.innerHTML = `Olá ${username} - Você está na sala: ${audio}`

socket.emit(
  'select_audio', 
  {
    username,
    audio
  },
  (response) => {
    console.log(response);
  }
);

document.getElementById('message_input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const message = event.target.value;

    const data = {
      audio,
      message,
      username
    };

    socket.emit('message', data);

    event.target.value = '';
  }
});

socket.on('message', data => {
  console.log('Mensagem: ', data);

  const messageDiv = document.getElementById('messages');

  messageDiv.innerHTML += `
    <div class="new_message">
      <label class="form-label">
        <strong> ${data.username} </strong> <span> ${data.text} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
      </label>
    </div>
  `
})

console.log('User', username);
console.log('Audio', audio);