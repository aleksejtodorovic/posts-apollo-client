import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likes, likeCount } }) {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_MUTATION, {
        variables: {
            id
        }
    });

    const likeButton = user ? (
        liked ? (
            <Button color='teal' onClick={likePost}>
                <Icon name='heart' />
            </Button>
        ) : (
                <Button color='teal' basic onClick={likePost}>
                    <Icon name='heart' />
                </Button>
            )
    ) : (
            <Button as={Link} to='/login' color='teal' basic>
                <Icon name='heart' />
            </Button>
        )

    return (
        <MyPopup content={liked ? 'Unlike' : 'Like'}>
            <Button as='div' labelPosition='right'>
                {likeButton}
                <Label as='a' basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        </MyPopup>
    );
}

const LIKE_MUTATION = gql`
    mutation likePost($id: ID!) {
        likePost(id: $id) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`;

export default LikeButton;