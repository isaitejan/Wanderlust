import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { InputSwitch } from 'primereact/inputswitch';
import {backendUrlBooking} from '../BackendURL';
import axios from 'axios';
import { Link,Redirect } from 'react-router-dom';




const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  
}));



class Booking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded1 : false,
      expanded2 : false,
      expanded3 : false,
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
    userId: '',
    successMessage: "",
    totalCharges:'',
    checkOutDate:'',
    deal:this.props.location.state.deal,
    bookingSuccess:false,
    bookingStatus:'',
    bookingFail: false,
    packages: false,
    hotDeals: false
    }
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
    // console.log(this.state.bookingFormValid.noOfPersons,this.state.bookingFormValid.date);
    
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
    // console.log(this.state.bookingFormValid.noOfPersons,this.state.bookingFormValid.date);
    
    formValid.buttonActive = formValid.noOfPersons && formValid.date;
    this.setState({
        bookingFormErrorMessage: fieldValidationErrors,
        bookingFormValid: formValid,
        successMessage: ""
    },()=>this.calculateCharges());
}

componentDidMount = (props) => {
  let noOfPersons = sessionStorage.getItem('noOfPersons');
  let checkInDate = this.props.location.state.checkInDate;
  let userId = sessionStorage.getItem('userId');
  console.log(checkInDate);
  
  if(checkInDate !== '') { this.setState({ bookingFormValid:{ date: true, noOfPersons: true, buttonActive: true}})}
  
  this.setState({ bookingForm:{noOfPersons: noOfPersons, date: checkInDate, flights:this.props.location.state.flights }, userId: userId},
    ()=>this.calculateCharges());
}

calculateCharges = () => {
  this.setState({ totalCharges: 0 });
  let oneDay = 24 * 60 * 60 * 1000;
  let checkInDate = new Date(this.state.bookingForm.date);
  let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
  let finalCheckOutDate=new Date(checkOutDateinMs);
  this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
  if (this.state.bookingForm.flights) {
      let totalCost = this.state.bookingForm.noOfPersons * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
      this.setState({ totalCharges: totalCost });
  } else {
      let totalCost = this.state.bookingForm.noOfPersons * this.state.deal.chargesPerPerson;
      this.setState({ totalCharges: totalCost });
  }

}

  handleChange1 = (panel) =>{
    if(panel === 'panel1'){
    this.setState({expanded1:this.state.expanded1?false:true})
    } else if(panel === 'panel2'){
      this.setState({expanded2:this.state.expanded2?false:true})
      } else if(panel === 'panel3'){
        this.setState({expanded3:this.state.expanded3?false:true})
        } 
  };

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
            </div>
        );
        packageHighLightsArray.push(lastElement);
        return packageHighLightsArray;
    } else {
        return null;
    }
}

  bookingDeatils = () => {
    return <div className='mt-5' >
        <h3>{this.state.deal.name}</h3>
        <ExpansionPanel square expanded={this.state.expanded1} onChange={()=>this.handleChange1('panel1')}>
          <ExpansionPanelSummary aria-controls="panel1d-content" id="overview-header">
            <Typography>{this.state.expanded1?<i className='pi pi-minus mr-3'></i>:<i className='pi pi-plus mr-3'></i>}<span className='h5'>Overview</span></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              {this.state.deal.details.about}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel square expanded={this.state.expanded2} onChange={()=>this.handleChange1('panel2')}>
          <ExpansionPanelSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>{this.state.expanded2?<i className='pi pi-minus mr-3'></i>:<i className='pi pi-plus mr-3'></i>}<span className='h5'>Package Inclusions</span></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <ul className='text-left'>
              {this.state.deal.details.itinerary.packageInclusions.map((pack,index)=> (<li key={index}>{pack}</li>) )}
              </ul>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel square expanded={this.state.expanded3} onChange={()=>this.handleChange1('panel3')}>
          <ExpansionPanelSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography>{this.state.expanded3?<i className='pi pi-minus mr-3'></i>:<i className='pi pi-plus mr-3'></i>}<span className='h5'>Itinerary</span></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              {this.displayPackageHighlights()}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
  </div>
  }

  dateFormat = (date) => {
    let inDate = new Date(date)
    inDate.setDate(inDate.getDate()+ this.state.deal.noOfNights)
    let day = inDate.getDate()>9?inDate.getDate():'0'+inDate.getDate();
    let month = inDate.getMonth()>9?(inDate.getMonth()+1):'0'+(inDate.getMonth()+1)
    let outDate = inDate.getFullYear() + '-' + month + '-' + day;
    return outDate; 

  }

  handleSubmit = (event) => {
    event.preventDefault();
    let bookingDetails = {};
    bookingDetails.destinationName = this.state.deal.name;
    bookingDetails.checkInDate = this.state.bookingForm.date;
    bookingDetails.checkOutDate = this.dateFormat(this.state.bookingForm.date);
    bookingDetails.noOfPersons = this.state.bookingForm.noOfPersons;
    bookingDetails.totalCharges = this.state.totalCharges;
    bookingDetails.timeStamp = new Date().getTime().toString();
    axios.post(backendUrlBooking + "/" + this.state.userId + "/" + this.state.deal.destinationId, bookingDetails)
      .then(res =>{
          this.setState({bookingStatus: "Booking Confirmed!!", bookingSuccess: true})
      }).catch(err =>{
        this.setState({bookingStatus: err.response.data.message, bookingSuccess: true, bookingFail: true})
      })
  }

  redirect = () => {
    let dealId = this.state.deal.destinationId;
    console.log(dealId)
    if(dealId[0] === 'H') {
      return <Redirect to='/hotDeals'/>
    } else {
      return <Redirect to={"/packages/"+this.state.deal.continent} />;
    }
  }

  bookingCard = () => {
    const { classes } = this.props
    return <div className='mt-5 mb-5'><Card className={classes.root}>
      <CardContent className='bg-light'>
        <form onSubmit={this.handleSubmit} className='text-left'>
            <div className="form-group">
                <label htmlFor="noOfPersons">Number of Travelers</label>
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
                <label htmlFor="date">Trip start Date</label>
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
   {console.log(this.state.bookingFormValid.noOfPersons,this.state.bookingFormValid.date)}

            </div>
            {this.state.totalCharges?<div><span className="text text-left">Your trip ends on: {this.state.checkOutDate} </span>
                          <h4 className="font-weight-bold"> You Pay: ${this.state.totalCharges}.00</h4><br/></div>:null}
            {/* <div className="form-group"> */}
                <button id="book" className="btn btn-info btn ml-3" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Confirm Booking</button>&nbsp;
                <button onClick={this.redirect} id='goBack' className='btn btn-info btn ' type='button' >Go Back</button>
            {/* </div> */}
        </form>
      </CardContent>
    </Card></div>
  }

  bookingSuccess = () => {
    let startDate = new Date(this.state.bookingForm.date).toDateString();
    return <div className='container text-center mt-5 font-weight-bold'><br/>
      <h3 className='mt-3'>{this.state.bookingStatus}</h3><br/>
      {!this.state.bookingFail?<div><h3 className='text-success'>Congratulations! Trip planned to {this.state.deal.name}</h3><br/>
      <h5>Trips starts on: {startDate}</h5>
      <h5>Trip ends on: {this.state.checkOutDate}</h5></div>:null}
      <Link to="/viewBookings" className='text-info mb-5'>Click here to view your Bookings</Link><br/><br/><br/><br/><br/>
    </div>
  }

  render(){  
    // if(this.state.packages)
    if(this.state.bookingSuccess) {
      return this.bookingSuccess()
    }
    return (<div className="container-fluid row">
    <div className='col-md-6 offset-md-1 mb-5'><br/>{this.bookingDeatils()}</div>
    <div className='col-md-4 ml-4 mb-5'><br/>{this.bookingCard()}</div>
      </div>
      
  );
}
}

export default withStyles(useStyles)(Booking);