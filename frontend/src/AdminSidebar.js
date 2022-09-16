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
        const buttons = this.props.sports.map(sport => {
                return <button className="sec-button" onClick={this.handleClick} key={sport} data-id={sport}>
                    {sport}
                    </button>
            })

        return (
            <section className="card">
                {buttons}
            </section>
        )
    }
}