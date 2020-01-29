import React from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
    const { values, onSubmit, onChange } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(cache, { data: { createPost: post } }) {
            let { getPosts: posts } = cache.readQuery({
                query: FETCH_POSTS_QUERY
            }); // Fetch posts from cache

            posts = [post, ...posts]; // append last post we created

            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: posts
                }
            }); // update apollo local cache

            values.body = '';
        },
        onError() {

        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input placeholder='enter post text' name='body' onChange={onChange} value={values.body} error={error ? true : false} />
                    <Button type='submit' color='teal'>Submit</Button>
                </Form.Field>
            </Form>
            {
                error && (
                    <div className='ui error message' style={{ marginBottom: '20px' }}>
                        <ul className='list'>
                            <li >{error.graphQLErrors[0].message}</li>
                        </ul>
                    </div>
                )
            }
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                id
                username
                createdAt
            }
            commentCount
            comments {
                id
                body
                username
                createdAt
            }
        }
    }
`;

export default PostForm;
