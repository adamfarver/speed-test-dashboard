import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import DataBlock from './components/DataBlock'
// import style from './style'
class App extends Component {
	constructor() {
		super()
		this.state = {
			response: {
				lastTest: { ul: 'waiting', dl: 'waiting', ping: 'waiting' },
				lastHour: { ul: 'waiting', dl: 'waiting', ping: 'waiting' },
				lastDay: { ul: 'waiting', dl: 'waiting', ping: 'waiting' },
				lastWeek: { ul: 'waiting', dl: 'waiting', ping: 'waiting' },
			},
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
				<div className="flexcontainer">
					<DataBlock
						title="LAST TEST - UP"
						data={response.lastTest.ul}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST TEST - DOWN"
						data={response.lastTest.dl}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST TEST - PING"
						data={response.lastTest.ping}
						datatype="MILLI"
						time="SEC"
					/>
					<DataBlock
						title="LAST HOUR - UP"
						data={response.lastHour.ul}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST HOUR - DOWN"
						data={response.lastHour.dl}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST HOUR - PING"
						data={response.lastHour.ping}
						datatype="MILLI"
						time="SEC"
					/>
					<DataBlock
						title="LAST DAY - UP"
						data={response.lastDay.ul}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST DAY - DOWN"
						data={response.lastDay.dl}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST DAY - PING"
						data={response.lastDay.ping}
						datatype="MILLI"
						time="SEC"
					/>
					<DataBlock
						title="LAST WEEK - UP"
						data={response.lastWeek.ul}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST WEEK - DOWN"
						data={response.lastWeek.dl}
						datatype="MB/"
						time="SEC"
					/>
					<DataBlock
						title="LAST WEEK - PING"
						data={response.lastWeek.ping}
						datatype="MILLI"
						time="SEC"
					/>
				</div>
			</>
		)
	}
}
export default App
