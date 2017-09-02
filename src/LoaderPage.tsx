import * as React from 'react';

export default class LoaderPage extends React.Component {
    render() {
        return (
            <div className={"LoaderPage"}>
                <span className={"Loader"}>
                    <span className={"Loader-inner"}>
                    </span>
                </span>
                <div className={"Text"}>We are finding your best match now...</div>
            </div>
        );
    }
}