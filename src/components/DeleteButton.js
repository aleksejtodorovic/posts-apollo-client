import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({ callback, commentId, postId: id }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);

            if (!commentId) {
                let { getPosts: posts } = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });

                posts = posts.filter(post => post.id !== id);

                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: posts
                    }
                });
            }

            if (callback) {
                callback();
            }
        },
        variables: {
            postId: id,
            commentId
        }
    });

    return (
        <>
            <MyPopup content={`Delete ${commentId ? 'comment' : 'post'}`}>
                <Button as='div' color='red' floated="right" onClick={() => setConfirmOpen(true)} >
                    <Icon name='trash' style={{ margin: 0 }} />
                </ Button>
            </MyPopup>
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrMutation} />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(id: $postId) {
            id
        }
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;

export default DeleteButton;