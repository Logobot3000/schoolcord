let loaded = false;

const get_recent_messages = async () => {
    return await fetch('/api/messages').then((res) => res.json()).then((res) => {
        const recent_messages = res.stored_messages;

        let container = document.getElementById('container');
        container.innerHTML = '';
        console.log(recent_messages);
        for (let i in recent_messages) {
            let message = document.createElement('p');
            message.innerHTML = `${recent_messages[i].display_name}> ${recent_messages[i].text}`;
            container.appendChild(message);
        }
        let messages = document.getElementById('messages');

        if (Math.abs(messages.scrollTop - messages.scrollHeight) <= 500 || !loaded)
            messages.scrollTop = messages.scrollHeight;
            loaded = true
    });
}

setInterval(get_recent_messages, 10);