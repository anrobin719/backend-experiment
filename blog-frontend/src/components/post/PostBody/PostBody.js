import React from 'react';
import styles from './PostBody.scss';
import classNames from 'classnames/bind';
import MarkDownRender from '../../../components/common/MarkdownRender';

const cx = classNames.bind(styles);

const PostBody = ({body}) => (
    <div className={cx('post-body')}>
        <div className={cx('paper')}>
            <MarkDownRender markdown={body} />
        </div>
    </div>
);

export default PostBody;