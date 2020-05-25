import React, { Component } from 'react'
import styles from './style.module'
class DataBlock extends Component {
	render() {
		return (
			<>
				<div className={styles.container}>
					<div className={styles.top}>
						<h3>{this.props.data}</h3>
						<h3 className={styles.datatype}>
							{this.props.datatype}
							<span>{this.props.time}</span>
						</h3>
					</div>

					<div className={styles.bottom}>
						<p>{this.props.title}</p>
					</div>
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
