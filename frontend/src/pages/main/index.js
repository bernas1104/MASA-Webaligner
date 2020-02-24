import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Main extends Component {
    render() {
        return (
            <Link to={`/alignments/new`}>Acessar</Link>
        );
    }
}