import React, {useState} from "react";
import {Mutation} from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/format-money";
import Error from "./ErrorMessage";

export const CREATE_ITEM_MUTATION = gql`    
    mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: Upload!
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
        ) {
            id
        }
    }
`;

const CreateItem = () => {
    const [title, setTitle] = useState("Cool Shoes");
    const [description, setDescription] = useState("I love those Context");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState(1000);

    function wrapSetter(setter) {
        return ({target}) => setter(target.value);
    }

    return (
        <Mutation mutation={CREATE_ITEM_MUTATION} variables={{title, description, image, price}}>
            {(createItem, {loading, error}) => (
                <Form
                    onSubmit={async e => {
                        e.preventDefault();
                        const res = await createItem();
                        Router.push({
                            pathname: "/item",
                            query: {id: res.data.createItem.id}
                        });
                    }}>
                    <Error error={error}/>
                    <fieldset disabled={loading} aria-busy={loading}>
                        <label htmlFor="file">
                            Image
                            <input
                                type="file"
                                id="file"
                                name="file"
                                accept="image/jpeg,image/png"
                                placeholder="Upload an image"
                                required
                                onChange={({target}) => setImage(target.files[0])}
                            />
                        </label>
                        <label htmlFor="title">
                            Title
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Title"
                                required
                                value={title}
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
                                value={price}
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
                                value={description}
                                onChange={wrapSetter(setDescription)}
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </fieldset>
                </Form>
            )}
        </Mutation>
    );
};

export default CreateItem;
