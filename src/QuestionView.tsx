import * as React from 'react';

import { Question } from './Utilities';

interface QuestionViewProps {
    index: number;
    question: Question;
    onQuestionAnswered: Function;
    onPreviousQuestionClicked: Function;
}

interface QuestionViewStates {
    rangeValue: number;
}

export default class QuestionView extends React.Component<QuestionViewProps, QuestionViewStates> {

    constructor(props: QuestionViewProps) {
        super(props);

        this.state = {
            rangeValue: 5
        };
    }

    render() {
        let backButton: JSX.Element = null;

        if (this.props.index > 0) {
            backButton = <div className={"Back"} onClick={this.props.onPreviousQuestionClicked.bind(this)}>
                <img className={"BackButton"} src={require("../resources/icons/back.png")}
                />
                <div className={"BackButtonDesc"}>Previous question</div>
            </div>
        }

        return (
            <div className={"QuestionContainer"}>
                <div className={"Title"}>{this.getQuestionTitle()}</div>
                <div className={"Body"}>{this.props.question.body}</div>
                <div className={"Answers"}>
                    <input id="rangeInput" type="range" min="1" max="10" step="any" defaultValue="5" onChange={this.updateRangeInputValue.bind(this)} />
                    <div className={"InputValue"}>{this.state.rangeValue}</div>
                    <div className={"OkButton"} onClick={this.props.onQuestionAnswered.bind(this)}>Next</div>
                </div>
                {backButton}
            </div>
        );
    }

    getQuestionTitle(): string {
        return "Question #" + (this.props.index + 1);
    }

    updateRangeInputValue(event: any) {
        this.setState({
            rangeValue: Math.floor(event.target.value)
        })
    }
}