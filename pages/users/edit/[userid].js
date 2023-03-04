import { useRouter } from "next/router"
import React from "react";
import Link from 'next/link';
import NavBar from "../../../components/navigation/navBar";
import Header from "../../../components/header";

// export const getStaticPaths = async() => {

// }

function Edit({currentUser}) {

    const router = useRouter()
    const userid = router.query.userid
    const curr = router.query.currentUser

    // Add NavBar (currentUser) and Header (currentUser)
    return (
        <>
            <NavBar currentUser={currentUser}></NavBar>
			<Header currentUser={currentUser}></Header>


            <div> Details about {userid} </div>
            <div> hello {curr} </div>
        </>
    )
}

export default Edit;