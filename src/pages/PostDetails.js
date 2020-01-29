import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Image, Card, Form, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

function PostDetails(props) {
    const { match: { params: { id } } } = props;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            id
        }
    });

    const [comment, setComment] = useState('');

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId: id,
            body: comment
        }
    });

    const deletePostCallback = () => {
        props.history.push('/');
    }

    let postMarkup;

    if (!data) {
        postMarkup = <p>Loading post ...</p>;
    } else {
        const { id, body, createdAt, username, likeCount, likes, commentCount, comments } = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content>
                                <LikeButton user={user} post={{ id, likes, likeCount }} />
                                <MyPopup content='Comment on post'>
                                    <Button as='div' labelPosition='right' onClick={() => console.log('comment')}>
                                        <Button color='teal' basic>
                                            <Icon name='comments' />
                                        </Button>
                                        <Label as='a' basic color='blue' pointing='left'>
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {
                                    user && user.username === username &&
                                    (
                                        <DeleteButton postId={id} callback={deletePostCallback} />
                                    )
                                }
                            </Card.Content>
                        </Card>
                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a comment</p>
                                        <Form>
                                            <div className='ui action input fluid'>
                                                <input
                                                    type='text'
                                                    placeholder='Enter comment ...'
                                                    name='comment'
                                                    value={comment}
                                                    onChange={({ target }) => setComment(target.value)}
                                                    ref={commentInputRef}
                                                />
                                                <button type='submit' className='ui button teal' disabled={comment.trim() === ''} onClick={submitComment}>
                                                    Submit
                                            </button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }
                        {
                            comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {
                                            user && user.username === username && (
                                                <DeleteButton postId={id} commentId={comment.id} />
                                            )
                                        }
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid >
        )
    }

    return postMarkup;
}

const FETCH_POST_QUERY = gql`
    query($id: ID!) {
        getPost(id: $id) {
            id
            createdAt
            username
            likeCount
            body
            likes {
                id
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`;

export default PostDetails;