function CreateUser(){
    
    return( 
        <>
        <form className="user-create-main-container">

            <h1 className="m-5 font-bold text-base"> Create New User</h1>

				<div className="user-create-top-container m-5 grid grid-cols-3 gap-4">

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Username: </span>
          				<input className="border rounded-md stroke-gray-500 px-3" />
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">First Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3" />
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Role   : </span>
          				<input className="border rounded-md stroke-gray-500 px-3" />
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Password: </span>
          				<input className="border rounded-md stroke-gray-500 px-3" />
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Last Name: </span>
          				<input className="border rounded-md stroke-gray-500 px-3" />
					</div>

                    <div className="flex w-1/4 flex-col">
						<span className="font-bold pr-7">Last Name: </span>
          				<div> Switch here</div>
					</div>

                 
				</div>
			</form>

        </>
    )
    
}

export default CreateUser;