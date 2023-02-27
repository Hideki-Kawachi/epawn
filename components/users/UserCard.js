import React from 'react';

function UserCard({lastName, firstName, role}){

    return (
        <div className="bg-[#F1F1F1] shadow-md flex font-nunito rounded-lg h-fit m-5">
        
  
        <div className="m-5 w-96">
          <p>
            <b>{lastName}, {firstName}</b>
          </p>
          <p className='font-semibold'>
            {role}
          </p>
        </div>
        <div className="mt-5 mr-5">
          <button className='bg-[#000000] flex flex-row space-x-2'>
            <p>  Edit </p>
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.40758 8.42432V6.79523L11.8344 1.98554L13.6725 3.61463L8.24569 8.42432H6.40758ZM14.2852 3.0716L12.4471 1.44251L13.0598 0.899475C13.2349 0.744324 13.4391 0.666748 13.6725 0.666748C13.9059 0.666748 14.1102 0.744324 14.2852 0.899475L14.8979 1.44251C15.073 1.59766 15.1605 1.77867 15.1605 1.98554C15.1605 2.1924 15.073 2.37341 14.8979 2.52857L14.2852 3.0716ZM7.28287 16.6667C7.16616 16.6667 7.04946 16.6474 6.93275 16.6086C6.81605 16.5698 6.71393 16.5181 6.6264 16.4534C4.49652 14.7855 2.9064 13.2374 1.85605 11.809C0.805694 10.38 0.280518 9.04493 0.280518 7.80372C0.280518 5.86432 0.984546 4.31927 2.3926 3.16857C3.80008 2.01786 5.43016 1.44251 7.28287 1.44251C7.67675 1.44251 8.06713 1.47147 8.45401 1.52939C8.84031 1.58783 9.21581 1.66877 9.58052 1.7722L4.91958 5.92251C4.83205 6.00008 4.7664 6.08748 4.72264 6.18471C4.67887 6.28142 4.65699 6.3815 4.65699 6.48493V9.20008C4.65699 9.41988 4.74102 9.60399 4.90907 9.75242C5.07655 9.90137 5.28428 9.97584 5.53228 9.97584H8.61769C8.7344 9.97584 8.8476 9.95644 8.95731 9.91766C9.06643 9.87887 9.16475 9.82069 9.25228 9.74311L13.8913 5.6316C14.0226 5.96776 14.1213 6.31685 14.1872 6.67887C14.2525 7.04089 14.2852 7.41584 14.2852 7.80372C14.2852 9.04493 13.76 10.38 12.7097 11.809C11.6593 13.2374 10.0692 14.7855 7.93934 16.4534C7.85181 16.5181 7.74969 16.5698 7.63299 16.6086C7.51628 16.6474 7.39958 16.6667 7.28287 16.6667Z" fill="white"/>
            </svg>

          </button>
        </div>
      </div>
    )
}


export default UserCard;