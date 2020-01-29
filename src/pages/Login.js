import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';

import { useForm } from '../util/hooks';

function Login({ history }) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState([]);

    const { onChange, onSubmit, values } = useForm(loginCallback, {
        username: '',
        password: ''
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(cache, { data: { login: userData } }) {
            context.login(userData);
            history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: {
            ...values
        }
    });

    function loginCallback() {
        loginUser();
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username ...'
                    name='username'
                    type='text'
                    value={values.username}
                    error={!!errors.username}
                    onChange={onChange}
                />
                <Form.Input
                    label='Password'
                    placeholder='Password ...'
                    name='password'
                    type='password'
                    value={values.password}
                    error={!!errors.password}
                    onChange={onChange}
                />
                <Button type='submit' primary>
                    Login
                </Button>
            </Form>
            {
                Object.keys(errors).length > 0 && (
                    <div className='ui error message'>
                        <ul className='list'>
                            {Object.values(errors).map(value => (
                                <li key={value}>
                                    {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    );
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            loginInput: {
                username: $username
                password: $password
            }
        ) {
            id
            username
            token
        }
    }
`;
export default Login;