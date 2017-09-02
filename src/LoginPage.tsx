import * as React from 'react';

interface LoginPageProps {
    onLogin: Function;
}

export default class LoginPage extends React.Component<LoginPageProps>{
    render() {
        console.log("start rendering login page");
        return (
            <div className={"LoginPage"}>
                <div className={"WelcomeMessage"}>Teamker</div>
                <div className={"Introduction"}>
                    A fast and simple way to find the best teammates</div>
                <button className={"loginBtn loginBtn--facebook"}
                    onClick={this.props.onLogin.bind(this)}>
                    Continue with Facebook</button>
            </div>
        )
    }
}