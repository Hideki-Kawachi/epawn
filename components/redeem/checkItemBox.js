import React, {useState} from "react";
import ItemCard from "../itemcard";
function CheckItem({itemName, itemType, itemPrice}) {

  const [selected, setSelected] = useState(false)

  return (
    <div className="flex flex-row">
      <ItemCard
        itemName={itemName}
        itemType={itemType}
        itemPrice={itemPrice}
      ></ItemCard>
      <div className="mt-10">
        <input
          type="checkbox"
          name="selected"
          value="true"
          onChange={(e) => setSelected(e.target.value)}
        />
      </div>
    </div>
  );
}

export default CheckItem;
