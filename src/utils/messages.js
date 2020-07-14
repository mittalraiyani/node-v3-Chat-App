const generatemessage=(username,text)=>{
    return{
        username,
        text,
        createdat:new Date().getTime()

    }
}

const generatelocationmessage=(username,url)=>{
    return {
        username,
        url,
    createat:new Date().getTime()
}}
module.exports={
    generatemessage,
    generatelocationmessage
}