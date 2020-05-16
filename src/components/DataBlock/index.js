import React, { Component } from 'react'
import style from './style.scss'

class DataBlock extends Component {
	render() {
		return (
			<>
				<div className="container">
					<h3>{this.props.title}</h3>
					<p>Up: {this.props.data} MB/S</p>
				</div>
			</>
		)
	}
}
DataBlock.defaultProps = {
	name: 'Data Block',
	data: 'Loading...',
}
export default DataBlock
