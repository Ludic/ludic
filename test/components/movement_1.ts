import Component from 'ein'

export default class MovementComponent implements Component {
	public velocityX: number
	public velocityY: number

	constructor(velocityX: number, velocityY: number) {
		this.velocityX = velocityX
		this.velocityY = velocityY
	}
}
