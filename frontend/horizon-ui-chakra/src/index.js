import React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';

import { useQuery, useMutation, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
	uri: 'http://localhost:5000/graphql', // Replace with your actual GraphQL server endpoint
	cache: new InMemoryCache(),
  });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
			<ApolloProvider client={client}>
				<HashRouter>
					<Switch>
						<Route path={`/auth`} component={AuthLayout} />
						<Route path={`/admin`} component={AdminLayout} />
						<Route path={`/rtl`} component={RtlLayout} />
						<Redirect from='/' to='/admin' />
					</Switch>
				</HashRouter>
				</ApolloProvider>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>,
);