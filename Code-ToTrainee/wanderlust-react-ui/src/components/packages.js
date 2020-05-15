import React, { Component } from 'react';
import axios from 'axios';
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Redirect, Link } from 'react-router-dom';
// import SideBar from './sideBar';
import {backendUrlPackage} from '../BackendURL';


class Packages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: 1,
                date: "",
                flights: false
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: true,
                date: false,
                buttonActive: false
            },
            bookingPage: false,
            showItinerary: false,
            packages: [],
            errorMessage: "",
            successMessage: "",
            totalCharges: "",
            dealId: "",
            index: "",
            deal: "",
            packagePage: false,
            checkOutDate: new Date(),
            visibleRight: false,
            userId:''
        }
    }

    getPackages = (continent) => {
        axios.get(backendUrlPackage + '/destinations/' + continent)
            .then((response) => {
                // console.log(response)
                this.setState({ packages: response.data, show: false },()=>{
                if (this.state.packages.length === 0) this.setState({ errorMessage: "some error occured" })})
            }).catch(error => {
                this.setState({ errorMessage: error.response.data.message, packages: [] })
            })
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        let userId = sessionStorage.getItem('userId');
        this.setState({userId:userId})
        const continent = sessionStorage.getItem("continent");
        this.getPackages(continent)
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        if(target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });
    
        this.validateField(name, value);

    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1 ) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5!";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }
     
        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            bookingFormErrorMessage: fieldValidationErrors,
            bookingFormValid: formValid,
            successMessage: ""
        });
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate=new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = this.state.bookingForm.noOfPersons * ((this.state.deal.chargesPerPerson * (1-(this.state.deal.discount/100))) + this.state.deal.flightCharges) ;
            this.setState({ totalCharges: Math.ceil(totalCost) });
        } else {
            let totalCost = this.state.bookingForm.noOfPersons * this.state.deal.chargesPerPerson * (1-(this.state.deal.discount/100));
            this.setState({ totalCharges: Math.ceil(totalCost) });
        }
    }

    getitinerary = (selectedPackage) => {
        this.setState({ index: 0, deal: selectedPackage, showItinerary: true })
    }

    openBooking = (selectedPackage) => {
        this.setState({ index: 2, deal: selectedPackage, showItinerary: true })
    }

    loadBookingPage = (deal) => {
        if(this.state.userId === null){ 
           let val = window.confirm("Please Login to continue..!!");
           if(val === true){ window.location = "/login" }
        }
        else{
        this.setState({ visibleRight: false, deal: deal });
        sessionStorage.setItem('noOfPersons', this.state.bookingForm.noOfPersons);
        // sessionStorage.setItem('checkInDate', this.state.bookingForm.date);
        // sessionStorage.setItem('flight', this.state.bookingForm.flights);
        sessionStorage.setItem('dealId', deal.destinationId);
        this.setState({ bookingPage: true, showItinerary: false, dealId: deal.destinationId })
        }
    }

    displayPackages = () => {
        if (!this.state.errorMessage) {
            let packagesArray = [];
            for (let mypackage of this.state.packages) {
                let element = (
                    <div className="card bg-light text-dark package-card mt-5" key={mypackage.destinationId}>
                        <div className="card-body row">
                            <div className="col-md-4">
                                <img className="package-image" src={mypackage.imageUrl} alt="destination comes here" />
                            </div>
                            <div className="col-md-5">
                                <div className="featured-text text-center text-lg-left ml-4">
                                    <h4>{mypackage.name}</h4>
                                    <div className="badge badge-info">{mypackage.noOfNights}<em> Nights</em></div>
                                    {mypackage.discount ? <div className="discount text-danger">{mypackage.discount}% Instant Discount</div> : null}
                                    <p className="text-dark mb-0">{mypackage.details.about}</p>
                                </div>
                                <br />

                            </div>
                            <div className="col-md-3">
                                <h4>Prices Starting From:</h4>
                                <div className="text-center text-success"><h6>${mypackage.chargesPerPerson}.00</h6></div><br /><br />
                                <div><button className="btn btn-info btn-block btn-lg mx-auto book" onClick={() => this.getitinerary(mypackage)}><small>View Details</small></button></div><br />
                                <div><button className="btn btn-info btn-block btn-lg mx-auto book" onClick={() => this.loadBookingPage(mypackage)}><small>Book</small></button>  </div>
                            </div>
                        </div>
                    </div>
                )
                packagesArray.push(element);
            }
            return packagesArray;
        } else {
                return <div className="">
                    <br/><br/><br/><br/><br/>
                    <h2>Sorry we don't operate in this Destination.</h2><br />
                    <Link to='/hotdeals' className="btn btn-success">Click Here to checkout our Hot Deals</Link>
                    <br/><br/><br/><br/><br/>
                </div>
        }
    }

    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if(this.state.deal) {
            return packageInclusions.map((pack,index)=> (<li key={index}>{pack}</li>) )
        }
        else {
            return null;
        }
    }

    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0} className='text-left'>
                {/* <h3>Day Wise itinerary</h3> */}
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight,index)=>{
                    let element=(
                        <div key={index+1} className='text-left'>
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                    );
                    return packageHighLightsArray.push(element)
                });
            let lastElement = (
                <div key={45} className='text-left'>
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="#contact-us">Contact us</a> for more details.
                        </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.calculateCharges();
    }

    render() {
        if(this.state.bookingPage) {  return <Redirect to={{
                                                            pathname:'/book/'+ this.state.dealId,
                                                            state: { deal: this.state.deal,
                                                                     flights: this.state.bookingForm.flights,
                                                                     checkInDate: this.state.bookingForm.date}
                                                                        } } /> }
                return (
                <div>
                    {this.displayPackages()}
                        {/* {this.state.showItinerary?<SideBar package={this.state.deal} index={this.state.index}></SideBar>:null} */}
                        <Sidebar visible={this.state.showItinerary} position="right" className="p-sidebar-lg"  onHide={(e) => this.setState({ showItinerary: false })}>
                            <h2>{this.state.deal.name}</h2>
                            <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })}>
                                <TabPanel header="Overview" className='text-left'>
                                    <div className="row">
                                        {this.state.deal ?
                                            <div className="col-md-6 ">
                                                <img className="package-image" src={this.state.deal.imageUrl} alt="destination comes here" />
                                            </div> : null}
        
                                        <div className="col-md-6 text-left">
                                            <h4>Package Includes:</h4>
                                            <ul>
                                                {this.state.showItinerary ? this.displayPackageInclusions():null}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="text-justify itineraryAbout">
                                        <h4>Tour Overview:</h4>
                                        {this.state.deal ? this.state.deal.details.about : null}
                                    </div>
                                </TabPanel>
                                <TabPanel header="Itinerary" className='align-left' >
                                    {this.displayPackageHighlights()}
                                </TabPanel>
                                <TabPanel header="Book" >
                                    <h4 className="itenaryAbout text-success text-left">**Charges per person: ${this.state.deal.chargesPerPerson}.00</h4>
                                    <form onSubmit={this.handleSubmit} className='text-left'>
                                        <div className="form-group">
                                            <label htmlFor="noOfPersons">Number of Travelers:</label>
                                            <input
                                                type="number"
                                                id="noOfPersons"
                                                className="form-control"
                                                name="noOfPersons"
                                                value={this.state.bookingForm.noOfPersons}
                                                onChange={this.handleChange}
                                            />
                                            {this.state.bookingFormErrorMessage.noOfPersons ?
                                                <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                                : null}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="date">Trip start Date:</label>
                                            <input
                                                type="date"
                                                id="date"
                                                className="form-control"
                                                name="date"
                                                value={this.state.bookingForm.date}
                                                onChange={this.handleChange}
                                            />
                                            {this.state.bookingFormErrorMessage.date ?
                                                <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                                : null}
                                        </div>
                                        <div className="form-group">
                                            <label>Include Flights:</label>&nbsp;
                                            <InputSwitch name="flights" id="flights"
                                                checked={this.state.bookingForm.flights}
                                                onChange={this.handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <button id="buttonCalc" className="btn btn-info btn-lg" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Calculate Charges</button>&nbsp;
                                        </div>
                                    </form>
                                    {!this.state.totalCharges ?
                                        (
                                            <React.Fragment><p className='text-left'>**Charges Exclude flight charges.</p></React.Fragment>
                                        )
                                        :
                                        (
                                            <h5 className="text-success text-left">
                                                Your trip ends on {this.state.checkOutDate} and
                                                you will pay ${this.state.totalCharges}.00
                                            </h5>
                                        )
                                    }
        
                                    <div className="text-center">
                                        <button disabled={!this.state.bookingFormValid.buttonActive} className="btn btn-lg btn-success" onClick={() => this.loadBookingPage(this.state.deal)}>Book</button>
                                        &nbsp; &nbsp; &nbsp;
                                        <button type="button" className="btn btn-lg btn-link" onClick={(e) => this.setState({showItinerary:false})}>Cancel</button>
                                    </div>
                                </TabPanel>
                            </TabView>
                        </Sidebar>
                </div>
        )
    }
}

export default Packages;