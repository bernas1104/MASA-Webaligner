import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Main extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: '',
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <Link to='/alignments/new'>Acessar</Link>
        );
    }
}