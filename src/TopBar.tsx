import * as React from 'react';

interface TopBarProps {
    appTitle: string
}

interface TopBarStates { }

export default class TopBar extends React.Component<TopBarProps, TopBarStates> {
    render() {
        return (
            <div className={"TopBar"}>
                <img className={"Logo"} src={require("../resources/icons/logo.png")} />
                <div className={"Title"}>{this.props.appTitle}</div>
                {/* Facebook user related here... */}
            </div>
        );
    }
}