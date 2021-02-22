const socket = io();
const participantsList = document.getElementById("participants-list");
const $main = $("#main")
const $lobby = $("#lobby")
const $lobbyInput = $lobby.find("input")
const $lobbyButton = $lobby.find("button")
const $messageButton = $main.find("button")
const $messageInput = $main.find("input")


class LocalClient {

	constructor() {
		this.myName = null;
		this._setListeners()
	}


	createNewParticipant(name) {
		name = name || "participant" + Math.floor(Math.random() * 100)
		socket.emit("client_connected", name)
		this.getMyName()
	}
	sendMessage(message){
		socket.emit("message", message)
	}
	_setListeners() {
		socket.on("get_my_name", (name) => {
			console.log(name)
			this.myName = name;
		})

		socket.on("client_connected", (activeClients) => {
			console.log(activeClients)
			for (var client of activeClients) {
				this._addParticipantNode(client)
			}
		})

		socket.on("initial_messages", (messages) => {
			for (var msg of messages){
				this._addMessageNode(msg)
			}
		})

		socket.on("message", (messageObj) => {
			this._addMessageNode(messageObj)
		})

		socket.on("client_disconnected", (name) => {
			this._removeParticipantNode(name)
		})
	}
	getMyName() {
		socket.emit("get_my_name")
	}
	_addMessageNode(messageObj) {
		const owner = messageObj.owner, message = messageObj.message;
		let time = new Date(messageObj.time)
		let h = time.getHours()
		let m = time.getMinutes()
		h = h < 10 ? '0' + h : h;
		m = m < 10 ? '0' + m : m;
		time = h + ":" + m

		if(owner === this.myName){
			$("#messages-box").append(`
				<div class="message-wrapper">
					<div class="message mine">
						<div class="msg-box">${message}</div>
						<div class="info-box">
							<div class="time-label">${time}</div>
						</div>
					</div>
				</div>
			`)
		} else {
			$("#messages-box").append(`
				<div class="message-wrapper">
					<div class="message">
						<div class="msg-box">${message}</div>
						<div class="info-box">
							<div class="owner-label">${owner}</div>
							<div class="time-label">${time}</div>
						</div>
					</div>
				</div>
			`)
		}
	}
	_addParticipantNode(name) {
		if (document.getElementById(name)) {
			return;
		}
		var participant = `
				<div id="${name}" class="participant">
					${name}
				</div>`;
		participantsList.innerHTML += participant
	}
	_removeParticipantNode(name) {
		document.getElementById(name).remove()
	}
}




var localClient = null;

$main.hide()
$lobbyButton.focus()

$messageInput.keyup(() => {
	if($messageInput.val() === ''){
		$messageButton.prop('disabled', true)
	} else {
		$messageButton.prop('disabled', false)
	}
})

$lobbyButton.click(() => {
	localClient = new LocalClient()
	localClient.createNewParticipant($lobbyInput.val())
	$main.show()
	$lobby.hide()
	$messageInput.focus()
})

$messageButton.click(() => {
	localClient.sendMessage($messageInput.val())
	$messageInput.val('')
})
$messageInput.keydown((key)=> {
	if (key.which === 13){
		localClient.sendMessage($messageInput.val())
		$messageInput.val('')
	}
})
