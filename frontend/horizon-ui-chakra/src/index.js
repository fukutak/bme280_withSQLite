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

// add myself
import { useQuery, useMutation, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const client = new ApolloClient({
	uri: process.env.REACT_APP_GRAPHQL_URI, // nginxリバースプロキシ使用するとき
	cache: new InMemoryCache(),
  });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
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
				</LocalizationProvider>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>,
);
