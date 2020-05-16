import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import DataBlock from './components/DataBlock'

class App extends Component {
	constructor() {
		super()
		this.state = {
			response: { lastTest: { ul: 'waiting' } },
			endpoint: 'http://127.0.0.1:5000',
		}
	}

	componentDidMount() {
		const { endpoint } = this.state
		//Very simply connect to the socket
		const socket = socketIOClient(endpoint)
		socket.on('data', (data) => this.setState({ response: data }))
		//socket.on('data', data => console.log(data))
	}
	render() {
		const { response } = this.state
		return (
			<>
				<h1>All the Datas</h1>
				<DataBlock title="LAST TEST - UP" data={response.lastTest.ul} />
			</>
		)
	}
}
export default App
