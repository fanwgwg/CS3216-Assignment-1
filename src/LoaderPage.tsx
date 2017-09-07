import * as React from 'react';

interface LoaderPageProps {
    message: string;
    color: string;
    containerStyle?: any
}

interface LoaderPageStates { }

export default class LoaderPage extends React.Component<LoaderPageProps, LoaderPageStates> {
    render() {

        Utilities.initGA();
        Utilities.logPageView("placeholder", "/loader");
        

        return (
            <div className={"LoaderPage"} style={this.props.containerStyle}>
                <div className={"LoaderIcon"}>
                    <span className={"Loader"} style={{ border: "4px solid " + this.props.color }}>
                        <span className={"Loader-inner"} style={{ backgroundColor: this.props.color }}>
                        </span>
                    </span>
                </div>
                <div className={"Text"} style={{ color: this.props.color }}>{this.props.message}</div>
            </div>
        );
    }
}