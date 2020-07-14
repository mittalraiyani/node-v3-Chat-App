const users=[]

//add user,get user,remove user,get user in room
const adduser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username||!room)
    {
        return{
            error:"username and room is required"

            
        }
    }
    //check for existing user
    const existinguser=users.find((user)=>{
        return user.room===room&& user.username===username
    })

    //validate username
    if(existinguser)
    {
        return{
            error:"username is in use"
            
        }
    }
    //store user
    const user={id,username,room}
    users.push(user)
    return{user}
}

const removeuser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)

    if(index !==-1)
    {
        return users.splice(index,1)[0]
    }

}

const getuser=(id)=>{
    return users.find((user)=>user.id===id)
}
const getuserinroom=(room)=>{
    return users.filter((user)=>user.room===room)
}

adduser({
    id:22,username:"mital",room:"surat"
})

adduser({
    id:32,username:"Ankur",room:"surat"
})

adduser({
    id:22,username:"mital",room:"Center City"
})

const user=getuser(32)
console.log(user)

const userlist=getuserinroom('surat')
console.log(userlist)

// const res=adduser({
//     id:99,
//     username:"ankur",
//     room:"mumbai"
// })
// console.log(res)
//remove user calling function
// const removeduser=removeuser(22)
// console.log(removeduser)
// console.log(users)
module.exports={
    adduser,
    getuser,
    getuserinroom,
    removeuser
}