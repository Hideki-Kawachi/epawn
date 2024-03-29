import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function LikeButton() {
	const [liked, setLiked] = useState(false);

	const handleLike = () => {
		setLiked(!liked);
	};

	return (
		<div onClick={handleLike} className="scale-150">
			{liked ? <FaHeart color="red" /> : <FaRegHeart />}
		</div>
	);
}

export default LikeButton;
