import React, { useContext, } from 'react';
import { Grid } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY);
    const { user } = useContext(AuthContext);

    const renderPosts = () => {
        return data && data.getPosts.map(post => {
            return (
                <Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
                    <PostCard post={post} />
                </Grid.Column>
            )
        })
    };

    return (
        <Grid columns={3}>
            <Grid.Row className='page-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )
                }
                {
                    loading ? (<h1>Loading Posts ...</h1>) : (renderPosts())
                }
            </Grid.Row>
        </Grid>
    );
}

export default Home;