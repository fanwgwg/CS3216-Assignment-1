import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as Utilities from './Utilities';

interface QuestionViewProps {
    index: number;
    question: Utilities.Question;
    isUnfinished: boolean;
    isDescriptionQuestion: boolean;
    onDescriptionUpdated: Function;
    onQuestionAnswered: Function;
}

interface QuestionViewStates {
    score: number;
}

export default class QuestionView extends React.Component<QuestionViewProps, QuestionViewStates> {

    bodyColor = { color: "white" };

    constructor(props: QuestionViewProps) {
        super(props);

        this.state = {
            score: -1
        };
    }

    componentWillReceiveProps(nextProps: QuestionViewProps) {
        if (nextProps.isUnfinished) {
            this.bodyColor = { color: "#ffb5b5" };
            let currentRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
            window.scrollBy(0, currentRect.top - 50);
            setTimeout(function () {
                this.bodyColor = { color: "white" };
                this.forceUpdate();
            }.bind(this), 1000);
        }
    }

    render() {

        Utilities.initGA();
        Utilities.logPageView("placeholder", "/questions");
        

        if (this.props.isDescriptionQuestion) {
            return (
                <div className={"QuestionContainer"}>
                    <form>
                        <div className={"Body"} style={this.bodyColor}>{this.getQuestionBody()}</div>
                        <input type="text" onChange={this.updateDescription.bind(this)} />
                    </form>
                </div>
            );
        }

        let scores: JSX.Element[] = [];

        for (let i = 0; i <= 10; i++) {
            let name = (i == this.state.score) ? "ScoreSquareSelected" : "ScoreSquare";
            scores.push(<div className={name} key={i} onClick={this.updateScore.bind(this, i)}>{i}</div>);
        }

        return (
            <div className={"QuestionContainer"}>
                <div className={"Body"} style={this.bodyColor}>{this.getQuestionBody()}</div>
                <div className={"Answers"}>
                    <div className={"Scores"}>{scores}</div>
                    <div className={"Explainations"}>
                        <div>don't know</div>
                        <div>very familiar</div>
                    </div>
                </div>
            </div>
        );
    }

    getQuestionBody(): string {
        if (this.props.isDescriptionQuestion) {
            return (this.props.index + 1) + ". " + "One-line description about yourself";
        } else {
            return (this.props.index + 1) + ". " + this.props.question.body;
        }
    }

    updateScore(score: number): void {
        this.props.onQuestionAnswered(this.props.index, score);
        this.setState({
            score: score
        })
    }

    updateDescription(event: any): void {
        let text = event.target.value.trim();
        this.props.onDescriptionUpdated(text);
    }
}