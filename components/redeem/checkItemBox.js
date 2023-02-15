import React from "react";
import ItemCard from "../itemcard";
function CheckItem() {
  return (
    <div className="flex flex-row">
      <ItemCard></ItemCard>
      <div className="mt-10">
        <input type="checkbox" />
      </div>
    </div>
  );
}

export default CheckItem;
