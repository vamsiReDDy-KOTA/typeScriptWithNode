export interface BaseItem {
    DateYouBooked:string;
    StartTime: []
    EndTime:[]
    dateOfAppointment:Date;
    /*AvilableSchema : [
      {
        nine: [],
        ten: [],
        eleven: [],
        twelve: [],
        thirty: [],
        fourteen: [],
        fifteen: [],
        sixteen: [],
        seventeen: [],
      }
    ]*/
    name: string;
    bookingId:number;
    }
    
    export interface Item extends BaseItem {
      id: number ;
    }