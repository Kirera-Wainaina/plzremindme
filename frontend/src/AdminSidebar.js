import React from "react";

export default class AdminSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.component(e.target.dataset.id)
    }

    render() {
        return (
            <section className="card">
                <button className="button" onClick={this.handleClick} data-id='AdminFormula1'>Formula 1</button>
                <button className="button" onClick={this.handleClick} data-id='AdminFootball'>Football</button>
            </section>
        )
    }
}