import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imgUrl}) => {
	return (
		<div className="center">
			<img className="faceDetectImg" src={imgUrl} alt={""} width="500px" height="auto"/>
		</div>
	)
}

export default FaceRecognition;