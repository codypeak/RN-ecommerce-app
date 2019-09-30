import moment from 'moment';

class Order {
    constructor(id, items, totalAmount, date) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = date;
    }
    //date is js obj in orders reducer which cant be used in orderscreen so convert it. 
    get readableDate() {
        return moment(this.date).format('MMMM Do YYYY, hh:mm');
    }
};

export default Order;

//order id is different than product id. 

    //date is js obj in orders reducer which cant be used in orderscreen so convert it. but not supported by android.
    // get readableDate() {
    //     return this.date.toLocaleDateString('en-EN', {
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     });
    // }