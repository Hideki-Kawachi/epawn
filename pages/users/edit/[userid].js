import { useRouter } from "next/router"
import React from "react";
import Link from 'next/link';

function Edit() {

    const router = useRouter()
    const userid = router.query.userid

    return (
        <div> Details about {userid} </div>
    )
}

export default Edit;