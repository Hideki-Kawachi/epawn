import { useRouter } from "next/router"
import React from "react";
import Link from 'next/link';
import NavBar from "../../../components/navigation/navBar";
import Header from "../../../components/header";

// export const getStaticPaths = async() => {

// }

function Edit() {

    const router = useRouter()
    const userid = router.query.userid

    // Add NavBar (currentUser) and Header (currentUser)
    return (
        <>

            <div> Details about {userid} </div>
        </>
    )
}

export default Edit;