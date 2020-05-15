import React, { Component } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerform: {
                name:"",
                emailId:"",
                contactNo: "",
                password: ""
            },
            registerformErrorMessage: {
                name:"",
                emailId:"",
                contactNo: "",
                password: ""
            },
            registerformValid: {
                name:false,
                emailId:false,
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            registerSuccess: false,
            userId: ""
        }
    }

    // handleClick = () => {
    //     this.setState({ loadRegister: true })
    // }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { registerform } = this.state;
        this.setState({
            registerform: { ...registerform, [name]: value }
        });
        this.validateField(name, value);
        // console.log(this.state.registerform[name], name);
    }

    register = () => {
        const { registerform } = this.state;
        axios.post(backendUrlUser+'/register', registerform)
            .then(response => {
                console.log(response);
                let userId = response.data.userId;
                this.setState({ registerSuccess: true, userId: userId });
                // window.location.reload();

            }).catch(error => {
                console.log(error.response);
                this.setState({errorMessage: error.response.data.message});
            })
        // console.log(this.state.registerform.contactNo, this.state.registerform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.register();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.registerformErrorMessage;
        let formValid = this.state.registerformValid;
        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                    } else if (!(value.match(/[a-zA-z]/) && value.match(/[0-9]/) && value.match(/[@!#$%^&*]/))) {
                        fieldValidationErrors.password = "Please Enter a valid password"
                        formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
                case "name":
                    if (!value || value === "") {
                        fieldValidationErrors.name = "Name is manadatory";
                        formValid.name = false;
                    } else if (!(value.match(/^[A-z]+[\s]?[A-z]+$/))) {
                        fieldValidationErrors.name = "Please Enter a valid name"
                        formValid.name = false;
                    } else {
                        fieldValidationErrors.name = "";
                        formValid.name = true;
                    }
                break;
                case "emailId":
                    if (!value || value === "") {
                        fieldValidationErrors.emailId = "EmailId is manadatory";
                        formValid.emailId = false;
                    } else if (!(value.match(/^[a-z0-9]+@[A-z]+\.(com)$/))) {
                        fieldValidationErrors.emailId = "Please Enter a valid emailId"
                        formValid.emailId = false;
                    } else {
                        fieldValidationErrors.emailId = "";
                        formValid.emailId = true;
                    }
                    break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password && formValid.name && formValid.emailId;
        this.setState({
            registerformErrorMessage: fieldValidationErrors,
            registerformValid: formValid,
            successMessage: ""
        });
    }

    render() {
        if (this.state.registerSuccess === true) return(
            <div className='container'>
                <div className='row col-md-4 offset-md-4 mt-5 text text-center'>
                    <br/>
                </div>
                <div className='row col-md-4 offset-md-4 mt-5 text text-center'>
                    <h3 className='text-success'>Successfully Registered!</h3>
                </div>
                <div className='row col-md-4 offset-md-4 mb-5 text text-center'>
                <h3><Link to='/login' className='text-primary'>Click here to login</Link></h3>
                <br/><br/>
                </div>
            </div>)
        // if (this.state.loadRegister === true) return <Redirect to={'/register'} />
        return <div>
        <section id="registerPage" className="registerSection">    {/* *ngIf="!registerPage"  */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 offset-4 ">
                        <h1 className='text text-left'>Join Us</h1>
                        <form className="form text-left" onSubmit={this.handleSubmit}> {/* [formGroup]="loginForm" (ngSubmit)="login()" */}
                            <div className="form-group">
                                <label htmlFor="uname">Name<span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={this.state.registerform.name}
                                    onChange={this.handleChange}
                                    id="uname"
                                    name="name"
                                    className="form-control"
                                />
                            </div>
                            {this.state.registerformErrorMessage.name ? (<span className="text-danger">
                                {this.state.registerformErrorMessage.name}
                            </span>)
                                : null}
                            
                            <div className="form-group">
                                <label htmlFor="uemailId">Email Id<span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    value={this.state.registerform.emailId}
                                    onChange={this.handleChange}
                                    id="uemailId"
                                    name="emailId"
                                    className="form-control"
                                />
                            </div>
                            {this.state.registerformErrorMessage.emailId ? (<span className="text-danger">
                                {this.state.registerformErrorMessage.emailId}
                            </span>)
                                : null}

                            <div className="form-group">
                                <label htmlFor="uContactNo">Contact Number<span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    value={this.state.registerform.contactNo}
                                    onChange={this.handleChange}
                                    id="uContactNo"
                                    name="contactNo"
                                    className="form-control"
                                />
                            </div>
                            {this.state.registerformErrorMessage.contactNo ? (<span className="text-danger">
                                {this.state.registerformErrorMessage.contactNo}
                            </span>)
                                : null}

                            <div className="form-group">
                                <label htmlFor="uPass">Password<span className="text-danger">*</span></label>
                                <input
                                    type="password"
                                    value={this.state.registerform.password}
                                    onChange={this.handleChange}
                                    id="uPass"
                                    name="password"
                                    className="form-control"
                                />
                            </div>
                            {this.state.registerformErrorMessage.password ? (<span className="text-danger">
                                {this.state.registerformErrorMessage.password}<br/>
                            </span>)
                                : null}
                            <span><span className="text-danger">*</span> marked feilds are mandatory</span><br/>
                            <span className='text text-danger'>{this.state.errorMessage}</span>
                            {/* <div class="form-group">
                                <div class="text-danger">
                                    <h6>{{ errorMessage }}</h6>
                                </div>
                            </div> */}
                            <button
                                type="submit"
                                disabled={!this.state.registerformValid.buttonActive}
                                className="btn btn-primary btn-block"
                            >
                                Register
                            </button>
                        </form>
                        <br />
                    </div>
                </div>
            </div>
        </section>
    </div>
    }
}

export default Register