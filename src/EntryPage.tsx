import * as React from 'react';

import * as Utilities from "./Utilities";

interface EntryPageProps {
    invovledList: Utilities.Group[];
    adminList: Utilities.Group[];
    onGroupEntrySelected: Function;
}

export default class Entrypage extends React.Component<EntryPageProps>{
    render() {
        let invGroupList: JSX.Element[] = [];
        let admGroupList: JSX.Element[] = [];
        let entry = "";

        for (let grp of this.props.invovledList) {
            //let groupStyle = (i == this.state.selectIndex) ? "GroupSelected" : "Group";
            invGroupList.push(
                <div className={"Group"} onClick={this.props.onGroupEntrySelected.bind(this, "member", grp.id)}>
                    {grp.name}</div>
            );
        }
        for (let grp of this.props.adminList) {
            //let groupStyle = (i == this.state.selectIndex) ? "GroupSelected" : "Group";
            admGroupList.push(
                <div className={"Group"} onClick={this.props.onGroupEntrySelected.bind(this, "admin", grp.id)}>
                    {grp.name}</div>
            );
        }
        return (
            <div className={"EntryPage"}>
                <div className={"Left"}>
                    <div className={"GroupPanel"}>
                        <div className={"Title"}>I'm a member</div>
                        <div className={"GroupList"}>{invGroupList}</div>
                    </div>
                </div>
                <div className={"Right"}>
                    <div className={"GroupPanel"}>
                        <div className={"Title"}>I'm an admin</div>
                        <div className={"GroupList"}>{admGroupList}</div>
                    </div>
                </div>
            </div>
        );
    }
}