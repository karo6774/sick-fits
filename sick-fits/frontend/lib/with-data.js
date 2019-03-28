import withApollo from 'next-with-apollo';
import {endpoint} from '../config';
import ApolloClient from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {onError} from "apollo-link-error";
import {ApolloLink} from "apollo-link";
import {createUploadLink} from "apollo-upload-client";

function createClient({headers}) {
    return new ApolloClient({
        link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors)
                    graphQLErrors.map(({ message, locations, path }) =>
                        console.log(
                            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                        ),
                    );
                if (networkError) console.log(`[Network error]: ${networkError}`);
            }),
            createUploadLink({
                uri: endpoint,
                credentials: 'include'
            })
        ]),
        cache: new InMemoryCache()
    });
}

export default withApollo(createClient);
