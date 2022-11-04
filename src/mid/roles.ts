import SignupDt from '../moduls/signup';
import jwt from 'jsonwebtoken'
const isAdmin = async(req:any, res:any, next:any)=> { 
    // 401 Unauthorized
    // 403 Forbidden 
    let token = req.header('x-token');
        let decode :any = jwt.verify(token,'vamsi')
       // console.log(decode)
        req.user =await SignupDt.findById(decode.user.id)
    
    //console.log(req.user)
    if (req.user.role != 'admin') return res.status(403).send('Access denied');
  
    next();
  }

const isStaff =async (req:any,res:any) => {
    let token = req.header('x-token');
        let decode :any = jwt.verify(token,'vamsi')
       // console.log(decode)
        req.user =await SignupDt.findById(decode.user.id)

        if (req.user.role != 'staff') return res.status(403).send('Access denied');
  
}


  export {isAdmin , isStaff}