import SignupDt from '../moduls/signup';
import jwt from 'jsonwebtoken'
const isAdmin = async function (req:any, res:any, next:any) { 
    // 401 Unauthorized
    // 403 Forbidden 
    let token = req.header('x-token');
        let decode :any = jwt.verify(token,'vamsi')
       // console.log(decode)
        req.user =await SignupDt.findById(decode.user.id)
    
    //console.log(req.user)
    if (!req.user.isAdmin) return res.status(403).send('Access denied Admin');
  
    next();
  }

  export default isAdmin