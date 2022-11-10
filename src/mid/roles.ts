/* eslint-disable @typescript-eslint/no-explicit-any */
import SignupDt from '../moduls/signup';
import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = async(req:any, res:any, next:any)=> { 
    // 401 Unauthorized
    // 403 Forbidden 
    const token = req.header('x-token');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decode :any = jwt.verify(token,'vamsi')
       // console.log(decode)
        req.user =await SignupDt.findById(decode.user.id)
    
    //console.log(req.user)
    if (req.user.role != 'admin') return res.status(403).send('Access denied');
  
    next();
  }

const isStaff =async (req:any,res:any,next:any) => {
    const token = req.header('x-token');
        const decode :any = jwt.verify(token,'vamsi')
       // console.log(decode)
        req.user =await SignupDt.findById(decode.user.id)

        if (req.user.role != 'staff') return res.status(403).send('Access denied');
    next();
}


  export {isAdmin , isStaff}