import React, { Component } from 'react';
import axios from 'axios';
import { backendUrlBooking } from '../BackendURL';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
// import { Message } from 'primereact/message';


class ViewBookings extends Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            bookings: [],
            showBookings: false,
            errorMessage: '',
            cancelCard: false,
            message:false
        }
    }

    componentDidMount = () => {
        let userId = sessionStorage.getItem('userId');
        this.setState({ userId: userId}, () => this.getBookings());
        // sessionStorage.getItem('cancel')?this.setState({message:true}):this.setState({message:false})
    }

    getBookings = () => {
        axios.get(backendUrlBooking + '/getDetails/' + this.state.userId)
        .then(res => {
            this.setState({ bookings: res.data, showBookings: true})
        }).catch(error => {
            this.setState({ errorMessage: error.response.data.message})
        })
    }

    handleClick = (event) => {
        this.setState({cancelCard: true})
    }

    cancelBooking = (booking) => {
        console.log(booking);
        
        axios.delete(backendUrlBooking + '/cancelBooking/' + booking.bookingId, { data: booking })
        .then(response => {
            sessionStorage.setItem('cancel',true)
            window.location.reload();
        }).catch(error => {
            console.log(error.response.data.message);
            
            this.setState({ errorMessage: error.response.data.message})
        })
    }

    displayBookings = () => {
        return this.state.bookings.map(booking => {
            return <div className='container col-md-6 offset-md-3 text-left mt-5 mb-5'>
                <div className='card'>
                <div className='card-header'>Booking ID: {booking.bookingId}</div>
                <div className='card-body'>
                {this.state.cancelCard?this.cancelCard(booking):null}
                    <h3 className='card-title'>{booking.destinationName}</h3>
                    <div className='row'>
                    <div className='col-md-6'>
                        <p className='card-text'>
                            Trip starts on: {new Date(booking.checkInDate).toDateString()}<br/>
                            Trip ends on: {new Date(booking.checkOutDate).toDateString()}<br/>
                            Travellers: {booking.noOfPersons}
                        </p>
                    </div>
                    <div className='col-md-4 offeset-md-1'>
                        <p className='card-text'>
                            Fare Details <br/>${booking.totalCharges} <br/> 
                            <button className='btn btn-link btn-outline-light btn-sm' onClick={this.handleClick}>Claim Refund</button>
                        </p>
                    </div>
                    </div>
                </div>
                <div className='card-footer'></div>
                </div>
            </div>
        })
    }

    handleBack = () => {
        this.setState({ cancelCard: false })
    }

    cancelCard = (booking) => {
        const header = ( <span className='text-left'>Confirm Cancellation</span> );
        const footer = (
            <div>
              <button className='btn btn-info' onClick={this.handleBack}>Back</button>
              <button onClick={() => this.cancelBooking(booking)} className="btn btn-secondary">Confirm Cancellation</button>
            </div>
          ); 
        return (
            <Dialog
                header={header}
                visible={this.state.cancelCard}
                style={{ width: '45vw' }}
                footer={footer}
                onHide={this.handleBack}
              >
                <div>
                    <p className='text-danger text-left'>Are you sure you want to cancel your trip to {booking.destinationName}?<br/></p>
                    <span className='text-left'>
                        Trip starts Date: {new Date(booking.checkInDate).toDateString()}<br/>
                        Trip end Date: {new Date(booking.checkOutDate).toDateString()}<br/>
                        Refund Amount: ${booking.totalCharges}
                    </span>
                </div>
            </Dialog>
        )
    }

    render() {
        if(sessionStorage.getItem('userId')) {
        return( 
            <div className='mb-5'><br/>
                {/* {this.state.message?<Message closable='true' severity="info" text='Successfully cancelled '>Successfully cancelled the booking with Id </Message>:null} */}
                {this.state.showBookings?this.displayBookings():
                <div className='container col-md-8 text-left mb-5'><br/><br/><br/>
                    <h3>Sorry You have not planned any trip with us yet!!</h3>
                    <Link to="/" className='btn btn-success mb-5'>Click Here to Start Booking</Link><br/><br/><br/><br/><br/>
                </div>}<br/>
            </div>)
        } else {
            return (
                <div className='container text-left col-md-6 offset-md-3 mt-5 mb-5'><br/><br/><br/>
                    <h3>Login to view your bookings!!</h3>
                    <Link to="/login" className='btn btn-success mb-5'>Click Here to login</Link><br/><br/><br/><br/><br/>
                </div>
            )
        }
    }
}

export default ViewBookings;