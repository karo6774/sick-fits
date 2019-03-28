import React, {useState} from "react";
import {Mutation, Query} from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`;

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            description
            price
        }
    }
`;

const UpdateItem = ({id}) => {
    const [title, setTitle] = useState(undefined);
    const [description, setDescription] = useState(undefined);
    const [price, setPrice] = useState(undefined);

    function wrapSetter(setter) {
        return ({target}) => setter(target.value);
    }

    async function updateItem(e, updateItem) {
        e.preventDefault();
        const res = await updateItem({
            variables: {
                id: id,
                title,
                price,
                description
            }
        });
    }

    return (
        <Query query={SINGLE_ITEM_QUERY} variables={{id}}>
            {({data, loading}) => {
                if (loading) return <p>Loading...</p>;
                if (!data.item) return <p>No Item Found for ID {id}</p>;
                return (
                    <Mutation mutation={UPDATE_ITEM_MUTATION} variables={{title, description, price}}>
                        {(updateItemQuery, {loading, error}) => (
                            <Form
                                onSubmit={e => updateItem(e, updateItemQuery)}>
                                <Error error={error}/>
                                <fieldset disabled={loading} aria-busy={loading}>
                                    <label htmlFor="title">
                                        Title
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            placeholder="Title"
                                            required
                                            defaultValue={data.item.title}
                                            onChange={wrapSetter(setTitle)}
                                        />
                                    </label>
                                    <label htmlFor="price">
                                        Price
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            placeholder="Price"
                                            required
                                            defaultValue={data.item.price}
                                            onChange={wrapSetter(str => setPrice(parseFloat(str)))}
                                        />
                                    </label>
                                    <label htmlFor="description">
                                        Description
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter a description"
                                            required
                                            defaultValue={data.item.description}
                                            onChange={wrapSetter(setDescription)}
                                        />
                                    </label>
                                    <button type="submit">Sav{loading ? "ing" : "e"} Changes</button>
                                </fieldset>
                            </Form>
                        )}
                    </Mutation>
                );
            }}
        </Query>
    );
};

export default UpdateItem;
