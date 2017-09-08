import * as React from 'react';

import UserCard from './UserCard';
import UserDetails from './UserDetails';
import * as Utilities from './Utilities';

export interface MainPageProps { 
    userList: Utilities.User[];
    onSwitchGroup: Function;
}

export interface MainPageStates {
    shouldUserDetailOpen: boolean;
}

export default class MainPage extends React.Component<MainPageProps, MainPageStates> {
    currentUserIndex: number = -1;

    constructor(props: MainPageProps) {
        super(props);

        this.state = {
            shouldUserDetailOpen: false
        }
    }

    render() {

        Utilities.initGA();
        Utilities.logPageView("placeholder", "/main");

        let userCards: JSX.Element[] = [];
        let userDetails: JSX.Element = null;

        let index = 0;
        userCards = this.props.userList.map(x => <UserCard key={index} user={x} index={++index} onUserCardClick={this.openUserDetails.bind(this)} />);

        if (this.state.shouldUserDetailOpen) {
            let user = this.props.userList[this.currentUserIndex];
            userDetails = <UserDetails user={user} onCloseButtonClicked={this.closeUserDetails.bind(this)} />
        }

        return (
            <div className={"MainPage"}>
                <div className={"Header"}>
                    <div>Here are our recommended match for you...</div>
                    <div className={"SwitchGroupButton"} onClick={this.props.onSwitchGroup.bind(this)}>Switch Group</div>
                </div>
                {userDetails}
                <div className={"UserList"}>
                    {userCards}
                </div>
            </div>
        )
    };

    openUserDetails(index: number): void {
        this.setState({
            shouldUserDetailOpen: true
        })

        this.currentUserIndex = index;
    }

    closeUserDetails(): void {
        this.setState({
            shouldUserDetailOpen: false
        })

        this.currentUserIndex = -1;
    }
}
