const socket = io();
const participantsList = document.getElementById("participants-list");

var LocalClient = function () {
	return {
		init() {
			this.participantName = null;

			this._setListeners()
		},

		_setListeners(){
			socket.on("set_name", (newName) => {
				console.log(activeClients)
			})

			socket.on("client_connected", (activeClients) => {
				console.log(activeClients)
				for (var client of activeClients) {
					this._addParticipantNode(client)
				}
			})

			socket.on("client_disconnected", (name) => {
				this._removeParticipantNode(name)
			})
		},

		createNewParticipant(name) {
			name = name || "participant" + Math.floor(Math.random() * 100)
			socket.emit("client_connected", name)
		},

		setName(name){
			emit("set_name", name)
		},

		_addParticipantNode(name) {
			if (document.getElementById(name)) {
				return;
			}
			var participant = `
				<div id="${name}" class="participant">
					${name} 
				</div>`;
			participantsList.innerHTML += participant
		},

		_removeParticipantNode(name) {
			document.getElementById(name).remove()
		}
	}
}
//
// function notifyAboutNewParticipant(name) {
// 	name = name || "participant" + Math.floor(Math.random() * 100)
// 	socket.emit("client_connected", name)
// }
//
// function addParticipantNode(name) {
// 	if (document.getElementById(name)) {
// 		return;
// 	}
//
// 	var participant = `
// 		<div id="${name}" class="participant">
// 			${name}
// 		</div>
// 	`
// 	participantsList.innerHTML += participant
// }
//
// function removeParticipantNode(name) {
// 	document.getElementById(name).remove()
// }
//
// function setName() {
//
// }

var localClient = new LocalClient()
localClient.init()
localClient.createNewParticipant()

setTimeout(() => {
	localClient.createNewParticipant("doopa")
}, 2000)

// notifyAboutNewParticipant()
