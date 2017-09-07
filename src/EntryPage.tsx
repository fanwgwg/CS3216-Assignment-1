import * as React from 'react';

import * as Utilities from "./Utilities";

interface EntryPageProps {
    involvedList: Utilities.Group[];
    adminList: Utilities.Group[];
    onGroupEntrySelected: Function;
}

export default class Entrypage extends React.Component<EntryPageProps>{
    render() {
        let invGroupList: JSX.Element[] = [];
        let admGroupList: JSX.Element[] = [];
        let entry = "";

        let i = 0;
        for (let grp of this.props.involvedList) {
            //let groupStyle = (i == this.state.selectIndex) ? "GroupSelected" : "Group";
            invGroupList.push(
                <div className={"Group"} key={i++} onClick={this.props.onGroupEntrySelected.bind(this, "User", grp.id)}>
                    {grp.name}</div>
            );
        }

        i = 0;
        for (let grp of this.props.adminList) {
            //let groupStyle = (i == this.state.selectIndex) ? "GroupSelected" : "Group";
            admGroupList.push(
                <div className={"Group"} key={i++} onClick={this.props.onGroupEntrySelected.bind(this, "Admin", grp.id)}>
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