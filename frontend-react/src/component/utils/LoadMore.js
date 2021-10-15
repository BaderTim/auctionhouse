import React from "react";
import "./filter.css";

export default class LoadMore extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            loading: false
        })
    }



    async onLoadMore() {
        await this.setState({loading: true})
        await this.props.load_more(this.props.offset+this.props.base_offset);
        await this.setState({loading: false})
    }

    render() {
        //  --PROPS--
        //  handleState 
        return(<div className="load-more-container" style={{display:"flex",justifyContent: "center"}}>
            {this.state.loading ? (
                <div className="d-flex justify-content-center" style={{width: "54px", height: "33px"}}>
                    <div className="spinner-border text-primary"  role="status"></div>
                </div>
            ) : (
                this.props.end ? (
                    this.props.chat ? (
                        <p className="lead fw-bold" style={{textAlign: "center"}}>Could not find any more messages.</p>
                    ) : (
                        <p className="lead fw-bold" style={{textAlign: "center"}}>Could not find any more auctions that fit your filter options.</p>
                    )
                ) : (
                    <button className="btn btn-primary" onClick={() => (this.onLoadMore())}>Load More</button>
                    )
            )}
        </div>);
    }

}