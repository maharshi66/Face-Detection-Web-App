import React from 'react';

const Rank = ({name, entries}) => {
	return (
		<div className="white f3">
			{`${name}, you have looked up `}
			<div className="white f1">
				{`${entries} images`}	
			</div>
		</div>
	);
}
export default Rank;