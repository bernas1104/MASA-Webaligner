import React, { Component } from 'react';
import api from '../../services/api';
import './styles.scss';

const FormData = require('form-data');

export default class NewAlignment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            extension: '',
            s0type: '',
            s1type: '',
            s0input: '',
            s1input: '',
            s0edge: '',
            s1edge: '',
        }
    }

    handleChangeFields = (event) => {
        const fields = ['s0name', 's1name', 's0text', 's1text'];

        if(fields.indexOf(event.target.name) === -1)
            this.setState({ [event.target.name]: event.target.value });
        else{
            if(event.target.name.includes('s0'))
                this.setState({ s0input: event.target.value });
            else
                this.setState({ s1input: event.target.value });
        }
    }

    handleFileUpload = (event) => {
        if(event.target.name.includes('s0'))
            this.setState({ s0input: event.target.files[0] });
        else
            this.setState({ s1input: event.target.files[0] });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const url = '/alignments';
        
        const form = new FormData();

        for(const key in this.state)
            form.append(key, this.state[key]);

        const { data: { _id } } = await api.post(url, form);
        this.props.history.push(`/alignments/${_id}`);
    }

    render() {
        return (
            <div className="alignment-form">
                <div className="row">
                    <div className="form-header">
                        <h2>Awesome Title</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada consectetur eleifend. 
                            Nulla consectetur vulputate magna, eget interdum nulla mollis a. Cras condimentum, 
                            purus quis elementum malesuada, dolor urna malesuada ipsum, vel tincidunt urna nisl eu est. 
                            Vestibulum non nunc et dolor rutrum rhoncus id id dui. 
                        </p>
                    </div>
                </div>

                <form onSubmit={ this.handleSubmit }>
                    {/* MASA Alignment Tool */}
                    <div className="row">
                        <label htmlFor="alignment" name="extension" className="col-2">Extension</label>
                        <div className="col-8 form-check">
                            <div>
                                <input type="radio" name="extension" onChange={this.handleChangeFields} value="1"/> MASA-CUDAlign
                            </div>
                            <div>
                                <input type="radio" name="extension" onChange={this.handleChangeFields} value="2" /> MASA-OpenMP
                            </div>
                            <div>
                                <input type="radio" name="extension" onChange={this.handleChangeFields} value="3" /> Auto
                            </div>
                        </div>
                        <div className="col-2"></div>
                    </div>

                    {/* Sequences Input Types */}
                    <div className="row">
                        {/* S0 Input Type */}
                        <div className="col-6">
                            <label htmlFor="alignment" name="s0type">s0 Input Type</label>
                            <div className="form-check">
                                <div>
                                    <input type="radio" name="s0type" onChange={this.handleChangeFields} value="1" /> NCBI API
                                </div>
                                <div>
                                    <input type="radio" name="s0type" onChange={this.handleChangeFields} value="2" /> File Upload
                                </div>
                                <div>
                                    <input type="radio" name="s0type" onChange={this.handleChangeFields} value="3" /> Text Input
                                </div>
                            </div>
                        </div>

                        {/* S1 Input Type */}
                        <div className="col-6">
                            <label htmlFor="alignment" name="s1type">s1 Input Type</label>
                            <div>
                                <input type="radio" name="s1type" onChange={this.handleChangeFields} value="1"/> NCBI API
                                <input type="radio" name="s1type" onChange={this.handleChangeFields} value="2" /> File Upload
                                <input type="radio" name="s1type" onChange={this.handleChangeFields} value="3" /> Text Input
                            </div>
                        </div>
                    </div>

                    {/* Sequences from NCBI DB */}
                    <div className="row">
                        {/* S0 Sequence Name */}
                        <div className="col">
                            <label htmlFor="alignment" name="s0name">S0</label>
                            <div>
                                <input type="text" name="s0name" value={this.state.s0name} onChange={this.handleChangeFields} placeholder="AF133821.1" className="form-control"/>
                            </div>
                        </div>

                        {/* S1 Sequence Name */}
                        <div className="col">
                            <label htmlFor="alignment" name="s1name">S1</label>
                            <div>
                                <input type="text" name="s1name" value={this.state.s1name} onChange={this.handleChangeFields} placeholder="AY352275.1" className="form-control"/>
                            </div>
                        </div>
                    </div>

                    {/* Sequences from File Upload */}
                    <div className="row">
                        {/* S0 Sequence Upload */}
                        <div className="col">
                            <input type="file" name="s0upload" onChange={this.handleFileUpload} className="form-control"/>
                        </div>

                        {/* S1 Sequence Upload */}
                        <div className="col">
                            <input type="file" name="s1upload" onChange={this.handleFileUpload} className="form-control"/>
                        </div>
                    </div>

                    {/* Sequences from Text Input */}
                    <div className="row">
                        {/* S0 Sequence Input */}
                        <div className="col">
                            <textarea name="s0text" value={this.state.s0text} onChange={this.handleChangeFields} id="" cols="30" rows="10" className="form-control"></textarea>
                        </div>

                        {/* S1 Sequence Input */}
                        <div className="col">
                            <textarea name="s1text" value={this.state.s1text} onChange={this.handleChangeFields} id="" cols="30" rows="10" className="form-control"></textarea>
                        </div>
                    </div>

                    {/* Alignment Edges */}
                    <div className="row">
                        {/* S0 Alignment Edge */}
                        <div className="col">
                            <label htmlFor="alignment" name="s0edge">Edge</label>
                            <select name="s0edge" id="" value={this.state.s0edge} onChange={this.handleChangeFields}>
                                <option value="">select an edge</option>
                                <option value="+">+</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="*">*</option>
                            </select>
                        </div>

                        {/* S1 Alignment Edge */}
                        <div className="col">
                            <label htmlFor="alignment" name="s1edge">Edge</label>
                            <select name="s1edge" id="" value={this.state.s1edge} onChange={this.handleChangeFields} className="custom-select">
                                <option value="">select an edge</option>
                                <option value="+">+</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="*">*</option>
                            </select>
                        </div>
                    </div>

                    <input type="submit" value="Align"/>
                </form>
            </div>
        );
    }
}