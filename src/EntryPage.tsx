import * as React from 'react';

import LoaderPage from "./LoaderPage";
import * as Utilities from "./Utilities";

interface EntryPageProps {
    isLoading: boolean;
    involvedList: Utilities.Group[];
    adminList: Utilities.Group[];
    onGroupEntrySelected: Function;
}

export default class Entrypage extends React.Component<EntryPageProps>{
    render() {
        let invGroupList: JSX.Element[] = [];
        let admGroupList: JSX.Element[] = [];
        let leftMessage: JSX.Element = null;
        let rightMessage: JSX.Element = null;
        let loader: JSX.Element = null;
        let entry = "";

        if (!this.props.isLoading) {
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

            if (invGroupList.length == 0) {
                leftMessage = (
                    <div className={"Message"}>You don't have any Facebook groups on Teamker.</div>
                )
            }

            if (admGroupList.length == 0) {
                rightMessage = (
                    <div className={"Message"}>You are not the admin of any Facebook group yet.</div>
                )
            }
        } else {
            loader = < LoaderPage message={"We are finding your groups..."} color={"#7B7B7B"} />
        }

        return (
            <div className={"EntryPage"}>
                <div className={"Left"}>
                    <div className={"GroupPanel"}>
                        <div className={"Title"}>I'm a member</div>
                        <div className={"GroupList"}>{invGroupList}</div>
                        {leftMessage}
                        {loader}
                    </div>
                </div>
                <div className={"Right"}>
                    <div className={"GroupPanel"}>
                        <div className={"Title"}>I'm an admin</div>
                        <div className={"GroupList"}>{admGroupList}</div>
                        {rightMessage}
                        {loader}
                    </div>
                </div>
            </div>
        );
    }
}