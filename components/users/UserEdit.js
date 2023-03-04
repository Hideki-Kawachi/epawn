function EditUser(){
    
    return( 
        <>
        <form className="user-create-main-container">

            <h1 className="m-5 font-bold text-base"> Create New User</h1>

				<div className="user-create-top-container m-5 grid grid-cols-3 gap-4">

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Username: </span>
						<span className="border rounded-md stroke-gray-500 px-3"></span>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">First Name: </span>
						<span className="border rounded-md stroke-gray-500 px-3"></span>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Role   : </span>
						<span className="border rounded-md stroke-gray-500 px-3"></span>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Password: </span>
          				<span className="border rounded-md stroke-gray-500 px-3"></span>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Last Name: </span>
						<span className="border rounded-md stroke-gray-500 px-3"></span>
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Last Name: </span>
						<span className="border rounded-md stroke-gray-500 px-3"></span>
					</div>

                 
				</div>
			</form>

        </>
    )
    
}

export default EditUser;