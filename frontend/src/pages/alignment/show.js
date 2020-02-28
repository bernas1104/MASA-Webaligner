import React, { Component } from 'react';
import api from '../../services/api';
import './styles.scss';


export default class ShowAlignment extends Component {
    constructor(props){
        super(props);

        this.state = {
            s0name: '',
            s1name: '',
            s0file: '',
            s1file: '',
        }
    }

    async componentDidMount() {
        const { data } = await api.get(`alignments/${this.props.match.params.id}`);
        this.setState({
            s0name: data.s0name,
            s1name: data.s1name,
            s0file: data.s0file,
            s1file: data.s1file,
        });
    }

    render(){
        return (
            <iframe src={`http://localhost:3001/results/${this.state.s0file}-${this.state.s1file}/alignment.00.txt`}
                    title={this.props.match.params.id}
                    width="1200"
                    height="500"
            >
            </iframe>
        );
    }
}