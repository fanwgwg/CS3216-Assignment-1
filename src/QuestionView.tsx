import * as React from 'react';

import { Question } from './Utilities';

interface QuestionViewProps {
    index: number;
    question: Question;
    onQuestionAnswered: Function;
    onPreviousQuestionClicked: Function;
}

interface QuestionViewStates { }

export default class QuestionView extends React.Component<QuestionViewProps, QuestionViewStates> {
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
                    <div className={"Answer1"} onClick={this.props.onQuestionAnswered.bind(this)}>
                        {this.props.question.answer1}
                    </div>
                    <div className={"Answer2"} onClick={this.props.onQuestionAnswered.bind(this)}>
                        {this.props.question.answer2}
                    </div>
                </div>
                {backButton}
            </div>
        );
    }

    getQuestionTitle(): string {
        return "Question #" + this.props.index;
    }
}