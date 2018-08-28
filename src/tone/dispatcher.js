export default class Dispatcher {
	constructor() {
		this.subscribers = {}
	}

	connect (key, callback) {
		this.subscribers[key] = callback
	}

	disconnect (key) {
		this.subscribers[key] && delete this.subscribers[key]
	}

	dispatch (action) {
		Object.values(this.subscribers).forEach(callback => callback(action))
	}
}
