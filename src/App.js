import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import DataBlock from './components/DataBlock'

class App extends Component {
	constructor() {
		super()
		this.state = {
			response: {},
			endpoint: 'http://127.0.0.1:5000',
		}
	}

	componentDidMount() {
		const { endpoint } = this.state
		//Very simply connect to the socket
		const socket = socketIOClient(endpoint)
		socket.on('data', data => this.setState({ response: data }))

		//socket.on('data', data => console.log(data))
	}
	render() {
		const { response } = this.state
		return (
			<>
				<h1>All the Datas</h1>
				<DataBlock
					title="Last Test"
					data={this.state.response.lastTest}
				/>
				<DataBlock
					title="Last Hour"
					data={this.state.response.lastHour}
				/>
				<DataBlock
					title="Last Day"
					data={this.state.response.lastDay}
				/>
				<DataBlock
					title="Last Week"
					data={this.state.response.lastWeek}
				/>
			</>
		)
	}
}
export default App
