import React, { Component } from 'react';
import styles from './MarkdownRender.scss';
import classNames from 'classnames/bind';

import marked from 'marked';

// prismJS code
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-bash.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-jsx.min.js';
import 'prismjs/components/prism-css.min.js';

const cx = classNames.bind(styles);

class MarkdownRender extends Component {
    state = {
        html: ''
    }

    renderMarkdown = () => {
        const { markdown } = this.props;
        if (!markdown) {
            this.setState({ html: '' });
            return;
        }
        this.setState({
            html: marked(markdown, {
                breaks: true, // 일반 엔터로 새 줄 입력
                sanitize: true // 마크다운 내부 html 무시
            })
        });
    }

    // 서버사이드 렌더링에서도 마크다운 처리가 되도록 constructor에서도 구현
    constructor(props) {
        super(props);
        const { markdown } = props;
        this.state = {
            html: markdown ? marked(props.markdown, { break: true, sanitize: true }) : ''
        }
    }

    componentDidMount() {
        Prism.highlightAll();
    }
    
    componentDidUpdate(prevProps, prevState) {
        // markdown 값이 변경되면 renderMarkdown 호출
        if(prevProps.markdown !== this.props.markdown) {
            this.renderMarkdown();
        }
        // state가 바뀌면 코드 하이라이팅
        if(prevState.html !== this.state.html) {
            Prism.highlightAll();
        }
    }

    render() {
        const { html } = this.state;
        
        // React에서 html을 렌더링하려면 객체를 만들어 내부에 __html 값을 설정해야 함
        const markup = {
            __html: html
        }
        // 그리고 dangerouslySetInnerHTML 값에 해당 객체를 넣어주면 됨
        return (
            <div className={cx('markdown-render')} dangerouslySetInnerHTML={markup} />
        );
    }
}

export default MarkdownRender;