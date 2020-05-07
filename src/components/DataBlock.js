import React, { Component } from 'react'

class DataBlock extends Component {
	render() {
		return (
			<>
				<h3>{this.props.title}</h3>
				<p>Down: {this.props.data.dl} MB/S</p>
				<p>Up: {this.props.data.ul} MB/S</p>
				<p>Ping: {this.props.data.ping} MS</p>
			</>
		)
	}
}
DataBlock.defaultProps = {
	name: 'Data Block',
	data: { ul: 'Loading...', dl: 'Loading...', ping: 'Loading...' },
}
export default DataBlock
