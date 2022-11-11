/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'
import tokenT from '../moduls/tokent';
//import SignupDt from '../moduls/signup';


const token =async (req:any,res:any,next:any)=>{
    try {
        const token = req.header('x-token');
        if(!token){
            return res.status(400).send('Token Not Found')
        }
        const user = await tokenT.findOne({token:req.header('x-token')},{status:'A'})
        if(!user){
            res.status(401).send('your acount is not in Active pleace login')
        }
        const decode :any = jwt.verify(token,'vamsi')
        req.user = decode.user
       console.log("hello")
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send('token is not valied')
    }
}

export default token