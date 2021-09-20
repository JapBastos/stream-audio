import { io } from './http';

interface AudioUser {
  socket_id: string;
  username: string;
  audio: string;
}

interface Message {
  audio: string;
  text: string;
  username: string
  createdAt: Date,
}

const users: AudioUser[] = []
const messages: Message[] = []


io.on('connection', socket => {
  console.log(socket.id);

  socket.on('select_audio', (data, callback) => {
    socket.join(data.audio);

    const userInAudio = users.find(user => user.username === data.username && user.audio === data.audio);

    if (userInAudio) {
      userInAudio.socket_id = socket.id;
    } else {
      users.push({
        audio: data.audio,
        username: data.username,
        socket_id: socket.id
      });
    }

    const messagesAudio = getMessagesAudio(data.audio);
    callback(messagesAudio);
  });

  socket.on('message', data => {
    const message: Message = {
      audio: data.audio,
      username: data.username,
      text: data.message,
      createdAt: new Date()
    };

    messages.push(message);

    io.to(data.audio).emit('message', message);
  })
});

function getMessagesAudio(audio: string) {
  const messagesAudio = messages.filter(message => message.audio === audio)
  return messagesAudio;
}
