import React from "react";
import { useRouter } from 'next/router'
import { useLocation } from "react-dom"

function EditUserPage(props){

    const location = useLocation();

    const last = location.state?.lastName;


    return (
        <>
            <div>
                
            hello, {last}
            </div>
        </>
    )
}

export default EditUserPage;

// retrieve data from index
// change mock data (json) to new changes

//function setUsername(id, newUsername) {
    // for (var i = 0; i < jsonObj.length; i++) {
    //     if (jsonObj[i].Id === id) {
    //       jsonObj[i].Username = newUsername;
    //       return;
    //     }
    //   }
    // }
    
    // // Call as
    // setUsername(3, "Thomas");