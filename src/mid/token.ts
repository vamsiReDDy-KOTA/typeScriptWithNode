import jwt from 'jsonwebtoken'
import SignupDt from '../moduls/signup';


const token =(req:any,res:any,next:any)=>{
    try {
        let token = req.header('x-token');
        if(!token){
            return res.status(400).send('Token Not Found')
        }
        let decode :any = jwt.verify(token,'vamsi')
        req.user = decode.user
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send('token is not valied')
    }
}

export default token